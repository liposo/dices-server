const socket = io();

let playerName = '';

const playerList = document.querySelector('.player-list');
const rollList = document.querySelector('.roll-list');
const form = document.querySelector('.form');
const sidesInput = document.querySelector('.sides');

const newConnection = (player) => {
    playerName = player || `player${Math.floor(Math.random() * 100)}`; 
    socket.emit("player connect", playerName);
}

const addPlayerToList = (playerName) => {

    let player = document.createElement('li');
    player.className = playerName;
    player.textContent = playerName;

    playerList.appendChild(player);
}

const displayRoll = ({playerName, rolled, sides}) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

    let playerRoll = document.createElement('li');
    playerRoll.textContent = `${formattedTime}: ${playerName} rolled ${rolled} on a D${sides}`;

    rollList.appendChild(playerRoll);
}

newConnection();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!sidesInput.value) {
      return;
    }
  
    socket.emit("roll", {
      playerName: playerName,  
      sides: sidesInput.value,
    });
});

socket.on("player connect", function(data) {
    data.map((player) => addPlayerToList(player));
});

socket.on("player disconect", function(playerName) {
    document.querySelector('.playerName').remove();
});

socket.on("roll", function(data) {
    displayRoll({playerName: data.playerName, rolled: data.rolled, sides: data.sides});
});