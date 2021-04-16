import  { db }  from '../db/firestore.js'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

// Fisher-Yates shuffle
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let idx = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[idx]] = [arr[idx], arr[i]];
    }
}

const getTeams = () => {
    const n = Math.round(Math.random());
    return n > 0 ? ['red','blue'] : ['blue','red'];
}

const generateGameID = () => {
    return uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals]
    });
}

export default async function newGame(ctx, next) {
    const player = ctx.request.body.nickname;
    // 1400 adjectives, 350 animals, 50 colors for a total of 24.5 million possible IDs
    const gameID = generateGameID();
    const allWords = await db.collection('word_packs')
        .doc('standard')
        .get()
        .then(doc => doc.data()?.words)
        .catch(err => {console.log(err)});

    if (!allWords) {
        ctx.throw(500, 'Internal server error');
    }

    // shuffle the words
    shuffle(allWords);

    // teams[0] starts first
    const teams = getTeams();

    const cards = [];
    // 9 cards for the starting team, 8 for the second, 7 neutral cards and 1 assassin
    const roles = {
        [teams[0]]: 9,
        [teams[1]]: 8,
        neutral: 7,
        assassin: 1
    }

    let wordIdx = 0;
    for (const [role, n] of Object.entries(roles)) {
       for (let i = 0; i < n; i++) {
           cards.push({
               value: allWords[wordIdx],
               type: role,
               tapped: false
           });
           wordIdx++;
       }
    }
    shuffle(cards);

    const game = {
        id: gameID,
        starting_team: teams[0],
        winner_team: null,
        cards: cards,
        blue_team: [],
        red_team: [],
        game_log: []
    }

    // await db.collection('games')
    //         .doc(gameID)
    //         .set(game)
    //         .then(() => {})
    //         .catch(err => {ctx.throw(500, 'Internal server error')});

    ctx.body = game;
}