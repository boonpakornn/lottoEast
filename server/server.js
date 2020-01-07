const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

//Allow client to access cross domain or ip-address
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.post('/test', (req,res) => {
    const lottoNum = req.body.lottoNum;

    res.json({ result: 'success', lottoNum : lottoNum})
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))