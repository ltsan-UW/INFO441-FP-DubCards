import express from 'express';
var router = express.Router();

import * as cardsController from '../controllers/cards.controller';

// GET /cards/ - Allows users to see cards; query filtered on set and/or cardID.
router.get('/', cardsController.getCards);

export default router;
