async function init() {
    console.log("loading dubcards frontend...");
    await loadAuth()
    loadInventory(); //for now. should load based on buttons later

    return;
}

async function loadStore() {
    const storeJson = await fetchJSON(`api/store/packs`);
    const userJson = await fetchJSON(`api/user/`);

    let currency = userJson.currency;

    //get maincontent div
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = "";

    //make elements of everything in the store below:
    const store = document.createElement("div");
    store.classList.add("store");

    const storeTitle = document.createElement("div");
    storeTitle.classList.add("storeTitle");

    const title = document.createElement("h2");
    title.textContent = "Pack Store!";

    const currencyDiv = document.createElement("div");
    currencyDiv.classList.add("currency");

    const currencyText = document.createElement("p");
    currencyText.textContent = currency;

    currencyDiv.appendChild(currencyText);

    storeTitle.appendChild(title);
    storeTitle.appendChild(currencyDiv);

    const packsContainer = document.createElement("div");
    packsContainer.classList.add("packs");

    store.appendChild(storeTitle);
    store.appendChild(packsContainer);

    mainContent.appendChild(store);

    //for each in the json, add a pack as a child to the packs container!
    storeJson.forEach(packData => {
        packsContainer.appendChild(createPack(packData));
    });
}

async function loadPack(packID) {
    try {
        const packJSON = await fetchJSON(`api/store/packs/` + packID);
        const userJSON = await fetchJSON(`api/user/`);

        const packPage = document.createElement("div");
        packPage.className = "packPage";

        // LEFT SIDE
        const packPageLeft = document.createElement("div");
        packPageLeft.className = "packPageLeft";

        const titleWrapper = document.createElement("div");
        const title = document.createElement("h1");
        title.textContent = packJSON.name.toUpperCase() + " - " + packJSON.price + " Coins";
        titleWrapper.appendChild(title);

        const img = document.createElement("img");
        img.src = `images/packs/${packJSON._id}.png`;

        const button = document.createElement("button");

        let currency = userJSON.currency;
        let packPrice = packJSON.price;

        if (currency > packPrice){
            button.textContent = "BUY";
            button.onclick = () => openPack(packID, packJSON.name);
            button.setAttribute("data-tilt", "");
            button.setAttribute("data-tilt-scale", "1.05");
            button.classList.add("buyButton");
        } else {
            button.textContent = "Not Enough Coins..."
            button.classList.add("insufficientCurrencyButton");
        }
        
        packPageLeft.appendChild(titleWrapper);
        packPageLeft.appendChild(img);
        packPageLeft.appendChild(button);

        // RIGHT SIDE
        const packPageRight = document.createElement("div");
        packPageRight.className = "packPageRight";

        const packDesc = document.createElement("div");
        packDesc.className = "packDesc";

        const descTitle = document.createElement("h1");
        descTitle.textContent = "DESCRIPTION";

        const descText = document.createElement("p");
        descText.textContent = packJSON.description;

        packDesc.appendChild(descTitle);
        packDesc.appendChild(descText);

        const packRarities = document.createElement("div");
        packRarities.className = "packRarities";

        const rarityTitle = document.createElement("h2");
        rarityTitle.textContent = "Rarity Chances";

        const rarityList = document.createElement("ul");

        Object.entries(packJSON.rarities).forEach(([rarity, weight]) => {
            const li = document.createElement("li");
            li.textContent = `${rarity}: ${weight}%`;
            rarityList.appendChild(li);
        });

        packRarities.appendChild(rarityTitle);
        packRarities.appendChild(rarityList);

        packPageRight.appendChild(packDesc);
        packPageRight.appendChild(packRarities);

        // ASSEMBLE
        packPage.appendChild(packPageLeft);
        packPage.appendChild(packPageRight);


        VanillaTilt.init(button, {
            max: 0.1,
            speed: 400,
            glare: true,
            "max-glare": 0.4,
        })
        
        document.getElementById("mainContent").innerHTML = "";
        document.getElementById("mainContent").appendChild(packPage);
    } catch (error) {
        throw error;
    }
    
}

