async function init() {
  console.log("loading dubcards frontend...");
  loadStore(); //for now. should load based on buttons later
  return;
}

async function loadStore() {

  const storeJson = await fetchJSON(`api/store/packs`)
  let packsHTML = "";
  storeJson.forEach(async pack =>  {
    packsHTML += createPack(pack);
  });

  let packsHtml = `
      <div class="store">
        <h2>Store!</h2>
        <div class="packs">
          ${packsHTML}
        </div>
      </div>
        `
  document.getElementById("mainContent").innerHTML = packsHtml;
  return;
}

async function loadInventory() {

}