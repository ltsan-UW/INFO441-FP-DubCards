
// async function createCard(cardData){
//     return `
//     <div data-tilt data-tilt-scale="1.05" class="card rarity_${cardData.rarity}">
//         <img src="../images/cards/${cardData.cardID}.png">
//         <div class="card-quantities">×3<div/>
//     </div> `
// }

async function createCard(cardData, favorites, tilt = true, selectedCards) {
  const card = document.createElement("div");
  card.classList.add("card", `rarity_${cardData.rarity}`, `id_${cardData.cardID}`);
  card.setAttribute("data-tilt", "");
  card.setAttribute("data-tilt-scale", "1.05");

  const img = document.createElement("img");
  img.src = `../images/cards/${cardData.cardID}.png`;

  img.onerror = () => {
    img.onerror = null;
    img.src = "../images/cards/temp.png";
  };
  card.appendChild(img);

  let cardQuantityDiv;
  if (cardData?.quantity) {
    cardQuantityDiv = document.createElement("div");
    cardQuantityDiv.classList.add("card-quantities");
    cardQuantityDiv.textContent = `×${cardData.quantity}`;
    card.appendChild(cardQuantityDiv);
  }
  if (Array.isArray(favorites)) {
    const favorite = document.createElement("div");
    favorite.classList.add("card-favorite");
    favorite.textContent = favorites.includes(cardData.cardID) ? "★" : "☆";
    card.appendChild(favorite);
    favorite.addEventListener("click", async () => {handleFavoriteClick(favorites, cardData.cardID)});
  }
  if (tilt) {
    VanillaTilt.init(card, {
      max: 20,
      speed: 400,
      glare: true,
      "max-glare": 0.4,
    });
  }

  card.addEventListener("click", () => {
    if (card.classList.contains("card-sell") && cardData?.quantity && cardData.quantity > 0) {
      handleCardClick(cardData, card, cardQuantityDiv, selectedCards);
    }
  });

  return card;
}

// Handles click for when the favorites star on a card is clicked
// favorites: list of favorite cardIDs | cardID: card id of the clicked card
async function handleFavoriteClick(favorites, cardID) {
      const isFav = favorites.includes(cardID);
      if (!isFav) {
        favorite.textContent = "★";
        favorites.push(cardID);
      } else {
        favorite.textContent = "☆";
        const index = favorites.indexOf(cardID);
        if (index !== -1) favorites.splice(index, 1);
      }

      try {
        await fetchJSON(`api/user/favorites`, {
          method: "POST",
          body: { cardID: cardID, favorited: !isFav }
        })
      } catch (error) { console.log("Error connection to db", error) }
    }

// Create a "smallCard" object, scale it to the big card and move it to .sellCards
// On click, give back 1 quantity to big card and remove small card
async function handleCardClick(cardData, card, cardQuantityDiv, selectedCards) {
  cardData.quantity--;
  if (selectedCards[cardData.cardID] !== undefined) {
    selectedCards[cardData.cardID]++;
  } else selectedCards[cardData.cardID] = 1;

  if (cardData.quantity === 0) {
    card.classList.add("card-noquantity");
    card.querySelector(".card-sell-icon").classList.add("hidden");
  }
  cardQuantityDiv.textContent = `×${cardData.quantity}`;

  updateSellAmmount(true, cardData.rarity);

  const smallCard = document.createElement("img");
  smallCard.classList.add("card-small");
  smallCard.style.zIndex = 1;
  smallCard.src = card.querySelector("img").src;

  target.appendChild(smallCard);
  const target = document.querySelector(".sellCards");
  const first = card.querySelector("img").getBoundingClientRect();
  const last = smallCard.getBoundingClientRect();
  const dx = first.left - last.left + first.width / 2 - last.width / 2;
  const dy = first.top - last.top + first.height / 2 - last.height / 2;
  const scale = (first.width - 10) / last.width;
  smallCard.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(8deg)`;

  requestAnimationFrame(() => {
    smallCard.style.transition = "transform 0.4s ease";
    smallCard.style.transform = "";
  });

  smallCard.addEventListener("click", () => {handleSmallCardClick(cardData, selectedCards, smallCard, card, cardQuantityDiv)});
}

// On click: move and scale back to big card, then remove small card and remove noquanitity class on card
function handleSmallCardClick(cardData, selectedCards, smallCard, card, cardQuantityDiv) {
  updateSellAmmount(false, cardData.rarity);
  if (selectedCards[cardData.cardID] === 1) {
    delete selectedCards[cardData.cardID];
  } else selectedCards[cardData.cardID]--;

  smallCard.style.zIndex = 0; // Puts small card under big card
  const first = card.querySelector("img").getBoundingClientRect();
  const last = smallCard.getBoundingClientRect();
  const dx = first.left - last.left + first.width / 2 - last.width / 2;
  const dy = first.top - last.top + first.height / 2 - last.height / 2;
  const scale = (first.width - 10) / last.width;
  requestAnimationFrame(() => {
    smallCard.style.transition = "transform 0.4s ease";
    smallCard.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
  });
  smallCard.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform") {
      smallCard.remove();
      cardData.quantity++;
      if (cardData.quantity > 0) {
        card.classList.remove("card-noquantity");
        card.querySelector(".card-sell-icon").classList.remove("hidden");
      }
      cardQuantityDiv.textContent = `×${cardData.quantity}`;
    }
  }, { once: true });
}

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

  subtextDiv.appendChild(price);
  subtextDiv.appendChild(button);

  button.addEventListener("click", async () => {
    loadPack(packData._id);
  })

  return pack;

  return `
      <div class="cardPack" id="pack-${packData._id.toString()}">

        <img data-tilt data-tilt-scale src="images/packs/${packData._id.toString()}.png">
        <div class="cardPackSubtext">
          <strong>${packData.name}</strong>
          <div>
            <p>Price: ${packData.price}</p>
            <button onclick="loadPack('${packData._id}')">View</button>
          </div>
        </div>
      </div>
    `
}