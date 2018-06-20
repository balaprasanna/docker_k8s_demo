const express = require('express')
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api', (req, res) => res.send({api: "v1", version: "1.0.0"}))

app.listen(9000, () => console.log('Example app listening on port 9000!'))
