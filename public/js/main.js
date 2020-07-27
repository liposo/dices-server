const socket = io();

let playerName = prompt("Player name: ");

const playerList = document.querySelector('.grid');
const forms = document.querySelectorAll('form');
const quantityWrappers = document.querySelectorAll('.quantity-wrapper');

const newConnection = (player) => {
    playerName = player || playerName;
    socket.emit("player connect", playerName);
}

const addPlayerToList = (playerName) => {

    if (!!document.querySelector(`.playerName-${playerName}`)) {
        return;
    }

    let newPlayer = createPlayer(playerName);
    playerList.appendChild(newPlayer);
}

function createPlayer(playerName) {
    let player = document.createElement('article');
    player.className = "playerName-" + playerName;
    let div = document.createElement('div');
    div.className = 'title';

    let title = document.createElement('p');
    title.className = "playerName";
    title.textContent = playerName;

    let rollHistoryWrapper = document.createElement('div');
    rollHistoryWrapper.className = 'roll-history';
    rollHistoryWrapper.id = 'roll-history-' + playerName;

    div.appendChild(title);
    div.appendChild(rollHistoryWrapper);
    player.appendChild(div);

    return player;
}

function getDiceData(form) {
    let sides = form.querySelector('.input-sides');
    console.log(sides);
    let quantity = form.querySelector('.quantity');
    console.log(quantity);

    return {
        sides: sides.value,
        quantity: quantity.value
    };
}

function createRollEntry({
    rolled,
    sides,
    quantity,
    rolls
}) {
    let div = document.createElement('div');
    div.className = 'roll';

    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric"
    });

    let small = document.createElement('small');
    small.className = 'time';
    small.textContent = `${formattedTime}`;

    let p = document.createElement('p');
    p.className = 'roll-text'
    p.innerHTML = `Rolled <span class="roll-result">${rolled}</span>
    from <span class="number-of-dices">${quantity}</span>
    D<span class="dice-sides">${sides}</span>`;

    div.appendChild(small);
    div.appendChild(p);

    if (quantity > 1) {
        let rollList = document.createElement('small');
        rollList.textContent = `Rolls: ${rolls}`;
        div.appendChild(rollList);
    }

    return div;
}

const displayRoll = ({
    playerName,
    rolled,
    sides,
    quantity,
    rolls
}) => {
    const rollList = document.querySelector('#roll-history-' + playerName);
    rollList.appendChild(createRollEntry({
        rolled,
        sides,
        quantity,
        rolls
    }));

    rollList.scrollTop = rollList.scrollHeight - rollList.clientHeight;
    rollList.animate({
        scrollTop: rollList.scrollHeight - rollList.clientHeight
    });
}



socket.on("player connect", function (data) {
    data.map((player) => addPlayerToList(player));
});

socket.on("player disconect", function (playerName) {
    document.querySelector('.playerName').remove();
});

socket.on("roll", function (data) {
    displayRoll({
        playerName: data.playerName,
        rolled: data.rolled,
        sides: data.sides,
        quantity: data.quantity,
        rolls: data.rolls
    });
});

newConnection();

quantityWrappers.forEach(quantityWrapper => {
    let inputQuantity = quantityWrapper.querySelector('.quantity');
    let buttonIncrease = quantityWrapper.querySelector('.increase');
    let buttonDecrease = quantityWrapper.querySelector('.decrease');

    buttonIncrease.addEventListener("click", () => {
        inputQuantity.value++;
    });

    buttonDecrease.addEventListener("click", () => {
        inputQuantity.value--;
        if(inputQuantity.value <= 1) {
            inputQuantity.value = 1;
        }
    });
});

forms.forEach(form => {
    let buttonRoll = form.querySelector('.button-roll');

    buttonRoll.addEventListener("click", (e) => {

        let diceData = getDiceData(form);
        console.log(diceData);

        socket.emit("roll", {
            playerName: playerName,
            sides: diceData.sides,
            quantity: diceData.quantity
        });
    });
});