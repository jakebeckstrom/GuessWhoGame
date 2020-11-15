var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');


var users = 0;
var gameList = [];


const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

router.post('/', function(req, res) {
  let game = gameList[req.body.gameId];

  if (game.setChosen !== "") {

    let images = [];
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: game.setChosen
    };

    s3bucket.listObjects(params, function(err, data) {
      if (err) console.log(err);
      data.Contents.forEach(function(content) {
        images.push(content.Key);
      });
      if (game.one === "" && game.two === "") {
        one = images[Math.floor(Math.random() * 24)];
        two = images[Math.floor(Math.random() * 24)];
        while (one === two) {
          two = images[Math.floor(Math.random() * 24)];
        }
        game.one = one;
        game.two = two;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        images: images,
        one: game.one,
        two: game.two
      }));
    });
  } else {
    res.send(JSON.stringify(
      {"error": "no set chosen"}
    ));
  }
});

router.get('/getSets', function(req, res, next) {
  let sets = [];
  let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    MaxKeys: 20,
    Delimiter: '/'
  };
  
  s3bucket.listObjectsV2(params, function(err, data) {
    if (err) console.log(err);
    data.CommonPrefixes.forEach(function(content) {
      sets.push(content.Prefix.slice(0, -1));
    });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({sets}))
  });
});


router.post('/reset', function(req, res) {
  let game = gameList[req.body.gameId];
  game.setChosen = "";
  game.one = "";
  game.two = "";
  let message = "Successful" + setChosen;
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message }));
})


router.post('/setChoice', function(req, res) {
  let set = req.body.set;
  let game = gameList[req.body.gameId];
  game.setChosen = set;
  game.one = "";
  game.two = "";
  let message = "Successful" + setChosen;
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message }));
})



// Player functions
router.post('/startGame', function(req, res) {
  let game = {
    gameId: users++,
    player1: req.body.name,
    player2: "",
    one: "",
    two:"",
    setChosen: ""
  }
  gameList.push(game);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ gameId: game.gameId }));
});

router.get('/getNames', function(Req,res, next) {
  let players = [];
  gameList.forEach((game) => {
    if (game.player2 == "") {
      players.push(game.player1);
    }
  });
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ players: players }));
});

router.post('/joinGame', function(req, res) {
  let opp = req.body.opponent;
  let i = 0;
  while (i < 50) {
    if (gameList[i].player1 == opp) {
      break;
    }
    i++;
  }
  gameList[i].player2 = req.body.name;
  let id = gameList[i].gameId;
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ 
    res: "success",
    gameId: id
  }));
});

router.post('/gameStatus', function(req, res) {
  let game = gameList[req.body.gameId];
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(game));
});

module.exports = router;
