import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import { createServer } from "http";
import { Server } from "socket.io";
import  { db }  from './db/firestore.js'

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const firebase = require('firebase/app');

import  newGame from './controllers/newGame.js'
import  joinGame from './controllers/joinGame.js'


const app = new Koa();
app.use(cors());
app.use(bodyParser())
const router = new Router();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app.callback()).listen(PORT, () => {console.log('App running on port ' + PORT)});
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true
    }
});


const join = (socket, team, role, gameID) => {

}
io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on('join', (team, role, nickname, gameID) => {
        console.log(nickname);
        // when a player joins a game they are added to a channel that has an ID of the game's id
        socket.join(gameID);
        const player = {
            nickname,
            role
        }
        socket.to(gameID).emit('player_join', nickname);

        db.collection('games').doc(gameID).update({
            [team]:  firebase.firestore.FieldValue.arrayUnion(player)
        }).then().catch(err => {
            console.log(err);
        });
    });




    socket.on("disconnect", (reason) => {
        console.log(reason);
    });
});



app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.status) {
            ctx.status = err.status;
            ctx.body = { error: err.message };
        } else {
            console.error(err);
            ctx.status = 500;
            ctx.body = { error: "Internal server error" };
        }
    }
});

// router.get('/newgame', async (ctx, next) => {
//
//     ctx.body = gameID;
//
//
// },)

router.post('/newgame',newGame);
router.post('/joingame',joinGame);

app.use(router.routes());


// app.listen(PORT, null, () => {
//     console.log("App running on port", PORT);
// });