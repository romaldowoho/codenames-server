import  { db }  from '../db/firestore.js'
import  {io} from '../index.js'

export default async function onJoinGame(gameID) {
    const socket = this;
    socket.join(gameID);
    const roomSocketIDs = io.sockets.adapter.rooms.get(gameID);
    // get the list of players in the room
    const playersOnline = [];
    for (const id of roomSocketIDs ) {
        const clientSocket = io.sockets.sockets.get(id);
        if (clientSocket.data.player) {
            playersOnline.push(clientSocket.data.player);
        }
    }
    await db.collection("games")
        .doc(gameID)
        .get()
        .then(doc => {
        if (doc.exists) {
            const game = doc.data();
            game.players = playersOnline;
            game.cards.forEach(card => {card.type = 'neutral'});
            socket.emit('existingGameState', game);
        }
    }).catch(err => {});
}