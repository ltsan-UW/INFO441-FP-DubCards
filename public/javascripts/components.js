async function createCard(cardData, favorites, tilt = true, selectedCards, targetClass) {
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
    favorite.addEventListener("click", async () => { handleFavoriteClick(favorites, cardData.cardID, favorite) });
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
      handleSellCardClick(cardData, card, cardQuantityDiv, selectedCards);
    } else if (card.classList.contains("card-sendtrade") && cardData?.quantity && cardData.quantity > 0) {
      handleTradeCardClick(cardData, card, cardQuantityDiv, selectedCards, targetClass);
    }
  });

  return card;
}

async function createRevealCard(cardData) {
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("reveal-card");
  cardWrapper.dataset.rarity = cardData.rarity.toLowerCase();
  cardWrapper.dataset.revealed = "false";

  const inner = document.createElement("div");
  inner.classList.add("reveal-card-inner");

  const back = document.createElement("div");
  back.classList.add("reveal-card-back");

  const backImg = document.createElement("img");
  backImg.src = `../images/cards/backcard.png`;
  backImg.alt = "DubCard";
  backImg.classList.add("reveal-card-back-image");

  backImg.onerror = () => {
    backImg.onerror = null;
    backImg.src = "../images/cards/temp.png";
  };

  back.appendChild(backImg);


  const front = document.createElement("div");
  front.classList.add("reveal-card-front");

  inner.appendChild(back);
  inner.appendChild(front);
  cardWrapper.appendChild(inner);

  cardWrapper.addEventListener("click", async () => {
    if (cardWrapper.dataset.revealed === "true") return;

    cardWrapper.dataset.revealed = "true";

    const revealedCard = await createCard(cardData);
    revealedCard.classList.add("opened-card");

    front.appendChild(revealedCard);

    requestAnimationFrame(() => {
      cardWrapper.classList.add("revealed");
    })
  });

  return cardWrapper;
}

