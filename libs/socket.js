const io = require('socket.io-client');

const i0 = io('http://localhost:3000');

i0.on('notification', (data) => {
    console.log(data);
});

module.exports = i0;