async function openPack(packID, packName) {
    try {
        const mainContent = document.getElementById("mainContent");
        mainContent.innerHTML = "";

        const packCardsPage = document.createElement("div");
        packCardsPage.className = "packCardsPage";

        const title = document.createElement("h2");
        title.textContent = `Cards received from ${packName}:`;

        const openPackDiv = document.createElement("div");
        openPackDiv.id = "open-pack-div";

        const returnButton = document.createElement("button");
        returnButton.textContent = "Return To Store";
        returnButton.addEventListener("click", loadStore);

        packCardsPage.appendChild(title);
        packCardsPage.appendChild(openPackDiv);
        packCardsPage.appendChild(returnButton);

        mainContent.appendChild(packCardsPage);

        const cardsArray = await fetchJSON(`api/store/packs/` + packID, {
            method: "POST",
            body: {}
        });

        const cards = await Promise.all(
            cardsArray.map(card => createCard(card))
        );

        cards.forEach(card => openPackDiv.appendChild(card));

    } catch (error) {
        throw error;
    }
}

async function loadInventory() {
    const userInfoJson = await fetchJSON(`api/user/`);

    console.log("Loading inventory...");
    console.log(userInfoJson)

    const inventory = document.createElement("div");
    inventory.classList.add("inventory");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("inventoryTitle")

    const title = document.createElement("h2");
    title.textContent = "Your Inventory";

    titleDiv.appendChild(title);

    const invWrapper = document.createElement("div");
    const invCards = document.createElement("div");
    invCards.classList.add("invCards");

    const selectedCards = {};
    const cardsArray = userInfoJson.inventory;
    const cards = await Promise.all(
        cardsArray.map(card => createCard(card, userInfoJson.favorites, true, selectedCards))
    );
    cards.forEach(card => invCards.appendChild(card));

    inventory.appendChild(titleDiv);
    inventory.appendChild(invWrapper);
    invWrapper.classList.add("invWrapper");
    invWrapper.appendChild(invCards);

    const sellCards = document.createElement("div");
    sellCards.classList.add("sellCards");
    sellCards.classList.add("hidden");
    const sellOptions = document.createElement("div");
    sellOptions.classList.add("sellOptions");
    const sellText = document.createElement("p");
    sellText.classList.add("sell-text");
    sellText.textContent = `Sell for 0?`
    sellOptions.appendChild(sellText);
    sellCards.appendChild(sellOptions);

    // Sell submit button sends a post request to sell the cards in the selectedCards object.
    // If successful: removes small card imgs and div cards if not in inventory, updates sell amount
    const sellSubmitButton = document.createElement("button");
    sellSubmitButton.classList.add("sell-submit-button");
    sellSubmitButton.innerText = "Submit";
    sellOptions.appendChild(sellSubmitButton);
    sellSubmitButton.onclick = async () => {
        const result = await fetchJSON(`api/user/sell/`, {
            method: "POST",
            body: { cardIDs: selectedCards }
        })
        if (result.status == "success") {
            sellCards.querySelectorAll("img").forEach(img => img.remove());
            cards.forEach(card => {
                const cardID = Number(card.classList[2].replace("id_", ""));
                if (!(result.inventory.some(invCard => invCard.cardID === cardID))) {
                    card.remove();
                }
            });
            updateSellAmmount(null, null, true);
        }
    }

    // Sell button adds an overlay to all the cards with a grey affect, and reveals the sellCards div
    // If cards still selected: reset sell text, remove small imgs, reset card quantities
    const sellButton = document.createElement("button");
    sellButton.classList.add("sell-button");
    sellButton.innerText = "Sell"
    sellButton.onclick = () => {
        sellCards.classList.toggle("hidden");
        if(Object.keys(selectedCards).length !== 0) {
            sellCards.querySelectorAll("img").forEach(img => img.remove());
            updateSellAmmount(null, null, true);
            userInfoJson.inventory.forEach(cardData => {
                const cardID = cardData.cardID;
                if (selectedCards[cardID] !== undefined) {
                    const cardElement = invCards.querySelector(".id_" + cardID);
                    const quantElement = cardElement.querySelector(".card-quantities");
                    quantElement.textContent = `×${cardData.quantity + selectedCards[cardID]}`;
                    cardElement.classList.remove("card-noquantity");
                    cardData.quantity += selectedCards[cardID];
                }
            })
            Object.keys(selectedCards).forEach(cardID => delete selectedCards[cardID]);
        }
        cards.forEach(createCardOverlay);
    }

    invWrapper.appendChild(sellButton);
    invWrapper.appendChild(sellCards);

    document.getElementById("mainContent").innerHTML = "";
    document.getElementById("mainContent").appendChild(inventory);
    return;
}