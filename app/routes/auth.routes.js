import express from 'express';
var router = express.Router();

import * as authController from '../controllers/auth.controller.js';

router.post('/register', authController.register);
router.get('/signin', authController.signIn);
router.get('/signout', authController.signOut);
router.get('/user', authController.getUser);


export default router;
