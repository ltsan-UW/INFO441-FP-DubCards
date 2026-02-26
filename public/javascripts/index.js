async function init() {
  console.log("loading dubcards frontend...");
  loadStore(); //for now. should load based on buttons later
  return;
}

async function loadStore() {
  const storeJson = await fetchJSON(`api/store/packs`)
  const packs = await Promise.all(
    storeJson.map(pack => createPack(pack))
  );
  let packsHTML = packs.join("");

  let storeHTML = `
      <div class="store">
        <h2>Store!</h2>
        <div class="packs">
          ${packsHTML}
        </div>
      </div>
        `
  document.getElementById("mainContent").innerHTML = storeHTML;
  return;
}

async function loadPack(packID) {
  const packJSON = await fetchJSON(`api/store/packs/` + packID)
  let packHTML = `
  <div class="packPage">
    <button onclick="loadStore()">back</button>
    <h2>${packJSON.name}</h2>
    <p><strong>Description:</strong> ${packJSON.description}</p>
    <p><strong>Price:</strong> $${packJSON.price}</p>
    <p><strong>Pack ID:</strong> ${packJSON.packID}</p>

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
    <button onclick="openPack('${packJSON.packID}', '${packJSON.name}')">buy</button>
  </div>
`;
  document.getElementById("mainContent").innerHTML = packHTML;
}

async function openPack(packID, packName) {
  try {
    const cardsJSON = await fetchJSON(`api/store/packs/` + packID, {
      method: "POST",
      body: {}
    })
  const cards = await Promise.all(
    cardsJSON.map(card => createCard(card))
  );

  let cardsHTML = `
    <div class="packCardsPage">
      <h2>Cards received from ${packName}:</h2>
      ${cards.join("")}
      <button onclick="loadStore()">next</button>
    </div>
  `;
    document.getElementById("mainContent").innerHTML = cardsHTML;
  } catch (error) {
    throw (error)
  }
}

async function loadInventory() {

}

async function clickLogin() {
  console.log("You clicked logged in!")
}
async function clickSignUo() {
  console.log("You clicked sign up!")
}