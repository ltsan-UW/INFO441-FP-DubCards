
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

  img.onerror = () => {
    img.onerror = null;
    img.src = "../images/cards/temp.png";
  };
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

function createPack(packData, tilt = true) {

  //Initial cardpack div
  const pack = document.createElement("div");
  pack.classList.add("cardPack");
  pack.id = `pack-${packData._id}`;

  //Card img aka first half of the cardpack div
  const img = document.createElement("img");
  img.src = `../images/packs/${packData._id.toString()}.png`;
  img.setAttribute("data-tilt", "");
  img.setAttribute("data-tilt-scale", "1.05");
  pack.appendChild(img);

  //subtext aka second half of the cardpack div
  const subtext = document.createElement("div");
  subtext.classList.add("cardPackSubtext");
  pack.appendChild(subtext);

  const cardTitle = document.createElement("strong");
  cardTitle.textContent = packData.name;
  subtext.appendChild(cardTitle);

  const subtextDiv = document.createElement("div");
  subtext.appendChild(subtextDiv)

  const price = document.createElement("p");
  price.textContent = `Price: ${packData.price}`;

  const button = document.createElement("button");
  button.textContent = "View";
  button.setAttribute("data-tilt", "");
  button.setAttribute("data-tilt-scale", "1.05");

  subtextDiv.appendChild(price);
  subtextDiv.appendChild(button);

  button.addEventListener("click", async () => {
    loadPack(packData._id);
  })

  if (tilt) {
    VanillaTilt.init(img, {
      max: 0.1,
      speed: 400,
      glare: true,
      "max-glare": 0.4,
    })
    VanillaTilt.init(button, {
      max: 0.1,
      speed: 400,
      glare: true,
      "max-glare": 0.4,
    })
  }

  return pack;
}