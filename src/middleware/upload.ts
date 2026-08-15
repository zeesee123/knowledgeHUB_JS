import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';


const uploadDir=path.join(process.cwd(),'uploads');

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}

const storage=multer.diskStorage({
    destination:(_req,_file,cb)=>{
        cb(null,uploadDir);
    },
    filename:(_req,_file,cb)=>{
        const unique=`${Date.now()}-${crypto.randomBytes(8).toString('hex')}.pdf`;
        cb(null,unique);
    },
});

function fileFilter(_req:any,file:Express.Multer.File,cb:multer.FileFilterCallback){
    if(file.mimetype!=='application/pdf'){
        return cb(new Error('only PDF files are allowed'));
    }
    cb(null,true);
}

export const upload=multer({
    storage,
    fileFilter,
    limits:{fileSize:10*1024*1024},
})


