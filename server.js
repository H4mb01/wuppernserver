const cors = require('cors');
const Express = require('express')();
const Http = require('http').Server(Express);
Express.use(cors());
const {
    getGamestate, 
    addPlayer, 
    verteileHandkarten, 
    createNewGame,
    playCard,
    werteStichAus
} = require('./utils/game')


const Socketio = require("socket.io")(Http, {
    cors: {
        origin: "http://localhost:8080"
    }
});

const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

let gamestate = {
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
    ]
}

// wenn der Client verbunden ist
Socketio.on('connection', socket => {
    socket.on('joinRoom', (username, room) => {
        const user = userJoin(socket.id, username, room);

        //sendet ersten gamestate an Client
        socket.emit("gamestate", JSON.stringify(getGamestate(user.room, user.username)));

        //sendet Rauminfo und user
        Socketio.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })


    // wenn der Client die Verbindung trennt
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
    })
});

Http.listen(3000, () => {
    console.log("listening at :3000...");
});


createNewGame("raum1")
addPlayer("raum1", "Simon")
addPlayer("raum1", "Manuel")
addPlayer("raum1", "Laui")
verteileHandkarten("raum1", 5)
playCard("raum1", "Manuel", getGamestate("raum1", "Manuel").handkarten.pop())
playCard("raum1", "Laui", getGamestate("raum1", "Laui").handkarten.pop())
playCard("raum1", "Simon", getGamestate("raum1", "Simon").handkarten.pop())
werteStichAus("raum1")
console.log(getGamestate("raum1", "Manuel"))