
async function createCard(cardData){
    return `
    <div class="card rarity_${cardData.rarity}">
        <h2>${cardData.name}</h2>
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