import PackModel from "../models/Pack.model.js";
import CardModel from "../models/Card.model.js";
import UserModel from "../models/User.model.js";

// GET /store/packs/
export async function getPacks(req, res) {
  try {
    const packs = await PackModel.find();
    res.json(packs);
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// GET /store/packs/:packID
export async function getPack(req, res) {
  try {
    const pack = await PackModel.findById(req.params.packID);
    if (!pack) return res.status(404).json({ status: "error", error: "Pack not found" });
    res.json(pack);
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /store/packs/:packID
export async function openPack(req, res) {
  try {
    // get the pack
    const pack = await PackModel.findById(req.params.packID);
    if (!pack) return res.status(404).json({ status: "error", error: "Pack not found" });

    // get the logged in user via azure auth
    const email = req.authContext.getAccount().username;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    // check user has enough currency
    if (user.currency < pack.price) {
      return res.status(400).json({ status: "error", error: "Not enough currency" });
    }

    // get all cards in this pack
    const availableCards = await CardModel.find({ packID: pack._id });
    if (availableCards.length === 0) {
      return res.status(404).json({ status: "error", error: "No cards found in this pack" });
    }

    // pick 5 random cards based on rarity weights
    const pickedCards = [];
    for (let i = 0; i < 5; i++) {
      const roll = Math.random() * 100;
      let cumulative = 0;
      let pickedRarity = "Common";
      for (const [rarity, weight] of pack.rarities) {
        cumulative += weight;
        if (roll <= cumulative) {
          pickedRarity = rarity;
          break;
        }
      }
      const rarityCards = availableCards.filter(c => c.rarity === pickedRarity);
      const card = rarityCards[Math.floor(Math.random() * rarityCards.length)];
      pickedCards.push(card);
    }

    // deduct currency and add cards to inventory
    user.currency -= pack.price;
    for (const card of pickedCards) {
      const existing = user.inventory.find(i => i.cardID === card.cardID);
      if (existing) {
        existing.quantity += 1;
      } else {
        user.inventory.push({ cardID: card.cardID, name: card.name, quantity: 1 });
      }
    }
    await user.save();

    res.json(pickedCards);
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}