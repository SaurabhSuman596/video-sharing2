import express from 'express';
import { googleAuth, signIn, signUp } from '../controllers/auth';

const router = express.Router();

// Register
router.post('/signup', signUp);

// login

router.post('/signin', signIn);

// GoogleAuth

router.post('/google', googleAuth);

export default router;
