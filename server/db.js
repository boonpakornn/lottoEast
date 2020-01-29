var mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/lottoEast', { useNewUrlParser: true});

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