import express from 'express';
import {signup,signin} from '../collections/auth.js';

const router=express.Router();

router.get('/',(req,res)=>res.send('WELCOME TO MY WEBSITE'))

router.post('/signup',signup)

router.post('/signin',signin)

export default router;