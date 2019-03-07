var express = require('express');
var router = express.Router();

/* Include events. */

var events = require('events');
var eventEmitter = new events.EventEmitter();

/* Emitter observer. */
eventEmitter.on('observer', function(args){
  console.log("observer Event fired",args)
});


router.get('/', function(req, res, next) {
  /* Emitter call. */
  eventEmitter.emit('observer',{u:1});
  res.status(200).json({"status":"success"})
});


module.exports = router;

