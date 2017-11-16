// Imports
var express = require('express');
var bodyParser = require('body-parser');


//Functions
function randInt (min, max){

  return Math.round((max - min) * Math.random() + min)

}


var urlencodedParser = bodyParser.urlencoded({ extended: false });


var values = [0, 0, 0, 0, 0];

//Server
var app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/', function(req, res){
  res.render('index', {values: values})
});

app.post('/', urlencodedParser, function(req, res){
  postedValues = [parseInt(req.body.dice0), parseInt(req.body.dice1), parseInt(req.body.dice2), parseInt(req.body.dice3), parseInt(req.body.dice4)];
  for (var i = 0; i < 5; i++) {
    if (!postedValues[i]) {
      values[i] = randInt(1,6);
    }
    else {
      values[i] = postedValues[i];
    }
  };
  res.json(values);
});

app.listen(3000);
