var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

const dirPath = path.join('dist/', 'public');
var setChosen = false;


router.get('/', function(req, res, next) {
  var response = contents;
  res.send(JSON.stringify(
    {"cwd": response}
  ));
});

router.get('/Brooklyn', function(req, res, next) {

  dir = path.join(dirPath, 'BrooklynCharSet');
  let images = [];
  
  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log(err);
    }

    files.forEach(function (file) {
      // console.log(file);
      images.push(file);
    })
    // console.log(images);
    setChosen = "Brooklyn";
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ images }));
      // res.json(images);
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
      // console.log(file);
      images.push(file);
    })
    // console.log(images);
    setChosen = "WalkingDead";
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ images }));
      // res.json(images);
  });
});

router.get('/Office', function(req, res, next) {

  dir = path.join(dirPath, 'OfficeCharSet');
  let images = [];

  fs.readdir(dir, function (err, files) {
    if (err) {
      console.log(err);
    }

    files.forEach(function (file) {
      // console.log(file);
      images.push(file);
    })
    // console.log(images);
    setChosen = "Office";
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ images }));
      // res.json(images);
  });
});


router.get('/getChoice', function(req, res, next) {
  // console.log("Send choice");
  // console.log(setChosen);
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ setChosen }));
});

router.get('/reset', function(req, res, next) {
  // console.log("reset");
  setChosen = "";
  let message = "Successful" + setChosen;
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message }));
})

router.post('/setChoice', function(req, res) {
  console.log("Make choice");
  console.log(req.body);
  setChosen = req.body.set;
  let message = "Successful" + setChosen;
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message }));
})

module.exports = router;
