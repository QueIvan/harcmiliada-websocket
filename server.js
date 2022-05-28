const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);

const io = socketIo(server, { cors: { orgin: "*" } });

io.on("connect", (socket) => {
	console.log(`Połączono: ${socket.id}`);

	socket.on("join", (roomName, gameId) => {
		socket.join(`${roomName}-&${gameId}`);
		console.log(`${socket.id} dołączył do pokoju ${roomName}-#${gameId}`);
		socket.emit("joined", `${roomName}-#${gameId}`);
	});

	socket.on("setVisibilityStatus", (roomName, data) => {
		socket.to(roomName).emit("setVisibilityStatus", data);
	});

	socket.on("setAnswerVisibility", (roomName, data) => {
		socket.to(roomName).emit("setAnswerVisibility", data);
	});

	socket.on("setWrongAnswersCount", (roomName, data) => {
		socket.to(roomName).emit("setWrongAnswersCount", data);
	});

	socket.on("setAnswerer", (data) => {
		socket.to(`console-&${data.gameId}`).emit("setAnswerer", data.side);
		socket.to(`presenter-&${data.gameId}`).emit("setAnswerer", data.side);
		socket.to(`answerer-&${data.gameId}`).emit("setAnswerer", data.side);
	});

	socket.on("justKeepSwimming", () => {
		console.log("[SERVER] 'justKeepSwimming' event called");
	});

	socket.on("reloadBoard", (roomName) => {
		socket.to(roomName).emit("reloadBoard");
	});

	socket.on("disconnect", () => console.log(`Rozłączono: ${socket.id}`));
});

server.listen(port, () => console.log(`Nasłuchuję port: ${port}`));
