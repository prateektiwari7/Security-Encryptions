const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rsaWrapper = require('./components/rsa-wrapper');
// middleware for static processing

rsaWrapper.initLoadServerKeys(__dirname);
rsaWrapper.serverExampleEncrypt();

app.use(express.static(__dirname + '/static'));



// web socket connection event
io.on('connection', function(socket){
 
let encrypted = rsaWrapper.encrypt(rsaWrapper.clientPub, 'Hello RSA message from client to server');
socket.emit('rsa server encrypted message', encrypted);

// Test accepting dummy RSA message from client
socket.on('rsa client encrypted message', function (data) {
console.log('Server received RSA message from client');
console.log('Encrypted message is', '\n', data);
console.log('Decrypted message', '\n', rsaWrapper.decrypt(rsaWrapper.serverPrivate, data));
});
});
http.listen(3000, function(){
 console.log('listening on *:3000');
});


