var mongoose = require('mongoose')
const express = require('express');
const app = express();
var mongoURL = ''

if (app.get('env') === 'development'){
    mongoURL = 'mongodb://127.0.0.1/lottoEast';
}
else {
    mongoURL = 'mongodb://68.183.184.186/lottoEast';
}

console.log('mongoURL', mongoURL);
mongoose.connect(mongoURL, { useNewUrlParser: true});

mongoose.connection.on('connected', function(){ 
    console.log('mongoose default connection connected');
});

mongoose.connection.on('error', function(err){ 
    console.log('mongoose default connection error' + err);
});

mongoose.connection.on('disconnected', function(){ 
    console.log('mongoose default connection disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function (){
        console.log('mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});