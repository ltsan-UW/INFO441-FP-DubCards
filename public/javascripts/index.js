async function init() {
  console.log("loading dubcards frontend...");
  loadStore(); //for now. should load based on buttons later
  return;
}

async function loadStore() {
  const storeJson = await fetchJSON(`api/store/packs`)
  let packsHTML = "";
  storeJson.forEach(async pack => {
    packsHTML += createPack(pack);
  });

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
    <button onclick="openPack('${packJSON.packID}')">buy</button>
  </div>
`;
  document.getElementById("mainContent").innerHTML = packHTML;
}

async function loadInventory() {

}