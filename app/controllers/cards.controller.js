// GET /cards/ - Allows users to see cards; query filtered on set and/or cardID.
export function getCards(req, res) {
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