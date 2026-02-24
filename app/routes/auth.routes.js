import express from 'express';
var router = express.Router();

import * as authController from '../controllers/auth.controller.js';

router.post('/register', authController.register);
router.post('/signin', authController.signIn);
router.post('/signout', authController.signOut);


export default router;
