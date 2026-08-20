document.getElementById('year').textContent=new Date().getFullYear();
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>document.getElementById('service').value=a.dataset.service));
const form=document.getElementById('uploadForm'),status=document.getElementById('status');
form.addEventListener('submit',async e=>{e.preventDefault();status.textContent='Uploading...';status.className='status';try{const r=await fetch('/api/submit',{method:'POST',body:new FormData(form)});const d=await r.json();if(!r.ok)throw new Error(d.error);status.textContent=d.message;status.className='status success';form.reset()}catch(err){status.textContent=err.message;status.className='status error'}});
