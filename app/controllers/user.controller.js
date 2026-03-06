import UserModel from "../models/User.model.js";
import TradeModel from "../models/Trade.model.js";

// GET /user/:id
export async function getUser(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const email = req.authContext.getAccount().username;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/:id/cards - sell a card (remove from inventory)
export async function postCards(req, res) {
  try {
    const { cardID } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    const cardIndex = user.inventory.findIndex(i => i.cardID === cardID);
    if (cardIndex === -1) return res.status(404).json({ status: "error", error: "Card not in inventory" });

    if (user.inventory[cardIndex].quantity > 1) {
      user.inventory[cardIndex].quantity -= 1;
    } else {
      user.inventory.splice(cardIndex, 1);
    }

    await user.save();
    res.json({ status: "success", inventory: user.inventory });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/:id/favorites - add or remove a card from favorites
export async function postFavorites(req, res) {
  try {
    const { cardID } = req.body;
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    const alreadyFavorited = user.favorites.includes(cardID);
    if (alreadyFavorited) {
      user.favorites = user.favorites.filter(id => id !== cardID);
    } else {
      user.favorites.push(cardID);
    }

    await user.save();
    res.json({ status: "success", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/trade - send a trade request
export async function postTrades(req, res) {
  try {
    const { receiverUsername, senderCards, receiverCards } = req.body;
    const email = req.authContext.getAccount().username;
    const sender = await UserModel.findOne({ email });
    if (!sender) return res.status(404).json({ status: "error", error: "Sender not found" });

    const trade = new TradeModel({
      senderUsername: sender.username,
      receiverUsername,
      senderCards,
      receiverCards,
      status: "pending",
    });

    await trade.save();
    res.json({ status: "success", trade });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}