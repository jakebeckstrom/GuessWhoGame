var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var AWS = require('aws-sdk');

const dirPath = path.join('./', 'public');
var otherChar = "";
var char = "";
var setChosen = "";



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


module.exports = router;
