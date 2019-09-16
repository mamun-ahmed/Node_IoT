
var sys     = require('util');
var net     = require('net');
var mqtt    = require('mqtt');

var io      = require('socket.io').listen(4000);
var client  = mqtt.connect('mqtt://104.251.214.135');

io.sockets.on('connection',function (socket) {
    socket.on('subscribe',function (data) {
        console.log('Subscribing to: '+data.topic);
        client.subscribe(data.topic);
    });

    socket.on('publish',function(data){
        console.log('Publishing: '+data.payload);
        client.publish(data.topic,data.payload);
    });
});

client.on('message',function (topic,payload) {
    console.log(String(topic)+': '+String(payload));
    io.sockets.emit('mqtt',{
        'topic'     : String(topic),
        'payload'   : String(payload)
    });
});