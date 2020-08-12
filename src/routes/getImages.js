var express = require('express');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var router = express.Router();
var AWS = require('aws-sdk');
var dotenv = require('dotenv').config();



const dirPath = path.join('./', 'public');
// var setChosen = "";
const secretKey = 'lilbean2020';
const BUCKET = 'guess-who-static-files';
const MAX_USERS = 50;
var players = [];
var numPlayers = 0;
var fill = 0;
for (fill = 0; fill < 50; fill++) {
  players[fill] = ''
}


router.post('/', function(req, res) {
  var setChosen = players[req.body.id].setChosen

  if (setChosen !== "") {

    let images = [];
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: setChosen
    };

    s3bucket.listObjects(params, function(err, data) {
      if (err) console.log(err);
      
      data.Contents.forEach(function(content) {
        images.push(content.Key);
      });

      let one = images[Math.floor(Math.random() * 24)];
      let two = images[Math.floor(Math.random() * 24)];
      while (one === two) {
        two = images[Math.floor(Math.random() * 24)];
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        images, 
        one,
        two
      }));
    });
  } else {
    res.send(JSON.stringify(
      {"apiResponse": setChosen}
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
      sets.push({ key: content.Prefix.slice(0, -1),
              text: content.Prefix.slice(0, -1),
             value: content.Prefix.slice(0, -1)});
    });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({sets}))
  });
});

router.post('/getChoice', function(req, res) {
  let id = req.body.id;
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ setChosen: players[id].setChosen }));
});

router.post('/reset', function(req, res) {
  let id = req.body.id;
  players[id].setChosen = '';
  let message = "Successful" + setChosen;
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message }));
})

router.post('/setChoice', function(req, res) {
  let id = req.body.id;
  players[id].setChosen = req.body.set;
  let message = "Successful" + players[id].setChosen;
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ message }));
})

router.post('/checkKey', function(req, res) {
  let key = req.body.secretKey;
  if (key === secretKey) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ auth: true }));
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ auth:false }));
  }
})



router.get('/getOpponents', function(req, res, next) {
  let opps = [];
  var i = 0;
  for (i; i < numPlayers; i++) {
    if (players[i] != '') {
      opps.push(players[i].one);
    }
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ opponents: opps }));
});

router.post('/addName', function(req, res) {
  let player = req.body.player;
  let inSet = [];
  var n = 0;
  for (n; n < players.length; n++) {
    if (players[n] != '') {
      inSet.push(players[n].one);
    } 
  }
  res.setHeader('Content-Type', 'application/json');
  if (numPlayers >= 50) {
    res.end(JSON.stringify({ success: false }));
  } else if (inSet.includes(player)) {
    res.end(JSON.stringify({ success: false }));
  } else {
    var i = 0;
    while (players[i] != '' && i < 50) {
      i++;
    }
    numPlayers++;
    players[i] = {one: player, two: '', setChosen: '', handshakeone: 0, handshaketwo: 0};
    res.end(JSON.stringify({ success: true, id: i }));
  }
});



router.post('/joinGame', function(req, res) {
  let player = req.body.player;
  let opp = req.body.opponent;
  var i = 0;
  while (players[i].one != opp) {
    i++;
  }
  if (players[i].one === opp) {
    players[i].two = player;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ success: true, id: i }));
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ success: false }));
  }
});

router.post('/checkGame', function(req, res) {
  let player = req.body.player;
  let id = req.body.id;
  res.setHeader('Content-Type', 'application/json');
  if (players[id] === '') {
    res.end(JSON.stringify({ end: true }));
  } else {
    if (player === players[id].one) {
      if (players[id].handshakeone < players[id].handshaketwo) {
        players[id].handshakeone = players[id].handshaketwo;
      } else {
        players[id].handshakeone++;
      }
    } else {
      if (players[id].handshaketwo < players[id].handshakeone) {
        players[id].handshaketwo = players[id].handshakeone;
      } else {
        players[id].handshaketwo++;
      }
    }
    let dif = players[id].handshaketwo - players[id].handshakeone;
    if (dif > 10 || dif < -10 || players[id].handshakeone > 10000) {
      players[id] = '';
      res.end(JSON.stringify({ end: true }));
    } else {
      res.end(JSON.stringify({ end: false }));
    }
  }
})

router.post('/gameJoined', function(req, res) {
  let player = req.body.player;
  var i = 0;
  while (players[i].one != player) {
    i++;
  }
  let send = players[i].two;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ opponent: send, id: i }));
})



//Storage functions
var storage = multer.memoryStorage();

const upload = multer({
  storage
})

router.post('/uploadSet', upload.array("image", 24), (req, res) => {
  let name = req.body.setName;
  let files = req.files;

    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    for (var i = 0; i < files.length; i++) {
    var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: path.join(name ,files[i].originalname),
        Body: files[i].buffer,
        ContentType: files[i].mimetype,
        ACL: "public-read"
      };
      s3bucket.upload(params, function(err, data) {
        if (err) {
          res.status(500).json({ error: true, Message: err });
        } 
      });
    }

    res.json({
      Resp: "success"
    })
})



router.post('/removeSet', (req, res) => {
  let name = req.body.rname;
  let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: name
  };

  s3bucket.listObjects(params, function(err, data) {
    if (err) console.log(err);

    // if (data.Contents.length == 0) callback();
    params = {Bucket: process.env.AWS_BUCKET_NAME};
    params.Delete = {Objects:[]};
    
    data.Contents.forEach(function(content) {
      params.Delete.Objects.push({Key: content.Key});
    });

    s3bucket.deleteObjects(params, function(err, data) {
      if (err) {
        res.json({
          Resp: err // an error occurred
        });
      } else{
        res.json({
          Resp: "success"
        });
      }
    });
  });
})

module.exports = router;
