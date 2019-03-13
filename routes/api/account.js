var express = require('express');
var router = express.Router();



var register = require("../../controllers/account/register");
router.post('/register', function(req, res, next) {
    register.index(req,res,next);
});

var login = require("../../controllers/account/login");
router.post('/login', function(req, res, next) {
    login.index(req,res,next);
});

var auth = require("../../controllers/account/auth");

router.use(function(req,res,next){
    auth.index(req,res,next)
});

var account = require("../../controllers/account/account");
router.post('/logout',function(req,res,next){
    account.logout(req,res,next);
});
//router.group
router.post('/profile',function(req,res,next){
    console.log(11,'--->');
    account.index(req,res,next);
});
router.post('/profile/edit',function(req,res,next){
    account.edit.index(req,res,next);
});
router.post('/profile/pic/edit',function(req,res,next){
    account.profile_pic(req,res,next);
});
router.post('/password/edit',function(req,res,next){
    account.password(req,res,next);
});


router.post('/update/phone',function(req,res,next){
    account.phone(req,res,next);
});
router.post('/update/email',function(req,res,next){
    account.email(req,res,next);
});
module.exports = router;