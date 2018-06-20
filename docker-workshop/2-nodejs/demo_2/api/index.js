const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api', (req, res) => res.send({api: "v1", version: "1.0.1"}))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
