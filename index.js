const express = require("express");
const socket = require("socket.io");

const PORT = 5000;
const app = express();

const server = app.listen(PORT, function() {
    console.log(`Listening on port: ${PORT}`);
});


app.use(express.static("public"));

const io = socket(server);
const activeUsers = new Set();

io.on("connection", function(socket) {
    console.log("Connection on!");

    socket.on("player connect", function(data) {
        console.log("Connectd: ", data);
        socket.userId = data;
        activeUsers.add(data);
        io.emit("player connect", [...activeUsers]);
    });

    socket.on("player disconect", () => {
        activeUsers.delete(socket.userId);
        io.emit("player diconect", socket.userId);
    });

    socket.on("roll", function(data) {
        console.log(data);

        let sum = 0;
        let rolls = [];

        for(let i=0; i < data.quantity; i ++) {
            let roll = 1 + Math.floor(Math.random() * data.sides);
            console.log(roll);
            sum += roll;
            console.log(sum);
            rolls.push(roll);
        }
        console.log(rolls);
        data.rolled = sum;
        data.rolls = rolls;
        io.emit("roll", data);
    });
}); 