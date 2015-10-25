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
    rled = new GPIO(17, 'out');
    gled = new GPIO(18, 'out');
    bled = new GPIO(27, 'out');

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
    console.log('data length: ' + data.length);
    var lightVal = data[5];
    console.log(lightVal);
    // result = data.split(',')
    // result[3]

    socket.emit('toWeb', lightVal );
    port.write("A");//do we need this?
    });
  }
});
});
//---------------------------------------------------------------------------------------------------------

//pass the data of rgb from the web and write it to the rgb led
function ledOff(){
    rled.writeSync(0);
    gled.writeSync(0);
    bled.writeSync(0);
}

function ColorLed(){
    rled.writeSync(rval);
    gled.writeSync(gval);
    bled.writeSync(bval);

}

//will need to use submit
// function spookyLight(){
// }

// socket.on('submit', function (data) {
//       console.log(data);
//   });

    // socket.on('toScreen', function (data) {
    //     console.log(data[5]);
    //     light(data[5]);
    // });





