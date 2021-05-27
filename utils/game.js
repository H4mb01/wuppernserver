const e = require("cors");
const {Deck} = require("./deck.js");

const deck = new Deck()
deck.shuffle()

let gamestates = [{
    room: "raum1",
    players: [{
        name: "Manu",
        punkte: 13,
        angesagt: 1,
        aktuell: 0
        },
        {
        name: "Laui",
        punkte: 12,
        angesagt: 2,
        aktuell: 0
        }, 
        {
        name: "Simon",
        punkte: 23,
        angesagt: 0,
        aktuell: 0
        }
    ],
    playedCards: [
        { player: "Manu", zahl: "9", farbe: "♣"},
        { player: "Laui", zahl: "7", farbe: "♣"},
    ],
    ansagen: {
        start: "Manu" ,
        aktuell: "",
        ende: "Simon"
    }
}, {
room: "raum2",
players: [{
    name: "olaf",
    punkte: 22,
    angesagt: 0,
    aktuell: 1
},
{
    name: "alfons",
    punkte: 1,
    angesagt: 2,
    aktuell: 0
},
{
    name: "supergamer69",
    punkte: 11,
    angesagt: 1,
    aktuell: 0
}
],
playedCards: [
    { player: "alfons", zahl: "10", farbe: "♣" }
],
runde: {
    aktuell: 3,
    maximal: 20
}
},

]


function createNewGame(room){
    if (gamestates[room]){
        console.log("game with this name already exists")
        return
    }
    else {
        gamestates[room] = {
            room: room,
            players: [],
            playedCards: [],
            ansagen: {
                isAnsagen: false,
                start: "",
                aktuell: "",
                ende: ""
            },
            isStarted: false,
            isEnded: false,
            reihenfolge: [],
            anDerReihe: "",
            runde: {
                aktuell: 0,
                maximal: 0
            },
            handkarten: []
        }
    }
}

function addPlayer(room, player) {
    gamestates[room].players.push(
    {
        name: player,
        punkte: 0,
        angesagt: 0,
        aktuell: 0
    })
}

function getGamestate(room, username){
    let gamestate = Object.assign({}, gamestates[room]);
    console.log(gamestates[room].players.find(e=>e.name===username))
    console.log(gamestate.handkarten[username])
    console.log(gamestate.handkarten)
    if(gamestates[room].players.find(e=>e.name===username)){
        let userHandkarten = gamestate.handkarten[username] || []
        gamestate.handkarten = userHandkarten
    } else {
        gamestate.handkarten = []
    }
    return gamestate;
}

function startGame(room){
   if (gamestates[room].isStarted === false){
       gamestates[room].isStarted = true;
   } else {
       console.log("game already started")
   }
}

function endGame(room){
    if (gamestates[room].isEnded === false){
       gamestates[room].isEnded = true;
   } else {
       console.log("game already ended")
   }
}

function setReihenfolge(room, playerReihenfolge){
    gamestates[room].reihenfolge = playerReihenfolge;
}

function playCard(room, player, card){
    gamestates[room].playedCards.push({
        player: player,
        zahl: card.zahl,
        farbe: card.farbe
    })
}

function verteileHandkarten(room, anzahl){
    let newdeck = new Deck;
    newdeck.shuffle();
    const users = gamestates[room].players;
    if (gamestates[room].handkarten === [] ) {
        console.log("Handkarten sind bereits verteilt")
    }
    else {
        for (user in users) {
            gamestates[room].handkarten[users[user].name] = []
            for (let j = 0; j < anzahl; j++) {
                const card = newdeck.cards.pop();
                const zahl = card.value;
                const farbe = card.suit;
                gamestates[room].handkarten[users[user].name].push({
                    zahl: zahl,
                    farbe: farbe
                })
            }
        }
    }
}

function werteStichAus(room) {
    if (gamestates[room].players.lenght === gamestates[room].playedCards.lenght) {
        gamestates[room].players.find(e=>e.name === findeStich(room).player).aktuell += 1;
    } else return -1;
}

function findeStich(room){
    let cards = gamestates[room].playedCards;
    while (Object.keys(cards).length > 1){
        cards.push(direkterVergleich(cards.pop(), cards.pop()))
    }
    return cards[0]
}

const ZAHL_WERT={
    "7": 1, 
    "8": 2,
    "9": 3,
    "B": 4,
    "D": 5,
    "K": 6,
    "10": 7,
    "A": 8
}

const FARBE_WERT={
    "♣": 4, "♠": 3, "♥": 2, "♦": 1
}

function direkterVergleich(card1, card2){
   if (ZAHL_WERT[card1.zahl] == ZAHL_WERT[card2.zahl]){
       if (FARBE_WERT[card1.farbe] > FARBE_WERT[card2.farbe]){
           return card1
       } else return card2
   } else if (ZAHL_WERT[card1.zahl] > ZAHL_WERT[card2.zahl]){
       return card1
   } else return card2
}

function calculateTurn(room){
    if (gamestates[room].handkarten){
        return -1
    } else {
        for (let i = 0; i < gamestates[room].players.length; i++){
            if (gamestates[room].players[i].aktuell === gamestates[room].players[i].angesagt){
                gamestates[room].players[i].punkte += 10;
            }
            gamestates[room].players[i].punkte += gamestates[room].players[i].aktuell;
            gamestates[room].players[i].angesagt = 0;
            gamestates[room].players[i].aktuell = 0;
        }
    }
}

function updateGamestate(room){}

function nextRound(room){
    const gamestate = gamestates[room];
    if (gamestate.runde.aktuell < gamestate.runde.maximal){

        gamestates[room].runde.aktuell++
        gamestates[room].playedCards = []
    }
    else {
        gamestates[room].isEnded = true;
    }
}

module.exports = {
    getGamestate,
    createNewGame,
    addPlayer,
    verteileHandkarten,
    playCard,
    werteStichAus
}