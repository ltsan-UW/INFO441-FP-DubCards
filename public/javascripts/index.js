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

    let packHTML = 
`    <div class="packPage">

    <div class="packPageLeft">
        <h1> </h1>
    </div>

    <div class="packPageRight">

    </div>


    </div>`
    
    // let packHTML = `
    // <div class="packPage">
    //     <button onclick="loadStore()">back</button>
    //     <h2>${packJSON.name}</h2>
    //     <p><strong>Description:</strong> ${packJSON.description}</p>
    //     <p><strong>Price:</strong> $${packJSON.price}</p>
    //     <p><strong>Pack ID:</strong> ${packID}</p>

    //     <h3>Cards</h3>
    //     <ul>
    //     ${packJSON.cards.map(card => `<li>Card Name: ${card}</li>`).join("")}
    //     </ul>
    //     <h3>Rarities</h3>
    //     <ul>
    //     ${Object.entries(packJSON.rarities)
    //         .map(([rarity, weight]) => `<li>${rarity}: ${weight}%</li>`)
    //         .join("")}
    //     </ul>
    //     <button onclick="openPack('${packID}', '${packJSON.name}')">buy</button>
    // </div>
    // `;
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
    const uid = 1;
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

    const invCards = document.createElement("div");
    invCards.classList.add("invCards");
    const cardsArray = userInfoJson.inventory;
    const cards = await Promise.all(
        cardsArray.map(card => createCard(card, userInfoJson.favorites))
    );
    cards.forEach(card => invCards.appendChild(card));

    inventory.appendChild(titleDiv);
    inventory.appendChild(invCards);

    document.getElementById("mainContent").innerHTML = "";
    document.getElementById("mainContent").appendChild(inventory);
    return;
}