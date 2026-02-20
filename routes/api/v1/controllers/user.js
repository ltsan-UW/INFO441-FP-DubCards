import express from 'express';
var router = express.Router();

// GET /user/:id - Allows users to see their information; what cards they have, their trade requests and their favorites list.
router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});

// POST /user/:id/cards - Allows users to sell cards that they have.
router.post('/:id/cards', function(req, res, next) {
  res.send('respond with a resource');
});

// POST /user/:id/favorites - Allows users to add cards to their favorites list.
router.post('/:id/favorites', function(req, res, next) {
  res.send('respond with a resource');
});

// POST /user/trade - Allows users to send or edit trade requests to another user.
router.post('/trade', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
