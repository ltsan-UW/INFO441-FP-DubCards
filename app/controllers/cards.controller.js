import CardModel from "../models/Card.model.js";

// GET /cards/ - query filtered on packID and/or cardID
export async function getCards(req, res) {
  try {
    const filter = {};
    if (req.query.cardID) filter.cardID = req.query.cardID;
    if (req.query.packID) filter.packID = req.query.packID;
    const cards = await CardModel.find(filter);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ status: "error", error });
  }
}