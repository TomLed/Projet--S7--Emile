//Imports
var express = require('express');
var socket = require('socket.io');
var emile = require('./emile');
var getPlayerStatus = require('./getPlayerStatus');
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


app.get('/join', function(req, res){
    res.sendFile(__dirname + '/public/views/join.html');
});


app.get('/play/rooms/:roomId/players/:playerName', function(req, res){
    //Collect the room id and the player name
    var roomId = req.params.roomId;
    var playerName = req.params.playerName;

    if (getPlayerStatus(io, roomId, playerName)){
        //Send the change name page
        res.sendFile(__dirname + '/public/views/changeName.html');
    }
    else{
        //Send the game page
        res.sendFile(__dirname + '/public/views/play.html');

        //Wait for the connection event
        io.on('connection', function(socket){
            emile.initGame(io, socket, playerName, roomId); //fires the initGame function in emile.js
        });
    }
});

app.get('/replay/rooms/:roomId/players/:playerName', function(req, res){
    //Collect the room id and the player name
    var roomId = req.params.roomId;
    var playerName = req.params.playerName;

    if (!getPlayerStatus(io, roomId, playerName)){
        //Send the change name page
        res.sendFile(__dirname + '/public/views/notThere.html');
    }
    else if(io.nsps['/'].adapter.rooms[roomId].length >= 2){
        //Send the change name page
        res.sendFile(__dirname + '/public/views/roomAlreadyFull.html');
    }
    else{
        //Send the game page
        res.sendFile(__dirname + '/public/views/play.html');

        //Wait for the connection event
        io.on('connection', function(socket){
            emile.reinitGame(io, socket, playerName, roomId); //fires the reinitGame function in emile.js
        });
    }
});
