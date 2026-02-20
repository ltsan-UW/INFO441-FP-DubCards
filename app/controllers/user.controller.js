// GET /user/:id - Allows users to see their information; what cards they have, their trade requests and their favorites list.
exports.getUser = (req, res) => {
  res.send("To-do endpoint");
};

// POST /user/:id/cards - Allows users to sell cards that they have.
exports.postCards = (req, res) => {
  res.send("To-do endpoint");
};

// POST /user/:id/favorites - Allows users to add cards to their favorites list.
exports.postFavorites = (req, res) => {
  res.send("To-do endpoint");
};

// POST /user/trade - Allows users to send or edit trade requests to another user.
exports.postTrades = (req, res) => {
  res.send("To-do endpoint");
};
