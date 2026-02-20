import express from 'express';
var router = express.Router();

import cardsRouter from './controllers/cards.js';
import packsRouter from './controllers/packs.js';
import userRouter from './controllers/user.js';

router.use('/cards', cardsRouter);
router.use('/packs', packsRouter);
router.use('/user', userRouter);

export default router;
