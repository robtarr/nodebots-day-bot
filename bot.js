var five = require('johnny-five');
var Particle = require('particle-io');

console.log('Connecting to bot...');
var board = new five.Board({
  io: new Particle({
    token: '7a2d9667fc6b5d5f91604c9db0b6fcb1513829c2',
    deviceName: 'device-name'  // replace this with the last 5 digits of the serial #
  })
});

board.on('ready', function() {
  console.log('\r\nYour bot is ready\r\n');
  console.log('Controls:');
  console.log('     ⬆');
  console.log('   ⬅ ⬇ ➡');
  console.log('space - stop');
  console.log('q - quit\r\n');

  var rightWheelSpeedPin = 'D0'; // A-IB
  var rightWheelDirPin = 'D1';   // A-IA
  var leftWheelSpeedPin = 'D2';  // B-IB
  var leftWheelDirPin = 'D3';    // B-IA

  var rightWheel = new five.Motor({
    pins: { pwm: rightWheelSpeedPin, dir: rightWheelDirPin },
    invertPWM: true
  });

  var leftWheel = new five.Motor({
    pins: { pwm: leftWheelSpeedPin, dir: leftWheelDirPin },
    invertPWM: true
  });

  var speed = 255;

  function reverse() {
    leftWheel.rev(speed);
    rightWheel.rev(speed);
  }

  function forward() {
    leftWheel.fwd(speed);
    rightWheel.fwd(speed);
  }

  function stop() {
    leftWheel.stop();
    rightWheel.stop();
  }

  function left() {
    leftWheel.rev(speed);
    rightWheel.fwd(speed);
  }

  function right() {
    leftWheel.fwd(speed);
    rightWheel.rev(speed);
  }

  function exit() {
    leftWheel.stop();
    rightWheel.stop();

    // 1s delay to make sure the motors stop before the program exits
    setTimeout(process.exit, 1000);
  }

  var keyMap = {
    up: forward,
    down: reverse,
    left: left,
    right: right,
    space: stop,
    q: exit
  };

  var stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();

  stdin.on('keypress', function(chunk, key) {
    if (!key || !keyMap[key.name]) return;

    keyMap[key.name]();
  });
});