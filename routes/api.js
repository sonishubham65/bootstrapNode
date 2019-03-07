var express = require('express');
var router = express.Router();

var info = require("../controllers/api/info");
router.get('/info',function(req,res,next){
    info.get(req,res,next);
});
module.exports = router;

