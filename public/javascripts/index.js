async function init() {
    console.log("loading dubcards frontend...");
    await loadAuth()
    return;
}

async function loadSidebar() {
    const sidebarHTML = `
      <button class="side-button" onclick="loadStore()">Pack Store</button>
      <button class="side-button" onclick="loadInventory()">Inventory</button>
      <button class="side-button" onclick="loadTrades()">Trades</button>
      <button class="side-button" onclick="loadFriends()">Friends</button>
      <button class="side-button" onclick="loadAccountPage()">Account</button>`
    const sidebarElement = document.querySelector(".sidebar");
    sidebarElement.innerHTML = sidebarHTML;
}

async function loadAccountPage() {
    try {
        const userJson = await fetchJSON(`api/user/`);

        //get maincontent div
        const mainContent = document.getElementById("mainContent");
        mainContent.innerHTML = "";

        //make elements of everything in the store below:
        const page = document.createElement("div");
        page.classList.add("accountPage");

        const accountTitle = document.createElement("div");
        accountTitle.classList.add("accountTitle");
        const title = document.createElement("h2");
        title.textContent = "Your Account";
        accountTitle.appendChild(title);
        page.appendChild(accountTitle);

        const accountInfoDiv = document.createElement("div");
        accountInfoDiv.classList.add("account-info-div")
        page.appendChild(accountInfoDiv);

        let totalCards = 0;
        userJson.inventory.forEach((card) => {
            totalCards += card.quantity;
        })

        const fields = {
            Username: userJson.username,
            Email: userJson.email,
            Currency: userJson.currency,
            "Total Cards": totalCards,
            Favorites: userJson.favorites.length,
            "Date Joined": Date(userJson.createdAt).toLocaleString()
        };

        Object.entries(fields).forEach(([label, value]) => {
            const div = document.createElement("div");
            div.textContent = `${label}: ${value}`;
            div.classList.add("account-stat-div");
            accountInfoDiv.appendChild(div);
        });

        mainContent.appendChild(page);
    } catch (err) {
        throw error;
    }
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

    //for each in the json, add a pack as a child to the packs container
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

        if (currency > packPrice) {
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
        if (Object.keys(selectedCards).length !== 0) {
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

async function loadFriends() {
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = "";

    const page = document.createElement("div");
    page.classList.add("friendsPage");

    const title = document.createElement("h2");
    title.textContent = "Friends";
    page.appendChild(title);

    // send friend request section
    const requestSection = document.createElement("div");
    requestSection.classList.add("friends-section");

    const requestTitle = document.createElement("h3");
    requestTitle.textContent = "Add a Friend";
    requestSection.appendChild(requestTitle);

    const requestInput = document.createElement("input");
    requestInput.type = "text";
    requestInput.placeholder = "Enter username...";
    requestSection.appendChild(requestInput);

    const requestButton = document.createElement("button");
    requestButton.textContent = "Send Request";
    requestButton.onclick = async () => {
        try {
            const result = await fetchJSON("api/user/friends/request", {
                method: "POST",
                body: { username: requestInput.value }
            });
            requestStatus.textContent = result.message;
            requestInput.value = "";
        } catch (error) {
            requestStatus.textContent = "Error sending request.";
        }
    };
    requestSection.appendChild(requestButton);

    const requestStatus = document.createElement("p");
    requestSection.appendChild(requestStatus);
    page.appendChild(requestSection);

    // incoming friend requests section
    const friendsJson = await fetchJSON("api/user/friends");

    const incomingSection = document.createElement("div");
    incomingSection.classList.add("friends-section");

    const incomingTitle = document.createElement("h3");
    incomingTitle.textContent = "Incoming Friend Requests";
    incomingSection.appendChild(incomingTitle);

    if (friendsJson.friendRequests.length === 0) {
        const none = document.createElement("p");
        none.textContent = "No pending friend requests.";
        incomingSection.appendChild(none);
    } else {
        friendsJson.friendRequests.forEach(username => {
            const row = document.createElement("div");
            row.classList.add("friend-row");

            const name = document.createElement("span");
            name.textContent = username;
            row.appendChild(name);

            const acceptBtn = document.createElement("button");
            acceptBtn.textContent = "Accept";
            acceptBtn.onclick = async () => {
                await fetchJSON("api/user/friends/request", {
                    method: "PATCH",
                    body: { username, action: "accepted" }
                });
                loadFriends();
            };

            const rejectBtn = document.createElement("button");
            rejectBtn.textContent = "Reject";
            rejectBtn.onclick = async () => {
                await fetchJSON("api/user/friends/request", {
                    method: "PATCH",
                    body: { username, action: "rejected" }
                });
                loadFriends();
            };

            row.appendChild(acceptBtn);
            row.appendChild(rejectBtn);
            incomingSection.appendChild(row);
        });
    }
    page.appendChild(incomingSection);

    // current friends section
    const currentSection = document.createElement("div");
    currentSection.classList.add("friends-section");

    const currentTitle = document.createElement("h3");
    currentTitle.textContent = "Your Friends";
    currentSection.appendChild(currentTitle);

    if (friendsJson.friends.length === 0) {
        const none = document.createElement("p");
        none.textContent = "No friends yet.";
        currentSection.appendChild(none);
    } else {
        friendsJson.friends.forEach(username => {
            const row = document.createElement("div");
            row.classList.add("friend-row");

            const name = document.createElement("span");
            name.textContent = username;
            row.appendChild(name);

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.onclick = async () => {
                await fetchJSON("api/user/friends", {
                    method: "DELETE",
                    body: { username }
                });
                loadFriends();
            };

            const tradeBtn = document.createElement("button");
            tradeBtn.textContent = "Trade";
            tradeBtn.onclick = () => loadSendTrade(username);
            row.appendChild(tradeBtn);
            row.appendChild(removeBtn);
            currentSection.appendChild(row);
        });
    }
    page.appendChild(currentSection);

    mainContent.appendChild(page);
}

async function loadTrades() {
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = "";

    const page = document.createElement("div");
    page.classList.add("tradesPage");

    const title = document.createElement("h2");
    title.textContent = "Trades";
    page.appendChild(title);

    const tradesJson = await fetchJSON("api/user/trades");

    // incoming trades
    const incomingSection = document.createElement("div");
    incomingSection.classList.add("trades-section");

    const incomingTitle = document.createElement("h3");
    incomingTitle.textContent = "Incoming Trade Requests";
    incomingSection.appendChild(incomingTitle);

    if (tradesJson.incoming.length === 0) {
        const none = document.createElement("p");
        none.textContent = "No incoming trades.";
        incomingSection.appendChild(none);
    } else {
        tradesJson.incoming.forEach(trade => {
            const row = document.createElement("div");
            row.classList.add("trade-row");

            const info = document.createElement("p");
            info.textContent = `From ${trade.senderUsername} — They offer cards: [${trade.senderCards.join(", ")}] for your cards: [${trade.receiverCards.join(", ")}] — Status: ${trade.status}`;
            row.appendChild(info);

            if (trade.status === "pending") {
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

                row.appendChild(acceptBtn);
                row.appendChild(rejectBtn);
            }

            incomingSection.appendChild(row);
        });
    }
    page.appendChild(incomingSection);

    // outgoing trades
    const outgoingSection = document.createElement("div");
    outgoingSection.classList.add("trades-section");

    const outgoingTitle = document.createElement("h3");
    outgoingTitle.textContent = "Outgoing Trade Requests";
    outgoingSection.appendChild(outgoingTitle);

    if (tradesJson.outgoing.length === 0) {
        const none = document.createElement("p");
        none.textContent = "No outgoing trades.";
        outgoingSection.appendChild(none);
    } else {
        tradesJson.outgoing.forEach(trade => {
            const row = document.createElement("div");
            row.classList.add("trade-row");

            const info = document.createElement("p");
            info.textContent = `To ${trade.receiverUsername} — You offered: [${trade.senderCards.join(", ")}] for their cards: [${trade.receiverCards.join(", ")}] — Status: ${trade.status}`;
            row.appendChild(info);

            if (trade.status === "pending") {
                const cancelBtn = document.createElement("button");
                cancelBtn.textContent = "Cancel";
                cancelBtn.onclick = async () => {
                    await fetchJSON(`api/user/trade/${trade._id}`, {
                        method: "PATCH",
                        body: { status: "cancelled" }
                    });
                    loadTrades();
                };
                row.appendChild(cancelBtn);
            }

            outgoingSection.appendChild(row);
        });
    }
    page.appendChild(outgoingSection);

    mainContent.appendChild(page);
}

async function loadSendTrade(receiverUsername) {
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = "";

    const userJson = await fetchJSON("api/user/");
    const receiverJson = await fetchJSON(`api/user/${receiverUsername}`);

    const page = document.createElement("div");
    page.classList.add("sendTradePage");

    const title = document.createElement("h2");
    title.textContent = `Send Trade to ${receiverUsername}`;
    page.appendChild(title);

    // helper to build a card row with a quantity input
    function createCardRow(card, cardsMap) {
        const row = document.createElement("div");
        row.classList.add("trade-card-row");

        const label = document.createElement("span");
        label.textContent = `Card ${card.cardID} - ${card.name} (you have x${card.quantity})`;
        row.appendChild(label);

        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = card.quantity;
        input.value = 0;
        input.classList.add("trade-quantity-input");
        input.oninput = () => {
            // clamp value between 0 and max quantity
            let val = parseInt(input.value) || 0;
            if (val < 0) val = 0;
            if (val > card.quantity) val = card.quantity;
            input.value = val;
            cardsMap[card.cardID] = val;
        };
        row.appendChild(input);

        return row;
    }

    // your cards
    const yourSection = document.createElement("div");
    yourSection.classList.add("trade-card-section");

    const yourTitle = document.createElement("h3");
    yourTitle.textContent = "Your Cards (enter how many to offer)";
    yourSection.appendChild(yourTitle);

    const senderCardsMap = {}; // { cardID: quantity }
    userJson.inventory.forEach(card => {
        senderCardsMap[card.cardID] = 0;
        yourSection.appendChild(createCardRow(card, senderCardsMap));
    });
    page.appendChild(yourSection);

    // their cards
    const theirSection = document.createElement("div");
    theirSection.classList.add("trade-card-section");

    const theirTitle = document.createElement("h3");
    theirTitle.textContent = `${receiverUsername}'s Cards (enter how many to request)`;
    theirSection.appendChild(theirTitle);

    const receiverCardsMap = {}; // { cardID: quantity }
    receiverJson.inventory.forEach(card => {
        receiverCardsMap[card.cardID] = 0;
        theirSection.appendChild(createCardRow(card, receiverCardsMap));
    });
    page.appendChild(theirSection);

    const status = document.createElement("p");
    page.appendChild(status);

    const sendBtn = document.createElement("button");
    sendBtn.textContent = "Send Trade Request";
    sendBtn.onclick = async () => {
        // convert maps to arrays of cardIDs, repeating for quantity
        const senderCards = Object.entries(senderCardsMap)
            .flatMap(([cardID, qty]) => Array(qty).fill(Number(cardID)));

        const receiverCards = Object.entries(receiverCardsMap)
            .flatMap(([cardID, qty]) => Array(qty).fill(Number(cardID)));

        if (senderCards.length === 0 && receiverCards.length === 0) {
            status.textContent = "Please select at least one card to trade.";
            return;
        }

        try {
            await fetchJSON("api/user/trade", {
                method: "POST",
                body: { receiverUsername, senderCards, receiverCards }
            });
            status.textContent = "Trade request sent!";
        } catch (error) {
            status.textContent = "Error sending trade.";
        }
    };
    page.appendChild(sendBtn);

    const backBtn = document.createElement("button");
    backBtn.textContent = "Back to Friends";
    backBtn.onclick = loadFriends;
    page.appendChild(backBtn);

    mainContent.appendChild(page);
}