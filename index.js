import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import { createServer } from "http";
import { Server } from "socket.io";

import  newGame from './controllers/newGame.js'

const app = new Koa();
app.use(cors());
app.use(bodyParser())
const router = new Router();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app.callback()).listen(PORT, () => {console.log('App running on port ' + PORT)});
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(socket.id);
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


app.use(router.routes());


// app.listen(PORT, null, () => {
//     console.log("App running on port", PORT);
// });