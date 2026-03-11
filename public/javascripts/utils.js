async function fetchJSON(route, options) {
    let response
    try {
        response = await fetch(route, {
            method: options && options.method ? options.method : "GET",
            body: options && options.body ? JSON.stringify(options.body) : undefined,
            headers: options && options.body ? { 'Content-Type': 'application/json' } : undefined
        })
    } catch (error) {
        displayError()
        throw new Error(
            `Error fetching ${route} with options: ${options ? JSON.stringify(options) : options}
             No response from server (failed to fetch)`)
    }
    let responseJson;
    try {
        responseJson = await response.json();
    } catch (error) {
        let responseText = await response.text();
        displayError()
        throw new Error(
            `Error fetching ${route} with options: ${options ? JSON.stringify(options) : options}
            Status: ${response.status}
            Response wasn't json: ${responseText ? JSON.stringify(responseText) : responseText}`)
    }
    if (response.status < 200 || response.status >= 300 || responseJson.status == "error") {
        displayError()
        throw new Error(
            `Error fetching ${route} with options: ${options ? JSON.stringify(options) : options}
            Status: ${response.status}
            Response: ${responseJson ? JSON.stringify(responseJson) : responseJson}`)
    }
    return responseJson
}

async function displayError() {
    document.getElementById('errorInfo').innerText = 'Error: action failed (see console for more information)'
    document.getElementById('errorInfo').style.opacity = 1
    // pause 4 seconds
    await new Promise(resolve => setTimeout(resolve, 4 * 1000))
    document.getElementById('errorInfo').innerText = ''
    document.getElementById('errorInfo').style.opacity = 0
}


// Updates the sell text to the given values
// add: a boolean where true would add and false would subtract
// rarity: the rarity of the card to sell | reset: only if true, reset the count to 0
function updateSellAmmount(add, rarity, reset) {
    const sellText = document.querySelector(".sell-text");
    let text = sellText.textContent;
    const currentPrice = parseInt(text.replace("Sell for ", "").replace("?", ""), 10);
    const amount = (reset ? 0 : currentPrice + ((add ? 1 : -1) * getRarityPrice(rarity)));
    sellText.textContent = `Sell for ${amount}?`
}

// Returns the price based on the rarity given
function getRarityPrice(rarity) {
    const rarityPrices = {
        "Common": 10,
        "Uncommon": 25,
        "Rare": 50,
        "Ultra-Rare": 100,
        "Legendary": 250
    };
    return rarityPrices[rarity];
}

// Creates a card overlay for a given card DOM element
function createCardOverlay(card) {
    card.classList.toggle("card-sell")
    let overlay = card.querySelector(".card-sell-icon");
    if (!overlay) {
        overlay = document.createElement("div");
        const text = document.createElement("div");
        const icon = document.createElement("div");
        text.textContent = "Sell for " + getRarityPrice(card.classList[1].replace("rarity_", ""));
        icon.textContent = "+";
        overlay.appendChild(text);
        overlay.appendChild(icon);
        overlay.classList.add("card-sell-icon");
        card.appendChild(overlay);
    } else overlay.remove();
}

// Helper function for sidebar to keep clicked button darker than the others
function setActiveButton(clickedButton) {
  document.querySelectorAll(".side-button").forEach(btn => {
    btn.classList.remove("active");
  });

  clickedButton.classList.add("active");
}

// Returns a string of cards, given an object with card name : quantity format
function formatCardNames(cards) {
    let names = Object.keys(cards);
    let newNames = [];
    names.forEach((name) => {
        newNames.push(((cards[name] > 1) ? cards[name] + " × " + name : name));
    })
    return newNames.join(", ")
}