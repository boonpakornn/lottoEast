const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const app = express();
const http = require('http')
const UserModel = require('./user_schema');
const LottoModel = require('./lotto_schema');
const TimeModel = require('./time_schema');
const _ = require('lodash');

require('./db');

app.use(bodyParser.json());

app.use(express.static('../client/dist/lottoEast'));

app.get('/*', (req, res) => {  
    res.sendFile(path.join(__dirname, '../client/dist/lottoEast'));
  });

//Allow client to access cross domain or ip-address
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Content-Security-Policy", "script-src 'self' https://apis.google.com");
    next();
})

// ==========  Lotto  ==========
app.post('/add-lotto', (req,res) => {
    var sender = req.body.currentUser
    var book
    var count
    var group
    var set
    if(req.body.lottoNum.length === 8){
        book = parseInt(req.body.lottoNum.substring(0,4));
        count = parseInt(req.body.lottoNum.substring(4,6));
        group = parseInt(req.body.lottoNum.substring(6,8));
        set = Math.ceil(group / 5);
    }
    else if(req.body.lottoNum.length === 16){
        book = parseInt(req.body.lottoNum.substring(6,10));
        count = parseInt(req.body.lottoNum.substring(2,4));
        group = parseInt(req.body.lottoNum.substring(4,6));
        set = Math.ceil(group / 5);
    }
    LottoModel.create({bookNumber: book, countNumber: count, groupNumber: group, group: set, sender: sender, status: 'False'}, (err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', bookNumber : book, countNumber: count, groupNumber: group, sender: sender})
    })
});

app.get('/get-all-lotto', (req,res) => {
    LottoModel.find({},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/get-user-lotto-paginate', (req,res) => {
    var offset = req.body.offset;
    var pageSize = req.body.pageSize;
    var sender = req.body.loggedinUser;
    
    LottoModel.paginate({sender: sender}, {offset: offset, limit: pageSize, sort: {bookNumber: 1, countNumber: 1, groupNumber: 1}}, function(err, doc) {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc.docs})
    })
});

app.post('/get-user-count', (req,res) => {
    var sender = req.body.loggedinUser;
    LottoModel.countDocuments({sender: sender}, (err, count) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: count})
    })
});

app.post('/find-duplicate-lotto', (req,res) => {
    var book
    var count
    var group
    if(req.body.lottoNum.length === 8){
        book = parseInt(req.body.lottoNum.substring(0,4));
        count = parseInt(req.body.lottoNum.substring(4,6));
        group = parseInt(req.body.lottoNum.substring(6,8));
    }
    else if(req.body.lottoNum.length === 16){
        book = parseInt(req.body.lottoNum.substring(6,10));
        count = parseInt(req.body.lottoNum.substring(2,4));
        group = parseInt(req.body.lottoNum.substring(4,6));
    }

    LottoModel.find({bookNumber: book, countNumber: count, groupNumber: group},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/get-all-lotto-paginate', (req,res) => {
    var offset = req.body.offset;
    var pageSize = req.body.pageSize;
    LottoModel.paginate({}, { offset: offset, limit: pageSize, sort: {bookNumber: 1, countNumber: 1, groupNumber: 1}}, function(err, doc) {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc.docs})
    })
});

app.get('/get-count', (req,res) => {
    LottoModel.countDocuments({}, (err, count) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: count})
    })
});

app.post('/get-user-lotto', (req,res) => {
    var userName = req.body.userName;
    LottoModel.find({sender: userName, status: 'True'} ,(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: _.orderBy(doc, ['bookNumber', 'countNumber', 'groupNumber'], ['asc', 'asc', 'asc'])})
    })
});

app.post('/get-user-selected-lotto', (req,res) => {
    var selectedUser = req.body.selectedUser;
    LottoModel.find({sender: selectedUser, status: 'True'}, function(err, doc) {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: _.orderBy(doc, ['bookNumber', 'countNumber', 'groupNumber'], ['asc', 'asc', 'asc'])})
    })
});

app.post('/get-user-selected-lotto-paginate', (req,res) => {
    var offset = req.body.offsetUser;
    var pageSize = req.body.pageSizeUser;
    var selectedUser = req.body.selectedUser;
    LottoModel.paginate({sender: selectedUser, status: 'True'}, {offset: offset, limit: pageSize, sort: {bookNumber: 1, countNumber: 1, groupNumber: 1}}, function(err, doc) {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc.docs})
    })
});

app.post('/get-user-selected-count', (req,res) => {
    var sender = req.body.selectedUser;
    LottoModel.countDocuments({sender: sender, status: 'True'}, (err, count) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: count})
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

app.post('/update-set-lotto', (req,res) => {
    var book = req.body.bookNumber;
    var count = req.body.countNumber;
    var group = req.body.group;
    LottoModel.updateMany({bookNumber: book, countNumber: count, group: group}, {status: 'True'},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.post('/update-lotto-all-false', (req,res) => {
    LottoModel.updateMany({ status: 'True'}, {status: 'False'},(err, doc) => {
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

app.get('/get-all-book-number', (req,res) => {
    LottoModel.find({}, 'bookNumber').distinct('bookNumber',(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});


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

app.post('/find-duplicate-user', (req,res) => {
    var userName = req.body.userName;
    UserModel.find({userName: userName},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
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
    UserModel.find({userName: req.body.userName, password: req.body.password}, 'userName',(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.get('/get-all-user', (req,res) => {
    UserModel.find({}, 'userName firstName lastName telNo remark',(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.get('/get-user-count', (req,res) => {
    UserModel.countDocuments({}, (err, count) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: count})
    })
});


app.post('/get-all-user-paginate', (req,res) => {
    var offset = req.body.offset;
    var pageSize = req.body.pageSize;
    UserModel.paginate({},{ offset: offset, limit: pageSize, select: {userName: 1,firstName: 1,lastName: 1,telNo: 1,remark: 1}},(err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc.docs})
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


// cd lottoEast/server
// node server.js

const server = http.createServer(app);
server.listen(port, () => console.log('server listening on port', port))
 