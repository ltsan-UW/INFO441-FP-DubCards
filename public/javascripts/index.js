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
    const packJSON = await fetchJSON(`api/store/packs/` + packID)
    let packHTML = `
    <div class="packPage">
        <button onclick="loadStore()">back</button>
        <h2>${packJSON.name}</h2>
        <p><strong>Description:</strong> ${packJSON.description}</p>
        <p><strong>Price:</strong> $${packJSON.price}</p>
        <p><strong>Pack ID:</strong> ${packID}</p>

        <h3>Cards</h3>
        <ul>
        ${packJSON.cards.map(card => `<li>Card Name: ${card}</li>`).join("")}
        </ul>
        <h3>Rarities</h3>
        <ul>
        ${Object.entries(packJSON.rarities)
            .map(([rarity, weight]) => `<li>${rarity}: ${weight}%</li>`)
            .join("")}
        </ul>
        <button onclick="openPack('${packID}', '${packJSON.name}')">buy</button>
    </div>
    `;
    document.getElementById("mainContent").innerHTML = packHTML;
}

async function openPack(packID, packName) {
    try {

        let cardsHTML = `
        <div class="packCardsPage">
            <h2>Cards received from ${packName}:</h2>
            <div id="open-pack-div"></div>
            <button onclick="loadStore()">next</button>
        </div>
        `;
        document.getElementById("mainContent").innerHTML = cardsHTML;

        const cardsArray = await fetchJSON(`api/store/packs/` + packID, {
            method: "POST",
            body: {}
        })

        const packDiv = document.getElementById("open-pack-div");
        const cards = await Promise.all(
            cardsArray.map(card => createCard(card))
        );
        cards.forEach(card => packDiv.appendChild(card));
    } catch (error) {
        throw (error)
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