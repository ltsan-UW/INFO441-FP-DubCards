export function getRarityPrice(rarity) {
  const rarityPrices = {
    "Common": 10,
    "Uncommon": 25,
    "Rare": 50,
    "Ultra Rare": 100,
    "Legendary": 250
  };
  return rarityPrices[rarity];
}