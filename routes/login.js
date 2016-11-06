var express = require('express');
var router = express.Router();
var passport = require('passport');
var Model = require('../models');

/* GET home page. */
router.post('/',passport.authenticate('local'), function(req, res, next) {
    res.end("vdgrg");
});

module.exports = router;
