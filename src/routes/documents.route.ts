import express from 'express';
import path from 'path';
import pool from '../db/pool';
import {authMiddleware} from '../middleware/auth';
import {upload} from '../middleware/upload';
import {enqueueDocumentJob} from '../queues/document.queue';

const router=express.Router();

router.get('/',authMiddleware,async(req:any,res:any)=>{

    const result=await pool.query(`SELECT id,filename,status,created_at FROM documents WHERE user_id=$1 ORDER BY created_at DESC`,[
        req.user.id
    ]);

    res.status(200).json({status:true,documents:result.rows});
})

router.post('/',authMiddleware,upload.single('file'),async(req:any,res:any)=>{

    try{
        if(!req.file){
            return res.status(422).json({status:false,message:'PDF file is required'});
        }

        const result=await pool.query(`insert into documents (user_id,filename,status) values ($1,$2,$3) returning  id,filename,status,created_at`,[req.user.id,req.file.filename,'pending']);

        const doc = result.rows[0];
        await enqueueDocumentJob(doc.id, doc.filename);

        return res.status(201).json({ status: true, message: 'document uploaded', document: doc });

        


    }catch(err:any){

        return res.status(500).json({status:false,message:err.message||'upload failed'});


    }
});


router.get('/:id',authMiddleware,async(req:any,res:any)=>{
  
    const result=await pool.query(`SELECT id,filename,status,created_at from documents where id=$1 AND user_id=$2`,[req.params.id,req.user.id]);

    if(!result.rows.length){
        return res.status(404).json({status:false,message:'document not found'});
    }

    res.status(200).json({status:true,document:result.rows[0]});
});


export default router;