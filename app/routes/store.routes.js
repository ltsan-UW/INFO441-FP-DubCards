import express from 'express';
var router = express.Router();

import * as storeController from '../controllers/store.controller.js';

// GET /store/packs/ \- Allows users to see all the available packs.
router.get('/packs', storeController.getPacks);

// GET /store/packs/:packID \- Allows users see details on a specific pack.
router.get('/packs/:packID', storeController.getPack);

// POST /store/packs/:packID \- Allows users to open a specific pack and add obtained cards to their user in the db, using their currency.
router.post('/packs/:packID', storeController.openPack);

export default router;
