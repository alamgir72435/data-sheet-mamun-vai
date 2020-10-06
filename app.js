const express = require('express');
const mongoose= require('mongoose')
const moment = require('moment')
const cors   = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 5000;
const app = express()
var exphbs  = require('express-handlebars');
const path = require('path')
// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(fileUpload())
app.engine('.hbs', exphbs({extname:'.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/list', (req, res) => {
    res.render('list')
})

app.listen(port, console.log(`server running on http://localhost:${port}`))