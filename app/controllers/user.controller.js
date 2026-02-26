import mongoose from "mongoose";

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
        {cardID: new mongoose.Types.ObjectId(), name: "Dubs I Legacy Edition", quantity: 2},
        {cardID: new mongoose.Types.ObjectId(), name: "2018 NPD Dubs II", quantity: 1},
      ],
      favorites: [1],
  }
  res.send(testData);
}

// POST /user/:id/cards - Allows users to sell cards that they have.
export function postCards(req, res) {
  res.send("To-do endpoint");
}

// POST /user/:id/favorites - Allows users to add cards to their favorites list.
export function postFavorites(req, res) {
  res.send("To-do endpoint");
}

// POST /user/trade - Allows users to send or edit trade requests to another user.
export function postTrades(req, res) {
  res.send("To-do endpoint");
}
