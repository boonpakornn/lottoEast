const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const http = require('http')
const UserModel = require('./user_schema');
const LottoModel = require('./lotto_schema');
const TimeModel = require('./time_schema');


require('./db');

app.use(bodyParser.json());

app.use(express.static('./dist/lottoEast'));

// app.get('*', (req,res) => res.sendFile(path.join(__dirname, '../client/dist/lottoEast')));
app.get('/*', (req, res) => {  
    res.sendFile(path.join(__dirname, './dist/lottoEast'));
  });

//Allow client to access cross domain or ip-address
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
    next();
})

// ==========  Lotto  ==========
app.post('/add-lotto', (req,res) => {
    if(req.body.lottoNum.length === 8){
    var book = req.body.lottoNum.substring(0,4);
    var count = req.body.lottoNum.substring(4,6);
    var group = req.body.lottoNum.substring(6,8);
    var sender = req.body.currentUser
    }

    if(req.body.lottoNum.length === 20){
        var book = req.body.lottoNum.substring(6,10);
        var count = req.body.lottoNum.substring(2,4);
        var group = req.body.lottoNum.substring(4,6);
        var sender = req.body.currentUser
    }
    LottoModel.create({bookNumber: book, countNumber: count, groupNumber: group, sender: sender, status: 'False'}, (err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', number : book, count: count, group: group, sender: sender})
    })
});

app.post('/get-lotto', (req,res) => {
    LottoModel.find({sender: req.body.currentUser},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/find-duplicate-lotto', (req,res) => {
    if(req.body.lottoNum.length === 8){
        var book = req.body.lottoNum.substring(0,4);
        var count = req.body.lottoNum.substring(4,6);
        var group = req.body.lottoNum.substring(6,8);
    }
    
    if(req.body.lottoNum.length === 20){
        var book = req.body.lottoNum.substring(6,10);
        var count = req.body.lottoNum.substring(2,4);
        var group = req.body.lottoNum.substring(4,6);
    }

    LottoModel.find({bookNumber: book, countNumber: count, groupNumber: group},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.get('/get-all-lotto', (req,res) => {
    LottoModel.find((err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/get-result-lotto', (req,res) => {
    var currentUser = req.body.currentUser;
    var status = req.body.status;
    LottoModel.find({sender: currentUser, status: status} ,(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/update-lotto', (req,res) => {
    var book = req.body.bookNumber;
    var count = req.body.countNumber;
    var group = req.body.groupNumber;
    var sender = req.body.sender;
    var status = req.body.status
    if(status === 'False'){
        var newstatus = 'True'
    }
    else if(status === 'True'){
        var newstatus = 'False'
    }
    LottoModel.updateOne({bookNumber: book, countNumber: count, groupNumber: group, sender: sender, status: status}, {status: newstatus},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/delete-lotto', (req,res) => {
    var book = req.body.bookNumber;
    var count = req.body.countNumber;
    var group = req.body.groupNumber;
    LottoModel.deleteOne({bookNumber: book, countNumber: count, groupNumber: group}, (err)=> {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success'})
    })
})

app.post('/deleteall-lotto', (req,res) => {
    LottoModel.deleteMany({}, (err)=> {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success'})
    })
})


// ==========  User  ==========

app.post('/add-user', (req,res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var telNo = req.body.telNo;
    var remark = req.body.remark;
    
    UserModel.create({userName: userName, password: password, firstName: firstName, lastName: lastName, telNo: telNo, remark: remark}, (err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', userName: userName, password: password, firstName: firstName, lastName: lastName, telNo: telNo, remark: remark})
    })
});

app.get('/add-admin', (req,res) => {
    var userName = 'admin';
    var password = 'lottoeast';
    var firstName = 'Administrator';
    var lastName = 'lottoEast';
    var telNo = '';
    var remark = '';
    
    UserModel.create({userName: userName, password: password, firstName: firstName, lastName: lastName, telNo: telNo, remark: remark}, (err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', userName: userName, password: password, firstName: firstName, lastName: lastName, telNo: telNo, remark: remark})
    })
});

app.post('/update-user', (req,res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var userName = req.body.userName;
 
    UserModel.updateOne({userName: userName}, {firstName: firstName, lastName: lastName},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/get-user', (req,res) => {
    UserModel.find({userName: req.body.userName, password: req.body.password},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

// ==========  Time  ==========

app.get('/init-time', (req,res) => {
    TimeModel.create({startHour: 8, startMinute: 0, endHour: 18, endMinute: 0},(err) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success init time'})
    })
});

app.get('/get-time', (req,res) => {
    TimeModel.find((err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/update-time', (req,res) => {
    TimeModel.updateMany(req.body, (err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
})
const server = http.createServer(app);
server.listen(port, () => console.log('app listening on port', port))