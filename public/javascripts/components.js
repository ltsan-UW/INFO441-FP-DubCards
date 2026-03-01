
async function createCard(cardData){
    return `
    <div data-tilt class="card rarity_${cardData.rarity}">
        <img src="../../local-data/${cardData.imgPath}">
    </div> `
}
// <img href="./images/${cardData.cardID}"></img>

function createPack(packData){
    return `
      <div class="cardPack" id="${packData.packID}">
        <strong>${packData.name}</strong>
        <p>Price: ${packData.price}</p>
        <button onclick="loadPack('${packData.packID}')">more</button>
      </div>
    `
}