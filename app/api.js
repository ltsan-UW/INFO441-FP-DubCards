import express from 'express';
var router = express.Router();

import cardsRouter from './routes/cards.routes.js';
import storeRouter from './routes/store.routes.js';
import userRouter from './routes/user.routes.js';

router.use('/cards', cardsRouter);
router.use('/store', storeRouter);
router.use('/user', userRouter);

export default router;
