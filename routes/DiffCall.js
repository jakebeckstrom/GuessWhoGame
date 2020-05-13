var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send("Different api call");
});

module.exports = router;
