var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var port = 8000;
var url='localhost'
var server = app.listen(port);
var io = require("socket.io").listen(server);


var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var GPIO = require('onoff').Gpio;
var port = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
}, false); // this is the openImmediately flag [default is true]


app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at '+url+':'+port);


io.sockets.on('connection', function (socket) {
port.open(function(error) {
  if (error) {
    console.log('failed to open: ' + error);
  } else {
    console.log('Serial open');
    }
});

});




