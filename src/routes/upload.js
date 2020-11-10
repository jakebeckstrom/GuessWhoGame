var express = require('express');
var path = require('path');
var multer = require('multer');
var router = express.Router();
var AWS = require('aws-sdk');
var dotenv = require('dotenv').config();



const dirPath = path.join('./', 'public');
const secretKey = 'lilbean2020';
const BUCKET = 'guess-who-static-files';

const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

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

//Storage functions
var storage = multer.memoryStorage();

const upload = multer({
  storage
})

router.post('/', upload.array("image", 24), (req, res) => {
  let name = req.body.setName;
  let files = req.files;

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
      resp: "success"
    })
})



router.post('/removeSet', (req, res) => {
  let name = req.body.rname;

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
          resp: "success"
        });
      }
    });
  });
})

module.exports = router;