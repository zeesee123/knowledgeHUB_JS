import {Pool} from 'pg';
import {env} from '../config/env';

// const pool=new Pool({
//     user:'postgres',
//     host:'localhost',
//     database:'knowledgehub',
//     password:'root',
//     port:5433
// });

const pool=new Pool({
    connectionString:env.DB_URL
});


pool.connect().then(client=>{
    console.log('postgres connected');
    client.release();
}).catch(err=>{
    console.log('connection error',err.stack);
});

export default pool;