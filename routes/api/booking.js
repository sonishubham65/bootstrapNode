var express = require('express');
var router = express.Router();

var auth = require("../../controllers/account/auth");
router.use(function(req,res,next){
    auth.index(req,res,next)
});
module.exports = router;

