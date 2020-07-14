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

    socket.on("joined", function(data) {
        socket.userId = data;
        activeUsers.add(data);
    });

    socket.on("roll", function(data) {
        console.log(data);
        //roll dice(s) and return result
    });
}); 