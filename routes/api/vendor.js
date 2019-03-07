var express = require('express');
var router = express.Router();

var auth = require("../../controllers/account/auth");
router.use(function(req,res,next){
    auth.index(req,res,next)
});

var account = require("../../controllers/account/account");
router.post('/edit',function(req,res,next){
    account.edit.vendor(req,res,next);
});

var driver = require("../../controllers/api/driver");

router.group("/driver",function(router){
    router.post('/list',function(req,res,next){
        driver.index(req,res,next);
    });
    router.post('/get',function(req,res,next){
        driver.get(req,res,next);
    });
    router.post('/add',function(req,res,next){
        driver.add(req,res,next);
    });
    router.post('/edit',function(req,res,next){
        driver.edit(req,res,next);
    });
    router.post('/delete',function(req,res,next){
        driver.delete(req,res,next);
    });
        
});



module.exports = router;

