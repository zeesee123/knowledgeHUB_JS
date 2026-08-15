import Redis from 'ioredis';
import {env} from '../config/env';

const redis=new Redis(env.REDIS_URL,{
    maxRetriesPerRequest:1,
    enableOfflineQueue:false,
    connectTimeout:2000,
    retryStrategy:()=>null,
});

redis.on('error',(err)=>{
    console.error('redis error',err.message);
})

export default redis;