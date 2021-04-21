import newGame from "./newGame.js";
import onJoinGame from "./onJoinGame.js";

export const onConnection = (socket) => {
    console.log(socket.id + ' joined!')
    socket.on('newGame', newGame);
    socket.on('joinGame', onJoinGame);
    socket.on('joinTeam', onJoinTeam);
    socket.on('cardTap', onCardTap);
    socket.on('clue', onClue);
    socket.on('disconnect', onDisconnect);
}

function onNewGame() {

}

function onJoinTeam(gameID, player) {
    console.log(player.nickname + ' is trying to join');
    const socket = this;
    socket.join(gameID);
    socket.to(gameID).emit('playerJoin', player);
}

function onClue() {

}

function onCardTap() {

}

function onDisconnect() {

}