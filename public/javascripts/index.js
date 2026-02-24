async function init(){
    console.log("loading dubcards frontend...");
    loadStore(); //for now. should load based on buttons later
    return;
}

async function loadStore(){

    //eventually
    //let storeJson = await fetchJSON(`api/${apiVersion}/posts`)
    
    let postsHtml = 
         `
    <div class="store">
        <h2>Store!</h2>
        <div class="packs">
          <div class="cardPack" id="pack1">
            <strong>Dubs Anniversary Pack</strong>
            <button>buy</button>
          </div>
        </div>
      </div>
        `
    document.getElementById("mainContent").innerHTML = postsHtml;
    return;
}

async function loadInventory(){

}