import express from 'express';
var router = express.Router();

// GET /cards/ - Allows users to see cards; query filtered on set and/or cardID.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
