import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../db/pool';
import {env} from '../config/env';
import {authMiddleware} from '../middleware/auth';

const router=express.Router();

router.post('/register',async(req,res)=>{

    const {email,password}=req.body;

    if(!email?.trim()||!password?.trim()){
        return res.status(422).json({status:false,message:'please enter in the email and password'});
    }

    const hashedPassword=await bcrypt.hash(password,10);

    const result=await pool.query(`INSERT INTO users (email,password_hash) values ($1,$2) returning id,email`,[email,hashedPassword]);


   if(!result.rows.length){
    
    return res.status(500).json({
        status:false,
        message:'user not inserted'
    });

   }

   res.status(201).json({
    status:true,
    message:'user added',
    user:result.rows[0]
   })


    
});


router.post('/login',async(req,res)=>{
  
    const {email,password}=req.body;

    if(!email||!password){
        return res.status(422).json({status:false,message:'email and password is required'});
    }

   const findUser=await pool.query('SELECT id,email,password_hash from users where email=$1',[email]);

   if(!findUser.rows.length){
    return res.status(401).json({status:false,message:'Invalid credentials'});
   }
   
   const passwordCheck=await bcrypt.compare(password,findUser.rows[0].password_hash);//return is boolean

   if(!passwordCheck){

        console.log('wrong password');
        return res.status(401).json({status:false,message:'Invalid credentials'});
        
   }




   const payload={id:findUser.rows[0].id,email};

   const token=jwt.sign(payload,env.JWT_SECRET,{expiresIn:'2h'});

   res.status(200).json({status:true,message:'Login successful',access_token:token});

});


router.get('/me', authMiddleware, async (req: any, res: any) => {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
  
    if (!result.rows.length) {
      return res.status(404).json({ status: false, message: 'user not found' });
    }
  
    return res.status(200).json({ status: true, user: result.rows[0] });
  });


export default router;