import  { db }  from '../db/firestore.js'

export default async function joinGame(ctx, next) {
    const player = ctx.request.body.nickname;
    const gameID = ctx.request.body.gameID;

    const game = await db.collection("games")
        .doc(gameID)
        .get()
        .then(doc => {
        if (doc.exists) {
            ctx.body = doc.data();
        } else {
            ctx.throw(404, 'room not found');
        }
    }).catch(err => {
        ctx.throw(500, 'Internal server error');
    });
}