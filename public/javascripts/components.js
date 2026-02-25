
async function createCard(cardData){
    return `
    <div class="card rarity_${cardData.rarity}">
        <h2>${cardData.name}</h2>
        <img href="./images/${cardData.cardID}">
    </div> `
}

function createPack(packData){
    return `
      <div class="cardPack" id="${packData.packID}">
        <strong>${packData.name}</strong>
        <p>Price: ${packData.price}</p>
        <button>buy</button>
      </div>
    `
}