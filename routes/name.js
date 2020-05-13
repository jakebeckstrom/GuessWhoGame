var express = require('express');
var router = express.Router();

var names = [];

router.get('/', function(req, res, next) {

});

router.post('/getOpponent', function(req, res) {
  console.log(req.body);
  let myName = req.body.myName
  let retNames = [];
  names.forEach(function(name) {
    if (name !== myName) {
      retNames.push(name);
    }
  });
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ retNames }));
});


router.post('/setName', function(req, res) {
  console.log(req.body);
  let reqName = req.body.name;
  let match = names.find(function(name) {
    return (name === reqName);
  });
  if (match) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: "Name already in list" }));
  } else {
    names.push(reqName);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: "Success" }));
  }
 });
module.exports = router;
