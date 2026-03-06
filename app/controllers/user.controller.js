import mongoose from "mongoose";
import UserModel from "../models/User.model.js";

// GET /user/:id - Allows users to see their information; what cards they have, their trade requests and their favorites list.
export function getUser(req, res) {
  // to-do db connect
  const testData = {
    userID: 1,
    username: "test-user-one",
    email: "test@email.com",
    currency: 999,
    createdAt: Date.now(),
    inventory: [
      { cardID: 1, name: "Campus Squirrel", quantity: 3 }
    ],
    favorites: [1],
  }
  res.send(testData);
}

// POST /user/:id/cards - Allows users to sell cards that they have.
export function postCards(req, res) {
  res.send("To-do endpoint");
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
    if (!user) return res.status(404).send({ status: "error", error: "user not found" });

    res.send({ status: "success", favorites: user.favorites });
  } catch (error) {
    console.error("Error connecting to DB:", error);
    res.status(500).send({ status: "error", error });
  }
}

// POST /user/trade - Allows users to send or edit trade requests to another user.
export function postTrades(req, res) {
  res.send("To-do endpoint");
}