// Handles click for when the favorites star on a card is clicked
// favorites: list of favorite cardIDs | cardID: card id of the clicked card
async function handleFavoriteClick(favorites, cardID, favoriteElement) {
  const isFav = favorites.includes(cardID);
  if (!isFav) {
    favoriteElement.textContent = "★";
    favorites.push(cardID);
  } else {
    favoriteElement.textContent = "☆";
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
async function handleSellCardClick(cardData, card, cardQuantityDiv, selectedCards) {
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

  const target = document.querySelector(".sellCards");
  target.appendChild(smallCard);
  const first = card.querySelector("img").getBoundingClientRect();
  const last = smallCard.getBoundingClientRect();
  const dx = first.left - last.left + first.width / 2 - last.width / 2;
  const dy = first.top - last.top + first.height / 2 - last.height / 2;
  const scale = (first.width - 10) / last.width;
  requestAnimationFrame(() => {
    smallCard.style.transition = "transform 0.4s ease";
    smallCard.style.transform = "";
  });
  smallCard.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(8deg)`;


  smallCard.addEventListener("click", () => { handleSellSmallCardClick(cardData, selectedCards, smallCard, card, cardQuantityDiv) });
}

// On click: move and scale back to big card, then remove small card and remove noquanitity class on card
function handleSellSmallCardClick(cardData, selectedCards, smallCard, card, cardQuantityDiv) {
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

// Create a "smallCard" object, scale it to the big card and move it to .send-trade-small-cards
// On click, give back 1 quantity to big card and remove small card
async function handleTradeCardClick(cardData, card, cardQuantityDiv, selectedCards, targetClass) {
  cardData.quantity--;
  selectedCards.push(cardData.cardID);

  if (cardData.quantity === 0) card.classList.add("card-noquantity");
  cardQuantityDiv.textContent = `×${cardData.quantity}`;

  const smallCard = document.createElement("img");
  smallCard.classList.add("sendtrade-card-small");
  smallCard.style.zIndex = 1;
  smallCard.src = card.querySelector("img").src;

  const target = document.querySelector(targetClass);
  target.appendChild(smallCard);
  const first = card.querySelector("img").getBoundingClientRect();
  const last = smallCard.getBoundingClientRect();
  const dx = first.left - last.left + first.width / 2 - last.width / 2;
  const dy = first.top - last.top + first.height / 2 - last.height / 2;
  const scale = (first.width - 10) / last.width;
  requestAnimationFrame(() => {
    smallCard.style.transition = "transform 0.4s ease";
    smallCard.style.transform = "";
  });
  smallCard.style.transform = `translate(${dx}px, ${dy}px) scale(${scale}) rotate(8deg)`;


  smallCard.addEventListener("click", () => {
    handleTradeSmallCardClick(cardData, selectedCards, smallCard, card, cardQuantityDiv, targetClass)
  });
}

// On click: move and scale back to big card, then remove small card and remove noquanitity class on card
function handleTradeSmallCardClick(cardData, selectedCards, smallCard, card, cardQuantityDiv) {
  selectedCards.splice(selectedCards.indexOf(cardData.cardID), 1);

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
      if (cardData.quantity > 0) card.classList.remove("card-noquantity");
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


async function createTradeCard(trade, incomingTrue) {
  const row = document.createElement("div");
  row.classList.add("trade-row");

  const cardIDs = trade.senderCards.join(",") + "," + trade.receiverCards.join(",");

  const cardsData = await fetchJSON("api/cards?cardIDs=" + cardIDs);

  const receiver = document.createElement("div");
  receiver.classList.add("trade-receiver");
  const receiverUsername = document.createElement("p");
  receiverUsername.textContent = trade.receiverUsername;
  receiver.appendChild(receiverUsername);
  const receiverCards = document.createElement("div");
  receiverCards.classList.add("trade-cards");

  const receiverNames = {};
  trade["receiverCards"].forEach(async (cardID) => {
    const cardData = cardsData.find(c => c.cardID === cardID);
    receiverNames[cardData.name] = (receiverNames[cardData.name] || 0) + 1;
    const cardElement = await createCard(cardData, null, tilt = true);
    cardElement.classList.add("card-trade")
    receiverCards.appendChild(cardElement);
  })
  receiver.appendChild(receiverCards);

  const sender = document.createElement("div");
  sender.classList.add("trade-sender");
  const senderUsername = document.createElement("p");
  senderUsername.textContent = trade.senderUsername;
  sender.appendChild(senderUsername);

  const senderCards = document.createElement("div");
  senderCards.classList.add("trade-cards");

  const senderNames = {};
  trade["senderCards"].forEach(async (cardID) => {
    const cardData = cardsData.find(c => c.cardID === cardID);
    senderNames[cardData.name] = (senderNames[cardData.name] || 0) + 1;
    const cardElement = await createCard(cardData, null, tilt = true);
    cardElement.classList.add("card-trade");
    senderCards.appendChild(cardElement);
  });

  sender.appendChild(senderCards);

  const infoOffer = document.createElement("p");
  const infoRecieve = document.createElement("p");
  const infoStatus = document.createElement("p");
  const tradeGraphic = document.createElement("img");
  tradeGraphic.src = "images/graphics/dubcardsTrade.png";
  tradeGraphic.classList.add("trade-graphic");
  let offerText = (incomingTrue ? `You offered: [${formatCardNames(senderNames)}] to ${trade.receiverUsername}.`
    : `You give: [${formatCardNames(receiverNames)}].`);
  let receiveText = (incomingTrue ? `You receive: [${formatCardNames(receiverNames)}]`
    : `You receive: [${formatCardNames(senderNames)}].`);
  infoOffer.textContent = offerText;
  infoRecieve.textContent = receiveText;
  infoStatus.textContent = `Status: ${trade.status}`;
  row.appendChild(infoStatus);
  row.appendChild(receiver);
  row.appendChild(tradeGraphic);
  row.appendChild(sender);
  row.appendChild(infoOffer);
  row.appendChild(infoRecieve);

  if (!incomingTrue && trade.status === "pending") {
    const cancelDiv = document.createElement("div");
    const cancelBtn = document.createElement("button");
    cancelDiv.classList.add("trade-options-div");
    cancelDiv.appendChild(cancelBtn);
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = async () => {
      await fetchJSON(`api/user/trade/${trade._id}`, {
        method: "PATCH",
        body: { status: "cancelled" }
      });
      loadTrades();
    };
    row.appendChild(cancelDiv);
  } else if (!incomingTrue && (trade.status === "cancelled" || trade.status === "accepted") ||
             incomingTrue && (trade.status === "rejected" || trade.status === "accepted")) {
    const closeDiv = document.createElement("div");
    const closeBtn = document.createElement("button");
    closeDiv.classList.add("trade-options-div");
    closeDiv.appendChild(closeBtn);
    closeBtn.textContent = "Close";
    closeBtn.onclick = async () => {
      await fetchJSON(`api/user/trade/${trade._id}`, {
        method: "DELETE"
      });
      loadTrades();
    };
    row.appendChild(closeDiv);
  } else if (incomingTrue && trade.status === "pending") {
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("trade-options-div");
    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accept";
    acceptBtn.onclick = async () => {
      await fetchJSON(`api/user/trade/${trade._id}`, {
        method: "PATCH",
        body: { status: "accepted" }
      });
      loadTrades();
    };

    const rejectBtn = document.createElement("button");
    rejectBtn.textContent = "Reject";
    rejectBtn.onclick = async () => {
      await fetchJSON(`api/user/trade/${trade._id}`, {
        method: "PATCH",
        body: { status: "rejected" }
      });
      loadTrades();
    };

    optionsDiv.appendChild(acceptBtn);
    optionsDiv.appendChild(rejectBtn);
    row.appendChild(optionsDiv);
  }

  return row;
}