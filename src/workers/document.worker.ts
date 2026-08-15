import {Worker} from 'bullmq';
import pool from '../db/pool';
import {redisConnection} from '../queues/document.queue';
import {extractPdfText} from '../services/pdf.service';
import {indexDocument} from '../services/rag.service';


const worker=new Worker('document-processing',async(job)=>{
    
    const {documentId,filename}=job.data as {
        documentId:number;
        filename:string;
    };

    console.log(`processing document ${documentId} (${filename})`);

    await pool.query(
        `UPDATE documents SET status='processing' WHERE id=$1`,[documentId]
    );

    const text=await extractPdfText(filename);

    if(!text){
        throw new Error('no text extracted from PDF');
    }

    const count=await indexDocument(documentId,text);

    await pool.query(
        `UPDATE documents SET status='ready' WHERE id=$1`,[documentId]
    );

    console.log(`document ${documentId} ready (${count} chunks)`);
    return {documentId,chunks:count};
},{connection:redisConnection});


worker.on('failed',async(job,err)=>{
    
    console.error('job failed',job?.id,err.message);

    const documentId=job?.data?.documentId;

    if(documentId){
        await pool.query(
            `UPDATE documents SET status='failed' WHERE id=$1`,[documentId]
        )
    }
});

worker.on('completed',(job)=>{
    console.log('job completed',job.id);
});

console.log('document worker started');