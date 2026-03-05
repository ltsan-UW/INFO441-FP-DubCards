import mongoose from "mongoose";
import PackModel from "../models/Pack.model.js";
import CardModel from "../models/Card.model.js";

// GET /store/packs/ \- Allows users to see all the available packs.
export async function getPacks(req, res) {
  const testData = [
    { name: "test-pack-1", packID: new mongoose.Types.ObjectId(), price: 10 },
    { name: "test-pack-2", packID: new mongoose.Types.ObjectId(), price: 25 },
  ];
  res.send(testData);
}

// GET /store/packs/:packID \- Allows users see details on a specific pack.
export function getPack(req, res) {
  // to-do db connect
  const testData = {
    name: "test-pack-1",
    description: "description of this test pack 1. This pack is the first pack. It has some cards in it.",
    price: 10,
    cards: [1, 2, 7, 9],
    rarities: {
      "Common": 60,
      "Uncommon": 20,
      "Rare": 12,
      "Ultra Rare": 6,
      "Legendary": 2
    },
    packID: new mongoose.Types.ObjectId()
  }
  res.send(testData);
}

// POST /store/packs/:packID \- Allows users to open a specific pack and add obtained cards to their user in the db, using their currency.
export function openPack(req, res) {
  const testData = [
        {cardID: 1, name: "Campus Squirrel"},
        {cardID: 1, name: "Campus Squirrel"},
        {cardID: 1, name: "Campus Squirrel"},
        {cardID: 1, name: "Campus Squirrel"},
        {cardID: 1, name: "Campus Squirrel"},
      ]
  res.send(testData);
}
