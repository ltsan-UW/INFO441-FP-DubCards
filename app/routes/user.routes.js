import express from 'express';
var router = express.Router();

import * as userController from '../controllers/user.controller.js';

// GET /user - Allows the logged in user to see their own information; what cards they have, their trade requests and their favorites list.
router.get('/', userController.getUser);

// GET /user/:username - Allows users to see their information; what cards they have, their trade requests and their favorites list.
router.get('/:username', userController.getUser);

// POST /user/sell - Allows users to sell cards that they have.
router.post('/sell', userController.sellCards);

// POST /user/favorites - Allows users to add cards to their favorites list.
router.post('/favorites', userController.postFavorites);

// POST /user/trade - Allows users to send or edit trade requests to another user.
router.post('/trade', userController.postTrades);

export default router;
