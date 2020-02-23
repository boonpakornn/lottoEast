const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const http = require('http')
const UserModel = require('./user_schema');
const LottoModel = require('./lotto_schema');
const TimeModel = require('./time_schema');
const _ = require('lodash');


require('./db');

app.use(bodyParser.json());

// app.use(express.static('./dist/lottoEast'));

// app.get('/*', (req, res) => {  
//     res.sendFile(path.join(__dirname, './dist/lottoEast'));
//   });

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
    var sender = req.body.currentUser
    var book = ''
    var count = ''
    var group = ''
    if(req.body.lottoNum.length === 8){
    book = req.body.lottoNum.substring(0,4);
    count = req.body.lottoNum.substring(4,6);
    group = req.body.lottoNum.substring(6,8);
    }
    else if(req.body.lottoNum.length === 16){
    book = req.body.lottoNum.substring(6,10);
    count = req.body.lottoNum.substring(2,4);
    group = req.body.lottoNum.substring(4,6);
    }
    LottoModel.create({bookNumber: book, countNumber: count, groupNumber: group, sender: sender, status: 'False'}, (err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', bookNumber : book, countNumber: count, groupNumber: group, sender: sender})
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
    var book = ''
    var count = ''
    var group = ''
    if(req.body.lottoNum.length === 8){
        book = req.body.lottoNum.substring(0,4);
        count = req.body.lottoNum.substring(4,6);
        group = req.body.lottoNum.substring(6,8);
    }
    else if(req.body.lottoNum.length === 16){
        book = req.body.lottoNum.substring(6,10);
        count = req.body.lottoNum.substring(2,4);
        group = req.body.lottoNum.substring(4,6);
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
    var telNo = req.body.telNo;
    var userName = req.body.userName;
 
    UserModel.updateOne({userName: userName}, {firstName: firstName, lastName: lastName, telNo: telNo},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/change-password', (req,res) => {
    var userName = req.body.userName;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    UserModel.find({userName: userName},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        if (doc[0].password === oldPassword) {
            UserModel.updateOne({userName: userName}, {password: newPassword},(err, doc) => {
                if (err){
                    res.json({result: 'failed'});
                }
                res.json({result: 'success', status: 'True'})
            })
        }
        else {
            res.json({result: 'success', status: 'False'})
        }
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

// const server = http.createServer(app);
// server.listen(port, () => console.log('app listening on port', port))
 
app.listen(port, () => console.log('app listening on port', port))