import  { db }  from '../db/firestore.js'

export default async function onJoinGame(gameID) {
    const socket = this;
    socket.join(gameID);
    const game = await db.collection("games")
        .doc(gameID)
        .get()
        .then(doc => {
        if (doc.exists) {
            const game = doc.data();
            game.cards.forEach(card => {card.type = 'neutral'});
            socket.emit('existingGameState', game);
        }
    }).catch(err => {});
}