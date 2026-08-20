PROTECH SOLUTION WEBSITE

This version keeps the existing purple/white Protech Solution theme and adds:
- CV, Resume and Cover Letter writing/review services
- Upload form for CV, Resume and Cover Letter
- PDF/DOC/DOCX validation, 10 MB per file
- Call and email buttons
- Admin login/dashboard
- Admin can see uploaded submissions and download/delete documents
- Uploaded documents are stored on the server in /uploads

RUN LOCALLY:
1. Install Node.js (LTS).
2. Open Command Prompt in this folder.
3. Run: npm install
4. Run: npm start
5. Open http://localhost:3000
6. Admin: http://localhost:3000/admin.html

ADMIN PASSWORD:
Default is ChangeMe123! only for local testing. Change it before deployment.
Windows CMD example:
set ADMIN_PASSWORD=YourStrongPasswordHere
npm start

IMPORTANT SECURITY:
For a real public deployment, use HTTPS, a proper user authentication system, secure environment variables, file scanning, backups, access controls, and a database/storage service. Do not expose uploaded CVs publicly.
