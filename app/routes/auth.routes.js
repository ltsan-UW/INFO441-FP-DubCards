import express from 'express';
var router = express.Router();

import * as authController from '../controllers/auth.controller';

router.get('/login', authController.login);
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/signout', authController.signOut);


export default router;
