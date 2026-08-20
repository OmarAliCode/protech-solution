const express=require('express');
const multer=require('multer');
const path=require('path');
const fs=require('fs');
const crypto=require('crypto');
const app=express();
const PORT=process.env.PORT||3000;
const ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||'ChangeMe123!';
const uploadDir=path.join(__dirname,'uploads');
if(!fs.existsSync(uploadDir))fs.mkdirSync(uploadDir,{recursive:true});
const storage=multer.diskStorage({
 destination:(req,file,cb)=>cb(null,uploadDir),
 filename:(req,file,cb)=>{const ext=path.extname(file.originalname).toLowerCase();cb(null,Date.now()+'-'+crypto.randomBytes(5).toString('hex')+ext)}
});
const allowed=['.pdf','.doc','.docx'];
const upload=multer({storage,fileFilter:(req,file,cb)=>{const ext=path.extname(file.originalname).toLowerCase();cb(allowed.includes(ext)?null:new Error('Only PDF, DOC and DOCX files are allowed.'),allowed.includes(ext))},limits:{fileSize:10*1024*1024}});
app.use(express.json());app.use(express.urlencoded({extended:true}));app.use(express.static(path.join(__dirname,'public')));
const dbFile=path.join(__dirname,'submissions.json');
function readDb(){try{return JSON.parse(fs.readFileSync(dbFile,'utf8'))}catch{return []}}
function writeDb(data){fs.writeFileSync(dbFile,JSON.stringify(data,null,2))}
function admin(req,res,next){if(req.headers['x-admin-password']!==ADMIN_PASSWORD)return res.status(401).json({error:'Unauthorized'});next()}
app.post('/api/submit',upload.fields([{name:'cv',maxCount:1},{name:'resume',maxCount:1},{name:'coverLetter',maxCount:1}]),(req,res)=>{
 const files=req.files||{}; const submission={id:crypto.randomUUID(),createdAt:new Date().toISOString(),name:req.body.name||'',email:req.body.email||'',phone:req.body.phone||'',service:req.body.service||'',notes:req.body.notes||'',files:{}};
 for(const key of ['cv','resume','coverLetter'])if(files[key]?.[0])submission.files[key]={originalName:files[key][0].originalname,filename:files[key][0].filename,size:files[key][0].size};
 if(!submission.name||!submission.email||Object.keys(submission.files).length===0)return res.status(400).json({error:'Name, email and at least one document are required.'});
 const db=readDb();db.unshift(submission);writeDb(db);res.json({ok:true,message:'Your documents were uploaded successfully.'});
});
app.post('/api/admin/login',(req,res)=>{res.json({ok:req.body.password===ADMIN_PASSWORD})});
app.get('/api/admin/submissions',admin,(req,res)=>res.json(readDb()));
app.get('/api/admin/file/:filename',admin,(req,res)=>{const safe=path.basename(req.params.filename);const file=path.join(uploadDir,safe);if(!fs.existsSync(file))return res.status(404).send('File not found');res.download(file)});
app.delete('/api/admin/submissions/:id',admin,(req,res)=>{const db=readDb();const item=db.find(x=>x.id===req.params.id);if(!item)return res.status(404).json({error:'Not found'});Object.values(item.files||{}).forEach(f=>{const p=path.join(uploadDir,path.basename(f.filename));if(fs.existsSync(p))fs.unlinkSync(p)});writeDb(db.filter(x=>x.id!==req.params.id));res.json({ok:true})});
app.use((err,req,res,next)=>res.status(400).json({error:err.message||'Upload failed'}));
app.listen(PORT,()=>console.log(`Protech Solution running at http://localhost:${PORT}`));
