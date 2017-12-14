//Imports
var express = require('express');
var socket = require('socket.io');
var emile = require('./emile');
var Room = require('./Room');
var Game = require('./Game');
var cookieParser = require('cookie-parser');


//Setting up the app
var app = express();
app.use(cookieParser());

var server = app.listen(4000, function (){
    console.log('Currently listening to port 4000!');
});


//Setting up the socket
var io = socket(server);


//Static files
app.use('/styles', express.static('public/styles'));
app.use('/tex', express.static('public/tex'));
app.use('/scripts', express.static('public/scripts'));
app.use('/views', express.static('public/views'));


var game = new Game();


app.get('/join', function(req, res){
    res.sendFile(__dirname + '/public/views/join.html');
});


app.get('/play/rooms/:roomId/players/:playerName', function(req, res){
    //Collect the player name and the room id
    var playerName = req.params.playerName;
    var roomId = req.params.roomId;

    //If the room doesn't exist in the game
    if (!game.rooms.includes(roomId)){
        var room;
        room = new Room(req.params.roomId); //Create the room
        game.addRoom(room); //Add it to the game object
    }

    if (game.getRoom(roomId).getPlayerStatus(playerName)){
        //Send the change name page
        res.sendFile(__dirname + '/public/views/changeName.html');
    }
    else{
        //Send the game page
        res.sendFile(__dirname + '/public/views/play.html');
        console.log(room);

        //Wait for the connection event
        io.on('connection', function(socket){
            emile.initGame(io, socket, playerName, roomId, game); //fires the initGame function in emile.js
        });
    }
});

app.get('/replay/rooms/:roomId/players/:playerName', function(req, res){
    //Collect the player name and the room id
    var playerName = req.params.playerName;
    var roomId = req.params.roomId;

    //If the room doesn't exist in the game or if the player is not inside it
    if (!game.rooms.includes(roomId) || !game.getRoom(roomId).getPlayerStatus(playerName)){
        //Send the change name page
        res.sendFile(__dirname + '/public/views/notThere.html');
    }
    else if(game.getRoom(roomId).players.length >= 2){
        //Send the change name page
        res.sendFile(__dirname + '/public/views/roomAlreadyFull.html');
    }
    else{
        //Send the game page
        res.sendFile(__dirname + '/public/views/play.html');

        //Wait for the connection event
        io.on('connection', function(socket){
            emile.reinitGame(io, socket, playerName, roomId, game); //fires the reinitGame function in emile.js
        });
    }
});
