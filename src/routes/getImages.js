var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();

const dirPath = path.join('./', 'public');
var setChosen = "";


router.get('/', function(req, res, next) {
  if (setChosen !== "") {

    dir = path.join(dirPath, setChosen);
    let images = [];
    
    fs.readdir(dir, function (err, files) {
      if (err) {
        console.log(err);
      }

      files.forEach(function (file) {
        images.push(file);
      })
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ images }));
    });
  } else {
    res.send(JSON.stringify(
      {"apiResponse": setChosen}
    ));
  }
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
