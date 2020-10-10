const express = require('express');
const mongoose= require('mongoose')
const moment = require('moment')
const cors   = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const port = process.env.PORT || 5000;
const app = express()
var exphbs  = require('express-handlebars');
const path = require('path')
// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('.hbs', exphbs({extname:'.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')))


var storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename:(req, file, cb)=> {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({storage:storage})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/data', (req, res) => {
    res.render('data')
})

app.post('/upload', upload.fields(
    [
        { name: 'signature_card', maxCount: 1 },
        { name: 'photo_id', maxCount: 8 },
        { name: 'acc_holder_id', maxCount: 1 },
        { name: 'nomeny_holder_id', maxCount: 1 }
    ]
), (req, res) => {
   let file =  req.files

   if(req.body.name==""){
    return res.render('home', {
        msg:'Account Holder name must not be empty !',
        accountNo:req.body.accountNo,
        mobile:req.body.mobile
    })
   }else if(req.body.accountNo == undefined){
        return res.render('home', {
            msg:'Account No must not be empty !',
            name:req.body.name,
            mobile:req.body.mobile
        })
    }else if(req.body.mobile == undefined){
        return res.render('home', {
            msg:'Phone Number must not be empty !',
            name:req.body.name,
            accountNo:req.body.accountNo
        })
    }else if(file.signature_card == undefined){
        return res.render('home', {
            msg:'signature card must not be empty !',
            name:req.body.name,
            accountNo:req.body.accountNo,
            mobile:req.body.mobile
        })
    }else if(file.photo_id == undefined){
        return res.render('home', {
            msg:'Photo ID must not be empty !',
            name:req.body.name,
            accountNo:req.body.accountNo,
            mobile:req.body.mobile
        })
    }else if(file.acc_holder_id == undefined){
        return res.render('home', {
            msg:'Account Holder ID must not be empty !',
            name:req.body.name,
            accountNo:req.body.accountNo,
            mobile:req.body.mobile
        })
    }else if(file.nomeny_holder_id == undefined){
        return res.render('home', {
            msg:'Nomeny Holder ID must not be empty !',
            name:req.body.name,
            accountNo:req.body.accountNo,
            mobile:req.body.mobile
        })
    }else{
        // Upload To database
        console.log(file.signature_card)
        console.log(file.photo_id)
        console.log(file.acc_holder_id)
        console.log(file.nomeny_holder_id)
        console.log(req.body)
        res.redirect('/')
    }
   
})

app.listen(port, console.log(`server running on http://localhost:${port}`))