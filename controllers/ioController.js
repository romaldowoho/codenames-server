import newGame from "./newGame.js";
import onJoinGame from "./onJoinGame.js";

export function onConnection(socket) {
    console.log(socket.id + ' joined!')
    socket.on('newGame', newGame);
    socket.on('joinRoom', onJoinGame);
    socket.on('joinTeam', onJoinTeam);
    socket.on('cardTap', onCardTap);
    socket.on('clue', onClue);
    socket.on('disconnecting', onDisconnect);
}

function onNewGame() {

}

function onJoinTeam(gameID, player) {
    console.log(player.nickname + ' is trying to join');
    const socket = this;
    socket.join(gameID);
    socket.data.player = player;
    socket.to(gameID).emit('playerJoin', player);
    socket.emit('playerJoin', player);
}

function onClue() {

}

function onCardTap() {

}

function onDisconnect() {
    const socket = this;
    if (socket.data.player) {
        const rooms = socket.rooms;
        console.log(rooms);
        for (const room of rooms) {
            if (room !== socket.id) {
                console.log(room);
                socket.to(room).emit('playerLeave', socket.data.player);
            }
        }
    }
    console.log(this.id + ' disconnected!');
}