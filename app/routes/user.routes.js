import express from 'express';
var router = express.Router();

import * as userController from '../controllers/user.controller.js';

// GET /user/:id - Allows users to see their information; what cards they have, their trade requests and their favorites list.
router.get('/:id', userController.getUser);

// POST /user/cards - Allows users to sell cards that they have.
router.post('/cards', userController.postCards);

// POST /user/favorites - Allows users to add cards to their favorites list.
router.post('/favorites', userController.postFavorites);

// POST /user/trade - Allows users to send or edit trade requests to another user.
router.post('/trade', userController.postTrades);

export default router;
