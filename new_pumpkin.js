var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var port = 8000;
var url='localhost';
var server = app.listen(port);
var io = require("socket.io").listen(server);


var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var GPIO = require('onoff').Gpio,
    led = new GPIO(17, 'out');


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


//sets to on of off for the light-

function setLED(data){
  //console.log(data.length);

  var light = parseInt(data.light, 10);
  console.log("switch is reading: " + light);

  if (light == 1 ){
   led.writeSync(1); //turn on LED
}else{
    led.writeSync(0); //turn off LED
}

}

