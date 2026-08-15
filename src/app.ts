import express from 'express';
import redis from './lib/redis';
import pool from './db/pool';
import authRoutes from './routes/auth.route';
import docRoutes from './routes/documents.route';
import askRoutes from './routes/ask.route';

const app=express();


app.use(express.json());

app.get('/health',async(req,res)=>{

    const health={
        app:'ok',
        db:'unknown',
        redis:'unknown'
    };

    try{
        await pool.query('SELECT 1');
        health.db='ok';
    }catch(err){
        health.db='down';
    }

    try{
        await redis.set('health_check','ok','EX',5);
        health.redis='ok';
    }catch(err){
        health.redis='down';
    }

    const isHealthy=health.db==='ok'&&health.redis==='ok';

    res.status(isHealthy?200:500).json({...health,uptime:process.uptime(),timestamp:Date.now()});
   
});

//auth routes will come in here 
app.use('/auth',authRoutes);

app.use('/documents',docRoutes);

app.use('/ask',askRoutes);

export default app;