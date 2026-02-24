// GET /store/packs/ \- Allows users to see all the available packs.
export function getPacks(req, res) {
  res.send("To-do endpoint");
}

// GET /store/packs/:set \- Allows users see details on a specific pack.
export function getPack(req, res) {
  res.send("To-do endpoint");
}

// POST /store/packs/:set \- Allows users to open a specific pack and add obtained cards to their user in the db, using their currency.
export function openPack(req, res) {
  res.send("To-do endpoint");
}
