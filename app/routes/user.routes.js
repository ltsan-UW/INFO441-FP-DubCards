import express from 'express';
var router = express.Router();

import * as userController from '../controllers/user.controller.js';

// GET /user - Allows the logged in user to see their own information
router.get('/', userController.getUser);

// POST /user/sell - Allows users to sell cards that they have
router.post('/sell', userController.sellCards);

// POST /user/favorites - Allows users to add cards to their favorites list
router.post('/favorites', userController.postFavorites);

// POST /user/trade - Allows users to send a trade request to another user
router.post('/trade', userController.postTrades);

// PATCH /user/trade/:tradeID - Accept, reject, or cancel a trade
router.patch('/trade/:tradeID', userController.updateTrade);

// DELETE /user/trade/:tradeID - Delete a trade
router.delete('/trade/:tradeID', userController.deleteTrade);

// GET /user/friends - Get the logged in user's friends list
router.get('/friends', userController.getFriends);

// POST /user/friends/request - Send a friend request
router.post('/friends/request', userController.sendFriendRequest);

// PATCH /user/friends/request - Accept or reject a friend request
router.patch('/friends/request', userController.updateFriendRequest);

// DELETE /user/friends - Remove a friend
router.delete('/friends', userController.removeFriend);

// GET /user/trades - View all incoming and outgoing trades
router.get('/trades', userController.getTrades);

// GET /user/:username - Allows users to see another user's information
router.get('/:username', userController.getUserByUsername);

export default router;