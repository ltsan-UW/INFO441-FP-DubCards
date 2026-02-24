import mongoose from "mongoose";

// GET /store/packs/ \- Allows users to see all the available packs.
export function getPacks(req, res) {
  // to-do db connect
  const testData = [
    { name: "test-pack-1", packID: new mongoose.Types.ObjectId(), price: 10 },
    { name: "test-pack-2", packID: new mongoose.Types.ObjectId(), price: 25 },
  ];
  res.send(testData);
}

// GET /store/packs/:set \- Allows users see details on a specific pack.
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

// POST /store/packs/:set \- Allows users to open a specific pack and add obtained cards to their user in the db, using their currency.
export function openPack(req, res) {
  const testData = [
    {
      name: "test-card-1",
      description: "Description for test-card-1",
      rarity: "Common",
      packID: new mongoose.Types.ObjectId(),
      packName: "test-pack-1"
    },
    {
      name: "test-card-2",
      description: "Description for test-card-2",
      rarity: "Uncommon",
      packID: new mongoose.Types.ObjectId(),
      packName: "test-pack-1"
    },
    {
      name: "test-card-3",
      description: "Description for test-card-3",
      rarity: "Rare",
      packID: new mongoose.Types.ObjectId(),
      packName: "test-pack-1"
    },
    {
      name: "test-card-4",
      description: "Description for test-card-4",
      rarity: "Ultra Rare",
      packID: new mongoose.Types.ObjectId(),
      packName: "test-pack-1"
    },
    {
      name: "test-card-5",
      description: "Description for test-card-5",
      rarity: "Legendary",
      packID: new mongoose.Types.ObjectId(),
      packName: "test-pack-1"
    }
  ];
  res.send(testData);
}
