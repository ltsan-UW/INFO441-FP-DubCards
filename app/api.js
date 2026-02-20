import express from 'express';
var router = express.Router();

import cardsRouter from './routes/cards.routes.js';
import packsRouter from './routes/packs.routes.js';
import userRouter from './routes/user.routes.js';

router.use('/cards', cardsRouter);
router.use('/packs', packsRouter);
router.use('/user', userRouter);

export default router;
