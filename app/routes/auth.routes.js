import express from 'express';
var router = express.Router();

import * as authController from '../controllers/auth.controller.js';

router.get('/callback', authController.callback);
router.get('/signin', authController.signIn);
router.get('/signout', authController.signOut);
router.get('/user', authController.getUser);


export default router;
