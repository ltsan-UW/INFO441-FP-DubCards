import express from 'express';
var router = express.Router();

import cardsRouter from './controllers/cards.js';
import packsRouter from './controllers/packs.js';
import usersRouter from './controllers/users.js';

router.use('/cards', cardsRouter);
router.use('/packs', packsRouter);
router.use('/users', usersRouter);

export default router;
