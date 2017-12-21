$(function() {

    $('#btnStart').on('click', function(){
        var playerName = $('#inputPlayerName').val();
        var gameId = $('#inputGameId').val();
        if (!playerName && !gameId){
            alert('Please type a nickname and a room id!');
        }
        else if(!playerName){
            alert('Please type a nickname!');
        }
        else if(!gameId){
            alert('Please type a room id!');
        }
        else{
            window.location = 'http://localhost:4000/play/rooms/' + gameId + '/players/' + playerName;
        }
    });

    $('#btnResume').on('click', function(){
        var playerName = $('#inputPlayerName').val();
        var gameId = $('#inputGameId').val();
        if (!playerName && !gameId){
            alert('Please type a nickname and a room id!');
        }
        else if(!playerName){
            alert('Please type a nickname!');
        }
        else if(!gameId){
            alert('Please type a room id!');
        }
        else{
            window.location = 'http://localhost:4000/replay/rooms/' + gameId + '/players/' + playerName;
        }
    });

});
