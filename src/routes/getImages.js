var express = require('express');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var router = express.Router();



const dirPath = path.join('./', 'public');
var setChosen = "";
const secretKey = 'lilbean2020';

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

router.get('/getSets', function(req, res, next) {
  let sets = [];
  fs.readdir(dirPath, {withFileTypes: true}, function(err, dirs) {
    if (err) {
      console.log(err);
    }

    dirs.forEach(function (ent) {
      if (ent.isDirectory() && ent.name !== 'temp') {
        sets.push({
          key: ent.name,
          value: ent.name,
          text: ent.name
        });
      }
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({sets}))
  })

});

router.get('/getChoice', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ setChosen }));
});

router.get('/reset', function(req, res, next) {
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

router.post('/checkKey', function(req, res) {
  let key = req.body.secretKey;
  console.log(req.body);
  if (key === secretKey) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ auth: true }));
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ auth:false }));
  }
})

//Storage functions
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('public', 'temp'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage
})

router.post('/uploadSet', upload.array("image", 24), (req, res) => {
  let name = req.body.setName;
  fs.mkdir(path.join(dirPath, name), (err) => {
    if (err) {
      console.log(err);
    }
  });

  fs.readdir(path.join(dirPath, 'temp'), function (err, files) {
    if (err) {
      console.log(err);
    }

    files.map((file) => {
      fs.rename(path.join(dirPath, 'temp', file), path.join(dirPath, name, file), (err) => {
        console.log(err);
      });
    });
  });

    res.json({
      Resp: "success"
    })
})

module.exports = router;
