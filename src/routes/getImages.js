var express = require('express');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var router = express.Router();
var AWS = require('aws-sdk');
var dotenv = require('dotenv').config();



const dirPath = path.join('./', 'public');
var setChosen = "";
const secretKey = 'lilbean2020';
const BUCKET = 'guess-who-static-files';

router.get('/', function(req, res, next) {
  if (setChosen !== "") {

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

      console.log(images);
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
  let s3bucket = new AWS.S3();
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    MaxKeys: 20,
    Delimiter: '/'
  };
  
  s3bucket.listObjectsV2(params, function(err, data) {
    if (err) console.log(err);
    console.log(data);
    data.CommonPrefixes.forEach(function(content) {
      sets.push({ key: content.Prefix.slice(0, -1),
              text: content.Prefix.slice(0, -1),
             value: content.Prefix.slice(0, -1)});
    });

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({sets}))
  });
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
var storage = multer.memoryStorage();

const upload = multer({
  storage
})

router.post('/uploadSet', upload.array("image", 24), (req, res) => {
  let name = req.body.setName;
  let files = req.files;

    let s3bucket = new AWS.S3();
    for (var i = 0; i < files.length; i++) {
    var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: path.join(name ,files[i].originalname),
        Body: files[i].buffer,
        ContentType: files[i].mimetype,
        ACL: "public-read"
      };
      console.log("params");
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
  let s3bucket = new AWS.S3();
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: name
  };

  s3bucket.listObjects(params, function(err, data) {
    if (err) console.log(err);

    // if (data.Contents.length == 0) callback();
    console.log(data);
    params = {Bucket: process.env.AWS_BUCKET_NAME};
    params.Delete = {Objects:[]};
    
    data.Contents.forEach(function(content) {
      console.log(content);
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
