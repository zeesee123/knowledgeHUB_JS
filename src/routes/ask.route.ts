import express from 'express';
import pool from '../db/pool';
import {authMiddleware} from '../middleware/auth';
import {askDocument} from '../services/rag.service';

const router=express.Router();

router.post('/',authMiddleware,async(req:any,res:any)=>{

    try{
        const {documentId,question}=req.body;

        if(!documentId||!question?.trim()){

            return res.status(422).json({
                status:false,
                message:'documentId and question are required'
            });
        }

        const doc=await pool.query(
            'SELECT id,status FROM documents where id=$1 and user_id=$2',
            [documentId,req.user.id]
        );

        if(!doc.rows.length){
            return res.status(404).json({status:false,message:'document not found'});
        }

        if(doc.rows[0].status!=='ready'){
            return res.status(400).json({
                status:false,
                message:`document is ${doc.rows[0].status}, wait until ready`,
            });
        }

        const result = await askDocument(Number(documentId),question.trim());

        return res.status(200).json({
            status:true,
            answer:result.answer,
            sources:result.sources,
        });
    }catch(err:any){
        return res.status(500).json({
            status:false,
            message:err.message||'ask failed'
        });
    }
});

export default router;