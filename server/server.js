const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const UserModel = require('./user_schema');
const LottoModel = require('./lotto_schema');

require('./db');

app.use(bodyParser.json());

//Allow client to access cross domain or ip-address
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.post('/lotto', (req,res) => {
    if(req.body.lottoNum.length === 8){
    var book = req.body.lottoNum.substring(0,4);
    var count = req.body.lottoNum.substring(4,6);
    var group = req.body.lottoNum.substring(6,8);
    var sender = 'user1'
    }
    
    LottoModel.create({bookNumber: book, countNumber: count, groupNumber: group, sender: sender}, (err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', number : book, count: count, group: group, sender: sender})
    })
});

app.get('/get-lotto', (req,res) => {
    
    LottoModel.find((err, doc) => {
        if (err){
            res.json({result: 'failed'});
        }
        res.json({result: 'success', data: doc})
    })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))