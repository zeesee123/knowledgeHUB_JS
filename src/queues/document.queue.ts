import {Queue} from 'bullmq';
import IORedis from 'ioredis';
import {env} from '../config/env';

//BullMQ needs its own connection (not the health redis client)
export const redisConnection=new IORedis(env.REDIS_URL,{
    maxRetriesPerRequest:null,
});

export const documentQueue=new Queue('document-processing',{
    connection:redisConnection,
});

export async function enqueueDocumentJob(documentId:number,filename:string){
    return documentQueue.add(
        'process-document',{documentId,filename},{
            attempts:3,
            backoff:{type:'exponential',delay:2000},
            removeOnComplete:50,
            removeOnFail:50,
        }
    );
}