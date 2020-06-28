var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var AWS = require('aws-sdk');
const { runInNewContext } = require('vm');

const dirPath = path.join('./', 'public');
var otherChar = "";
var char = "";
var setChosen = "";
const MAX_USERS = 50;
var players = [];

function addPlayer(player) {
  if (players.length >= 50) {
    return 2;
  }


};

function removePlayer(player) {
  
}

router.post('/', function(req, res) {

  setChosen = req.body.set;

  let images = [];
  let s3bucket = new AWS.S3();
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: setChosen
  };

  s3bucket.listObjects(params, function(err, data) {
    if (err) console.log(err);
    
    data.Contents.forEach(function(content) {
      images.push(content.Key);
    });

    if (otherChar) {
      while ( char === otherChar ) {
        let char = images[Math.floor(Math.random() * 24)];
      }
    } else {
      char = images[Math.floor(Math.random() * 24)];
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ char }));
  });
});

router.get('/getOpponents', function(req, res, next) {

});

router.post('/addName', function(req, res) {

});

router.post('/startGame', function(req, res) {

});


module.exports = router;
