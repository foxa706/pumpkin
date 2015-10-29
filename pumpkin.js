var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var port = 8000;
var url='localhost'
var server = app.listen(port);
var io = require("socket.io").listen(server);


var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var piblaster = require('pi-blaster.js');


var port = new SerialPort("/dev/ttyAMA0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
}, false); // this is the openImmediately flag [default is true]


app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at '+url+':'+port);

//open a port for the serial data to index.html-------------------------------------------------
io.sockets.on('connection', function (socket) {
  port.open(function(error) {

    if (error) {
      console.log('failed to open: ' + error);
    //send that data yo!
  } else {
    console.log('Serial open');
    port.on('data', function(data) {

      // console.log(data);
      // console.log('data length: ' + data.length);

      var lightVal = data[5];
      // console.log(lightVal);

      socket.emit('toWeb', lightVal );
      port.write("A");//do we need this?
    });
  }

  });

  socket.on('submit', function (data) {
      console.log(data);
      setLED(data);
    });

});

//---------------------------------------------------------------------------------------------------------


//-------------------------------here begins the functions to map values from web and map into the led---

//pass the data of rgb from the web and write it to the rgb led

function setLED(data){
  //console.log(data.length);

  var rVal = parseInt(data.rval, 10);
  var gVal = parseInt(data.gval, 10);
  var bVal = parseInt(data.bval, 10);

  console.log("rVal: " + rVal);


Number.prototype.mapRGBRange = function () {
  return (this - 0) * (1 - 0) / (255 - 0) + 0;
};

console.log("check color range mapping: " + rVal.mapRGBRange() );

var r = rVal.mapRGBRange();
  piblaster.setPwm(17, r );
  piblaster.setPwm(18, gVal.mapRGBRange() );
  piblaster.setPwm(27, bVal.mapRGBRange() );

}

