var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

const dirPath = path.join('./', 'public');
var otherChar = "";
var char = "";
var setChosen = "";



router.post('/', function(req, res) {

  setChosen = req.body.set;

  dir = path.join(dirPath, setChosen);
  let images = [];

  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log(err);
    }

    files.forEach(function (file) {
      images.push(file);
    })
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
