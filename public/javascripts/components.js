
// async function createCard(cardData){
//     return `
//     <div data-tilt data-tilt-scale="1.05" class="card rarity_${cardData.rarity}">
//         <img src="../images/cards/${cardData.cardID}.png">
//         <div class="card-quantities">×3<div/>
//     </div> `
// }

async function createCard(cardData, favorites, tilt = true) {
  const card = document.createElement("div");
  card.classList.add("card", `rarity_${cardData.rarity}`);
  card.setAttribute("data-tilt", "");
  card.setAttribute("data-tilt-scale", "1.05");

  const img = document.createElement("img");
  img.src = `../images/cards/${cardData.cardID}.png`;
  card.appendChild(img);

  if (cardData?.quantity) {
    const quantity = document.createElement("div");
    quantity.classList.add("card-quantities");
    quantity.textContent = `×${cardData.quantity}`;
    card.appendChild(quantity);
  }
  if (Array.isArray(favorites)) {
    const favorite = document.createElement("div");
    favorite.classList.add("card-favorite");

    favorite.textContent = favorites.includes(cardData.cardID) ? "★" : "☆";
    card.appendChild(favorite);

    favorite.addEventListener("click", async () => {
      const isFav = favorites.includes(cardData.cardID);
      if (!isFav) {
        favorite.textContent = "★";
        favorites.push(cardData.cardID);
      } else {
        favorite.textContent = "☆";
        const index = favorites.indexOf(cardData.cardID);
        if (index !== -1) favorites.splice(index, 1);
      }

      try {
        await fetchJSON(`api/user/favorites`, {
            method: "POST",
            body: {cardID: cardData.cardID, favorited: !isFav}
        })
      } catch (error) {
        console.log("Error connection to db", error)
      }
    });
  }
  if (tilt) {
    VanillaTilt.init(card, {
      max: 20,
      speed: 400,
      glare: true,
      "max-glare": 0.4,
    });
  }
  return card;
}
// <img href="./images/${cardData.cardID}"></img>

function createPack(packData) {
  return `
      <div class="cardPack" id="${packData.packID}">
        <strong>${packData.name}</strong>
        <p>Price: ${packData.price}</p>
        <button onclick="loadPack('${packData.packID}')">more</button>
      </div>
    `
}