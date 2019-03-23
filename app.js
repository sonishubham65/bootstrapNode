var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
/**
 * require libraries
 */
require('express-router-group');
global._ = require("underscore");
var Joi = require("joi");
global.fs = require('fs')
var ImageExtension = require('joi-image-extension')
global.concat = require('concat-stream')
Joi = Joi.extend(ImageExtension)

Joi.options({ stripUnknown: true });
global.Joi = Joi;
global.Jimp = require('jimp');
global.async = require("async");
global.config = require("./config/config")(path);
global.helper = require("./config/helper");
global.md5 = require('md5');
/**
 * Database connnection established.
 */
global.knex = require('./config/db')(config);

global.moment = require("moment");
global.request = require("request");

global.urlUtil = require('url');
        
require("moment-timezone")
moment.tz.setDefault(config.timezone);


//var firebase = require("firebase/app");
// var details = {
//   apiKey:"AIzaSyBTQFBNuR7U5s3YXlhyIPj_dpzJ9MbDm4Q",
//   authDomain:"dishpal-59f6e.firebaseapp.com/",
//   databaseURL:"https://dishpal-59f6e.firebaseio.com",
//   projectId:"dishpal-59f6e",
//   storageBucket:"dishpal-59f6e.appspot.com",
//   messagingSenderId:"522662062176"
// }
// firebase.initializeApp(details);


// const admin = require('firebase-admin');
// const functions = require('firebase-functions');

// admin.initializeApp(functions.config().firebase);

//var db = admin.firestore();

var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(config.uploadDir));

/**
 * Define routes
 */


app.use(function(req,res,next){
  var contype = req.headers['content-type'];
  if (contype && contype.indexOf('multipart/form-data')!=-1){
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      req.body = fields;
      req.files = JSON.parse(JSON.stringify(files));
      next();
    });
  }else{
    next();
  }
})

var apiRouter = {
  account : require('./routes/api/account'),
  driver : require('./routes/api/driver'),
  vendor : require('./routes/api/vendor'),
};
_.forEach(apiRouter,function(value,key){
  app.use("/api/"+key, value);
})
app.use("/api/", require('./routes/api'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
process
.on('unhandledRejection', (reason, p) => {
  //console.error(reason, 'Unhandled Rejection at Promise', p);
})
.on('uncaughtException', err => {
  //console.error(err, 'Uncaught Exception thrown');
  process.exit(1);
});

var port = config.port[config.env];
app.listen(port,function(){
  console.log("Server is lisening..",port)
}); 

//module.exports = app;
