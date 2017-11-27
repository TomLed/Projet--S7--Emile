//Imports
var express = require('express');
var socket = require('socket.io');
var emile = require('./emile');


//Setting up the app
var app = express();

var server = app.listen(4000, function (){
    console.log('Currently listening to port 4000!');
});

//Static files
app.use(express.static('public'));


//Setting up the socket
var io = socket(server);

io.on('connection', function(socket){
    emile.initGame(io, socket); //fires the initGame function in emile.js
});
