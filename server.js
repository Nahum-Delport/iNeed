const express = require('express');
const app = express();
const path = require('path');
const PORT = 4000;
const helmet = require('helmet');
const fs = require('fs')
require('isomorphic-fetch')
var array1 = require('./Favourite.json');

app.use(helmet());

app.get('/api', function (req, res) {
    let term = req.query.search;
    let entity = req.query.type;
    const reqData = async () => {
        const url = `https://itunes.apple.com/search?term=${term}&entity=${entity}&limit=15`;
        const response = await fetch(url)
        const data = await response.json()
        res.send(data.results)
        fs.writeFile('Fullapi.json', JSON.stringify(data.results), (err) => {
            if (err) {
                res.send('did not write')
            } else {
                res.send('file created')
            }
        })
    }
    reqData()
    console.log("working")
})

app.use(express.static(path.join(__dirname, 'app/build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/app/build/index.html'))
})
app.listen(PORT, function() {
    console.log(`Server started on ${PORT}`)
})
