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

      console.log(data);
      console.log('data length: ' + data.length);

      var lightVal = data[5];
      console.log(lightVal);

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
  console.log(data.length);
  var r1 = data[0];
  var r2 = data[1];
  var r3 = data[2];

  var rData = r1 + r2 + r3;
  var rVal = parseInt(rData, 10);

  var g1 = data[4];
  var g2 = data[5];
  var g3 = data[6];

  var gData = g1 + g2 + g3;
  var gVal = parseInt(gData, 10);

  var b1 = data[7];
  var b2 = data[8];
  var b3 = data[9];

  var bData = b1 + b2 + b3;
  var bVal = parseInt(bData, 10);


Number.prototype.mapRGBRange = function () {
  return (this - 0) * (1 - 0) / (255 - 0) + 0;
};

console.log("check color range mapping: " + rVal.mapRGBRange() );

  piblaster.setPwm(17, rVal.mapRGBRange );
  piblaster.setPwm(18, gVal.mapRGBRange );
  piblaster.setPwm(27, bVal.mapRGBRange );

}

