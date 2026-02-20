import express from 'express';
var router = express.Router();

import * as packsController from '../controllers/packs.controller';

// POST /packs/:set - Allows users to open a specific pack and add obtained cards to their user in the db, using their currency.
router.post('/:set', packsController.openPack);

export default router;
