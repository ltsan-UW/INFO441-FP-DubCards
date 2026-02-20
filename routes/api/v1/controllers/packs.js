import express from 'express';
var router = express.Router();

// POST /packs/:set - Allows users to open a specific pack and add obtained cards to their user in the db, using their currency.
router.get('/:set', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
