// Server requirements
var express = require('express');
var socket = require('socket.io');
var cookieParser = require('cookie-parser');


// Game logic requirements
var Game = require('./objects/Game');


// Starting app
var app = express();
app.use(cookieParser());


// Starting server and socket.io module
var server = app.listen(4000, console.log('Currently listening to port 4000!'));
var io = socket(server);


// Folders the server uses
app.use('/styles', express.static('public/styles'));
app.use('/src', express.static('public/src'));
app.use('/tex', express.static('public/tex'));
app.use('/scripts', express.static('public/scripts'));
app.use('/views', express.static('public/views'));


// Initializing game logic
var game = new Game();


// When client asks for /join page
app.get('/join', function(req, res) {
    res.sendFile(__dirname + '/public/views/join.html');
});


// When client asks for /play page (to either join a new game or resume one)
app.get('/play/rooms/:roomId/players/:playerName', function(req, res) {
    // Store request parameters
    var name = req.params.playerName;
    var id = req.params.roomId;

    // Does the room already exist?
    if (game.rooms[id]) {
    // Yes it does: is the requested player in that room?
        if (game.rooms[id].players[name]) {
            // Yes he is: is he currenty connected? (does he have an active socket?)
            if (game.rooms[id].players[name].socket)
            // Yes he is: the player can't join
                res.sendFile(__dirname + '/public/views/alreadyConnected.html');
            else {
                // No he isn't: the player can resume
                res.sendFile(__dirname + '/public/views/play.html');
                io.on('connection', function(socket) {
                    if(!game.rooms[id].players[name].socket) // To avoid tab duplication issues
                        game.rooms[id].resumePlayer(name, socket);
                });
            }
        } else {
            // No he isn't: is the room full?
            if (game.rooms[id].isFull())
            // Yes it is: player can't join...
                res.sendFile(__dirname + '/public/views/roomFull.html');
            else {
                // No it isn't: player can join, wait for connection, add the player
                res.sendFile(__dirname + '/public/views/play.html');
                io.on('connection', function(socket) {
                    if (!game.rooms[id].players[name]) // To avoid tab duplication issue
                        game.rooms[id].addPlayer(name, socket);
                });
            }
        }
    } else {
    // No it doesn't: create a new room, wait for connection, add the first player
        game.addRoom(id);
        res.sendFile(__dirname + '/public/views/play.html');
        io.on('connection', function(socket) {
            if (!game.rooms[id].players[name]) // To avoid tab duplication issue
                game.rooms[id].addPlayer(name, socket);
        });
    }
});
