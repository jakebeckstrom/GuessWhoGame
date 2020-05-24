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

/* ====================== Soon to be deprecated =================== */

router.get('/Office', function(req, res, next) {

  dir = path.join(dirPath, 'OfficeCharSet');
  let images = [];

  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log(err);
    }

    files.forEach(function (file) {
      images.push(file);
    })
    if (otherChar) {
      console.log("Other Character");
      console.log(otherChar);
      while ( char === otherChar ) {
        let char = images[Math.floor(Math.random() * 24)];
        console.log("Random character");
        console.log(char);
      }
    } else {
      char = images[Math.floor(Math.random() * 24)];
      console.log("Random character");
      console.log(char);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ char }));
  });
});

router.get('/Brooklyn', function(req, res, next) {

  dir = path.join(dirPath, 'BrooklynCharSet');
  let images = [];

  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log(err);
    }

    files.forEach(function (file) {
      console.log(file);
      images.push(file);
    })
    if (otherChar) {
      console.log("Other Character");
      console.log(otherChar);
      while ( char === otherChar ) {
        let char = images[Math.floor(Math.random() * 24)];
        console.log("Random character");
        console.log(char);
      }
    } else {
      char = images[Math.floor(Math.random() * 24)];
      console.log("Random character");
      console.log(char);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ char }));
  });
});

router.get('/WalkingDead', function(req, res, next) {

  dir = path.join(dirPath, 'WalkingDeadCharSet');
  let images = [];

  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log(err);
    }

    files.forEach(function (file) {
      console.log(file);
      images.push(file);
    })
    if (otherChar) {
      console.log("Other Character");
      console.log(otherChar);
      while ( char === otherChar ) {
        let char = images[Math.floor(Math.random() * 24)];
        console.log("Random character");
        console.log(char);
      }
    } else {
      char = images[Math.floor(Math.random() * 24)];
      console.log("Random character");
      console.log(char);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ char }));
  });
});

module.exports = router;
