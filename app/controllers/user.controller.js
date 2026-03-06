import UserModel from "../models/User.model.js";
import TradeModel from "../models/Trade.model.js";

// GET /user/:id
export async function getUser(req, res) {
  try {
    // if there is a username parameter, use it. If not, then use the user logged in.
    let user;
    console.log(req.params.username)
    if (req.params.username === undefined) {
      if (!req.authContext?.isAuthenticated()) {
        return res.status(401).json({ status: "error", error: "Not logged in" });
      }
      const email = req.authContext.getAccount().username;
      user = await UserModel.findOne({ email: email });
    } else user = await UserModel.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    console.log(user)
    res.json(user);
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/sell - sell a card (remove from inventory)
export async function postCards(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
    const email = req.authContext.getAccount().username;
    const { cardIDs } = req.body;
    if(!Array.isArray(cardIDs) || cardIDs?.length === 0) return res.status(400).send({ error: "cardIDs missing" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", error: "User not found" });

    cardIDs.forEach((cardID) => {
      const cardIndex = user.inventory.findIndex(i => i.cardID === cardID);
      if (cardIndex === -1) return res.status(404).json({ status: "error", error: "Card not in inventory" });
      if (user.inventory[cardIndex].quantity > 1) {
        user.inventory[cardIndex].quantity -= 1;
      } else {
        user.inventory.splice(cardIndex, 1);
      }
    })

    await user.save();
    res.json({ status: "success", inventory: user.inventory });
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}

// POST /user/favorites - Allows users to add cards to their favorites list.
export async function postFavorites(req, res) {
  const cardID = req.body.cardID;
  const favorited = req.body.favorited;

  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).send({ status: "error", error: "not logged in" });
    }
    const account = req.authContext.getAccount();
    const user = await UserModel.findOneAndUpdate(
      { email: account.username },
      (favorited ? { $addToSet: { favorites: cardID } } : { $pull: { favorites: cardID } }),
    );
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    res.send({ status: "success"});
  } catch (error) {
    console.error("Error connecting to DB:", error);
    res.status(500).send({ status: "error", error });
  }
}

// POST /user/trade - send a trade request
export async function postTrades(req, res) {
  try {
    if (!req.authContext?.isAuthenticated()) {
      return res.status(401).json({ status: "error", error: "Not logged in" });
    }
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