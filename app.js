const express = require('express');
const moment = require('moment')
const cors   = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const port = process.env.PORT || 5000;
const app = express()
var exphbs  = require('express-handlebars');
const path = require('path')
const mongoose = require('mongoose')
const flash          = require('express-flash')
const session        = require('express-session')
const passport       = require('passport')
const init           = require('./config/passport');
init(passport)



// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('.hbs', exphbs({extname:'.hbs'}));
app.set('view engine', '.hbs');
app.use('/static', express.static(path.join(__dirname, 'public')))

let mongoURI = 'mongodb+srv://saif:saif@cluster0.szwmr.mongodb.net/gameonacc?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(data => {
    console.log('mongodb connected on: '+data.connection.host)
}).catch(e => console.log(e))


app.use(session({
    secret: 'posSystem',
    resave: false,
    saveUninitialized: true
}))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());


app.post('/login', passport.authenticate('local', {
    successRedirect:'/home',
    failureRedirect:'/',
    failureFlash:true
}))

const User = require('./models/user')


var storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename:(req, file, cb)=> {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
// AUth Guard
const checkAuth = (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }else{
        res.redirect("/");
    }
}
const checkNotAuth = (req, res, next) => {
    if(!req.isAuthenticated()){
        next()
    }else{
        res.redirect("/home");
    }
}




var upload = multer({storage:storage})

app.get('/',checkNotAuth,  (req, res) => {
    res.render('login', {layout:'login'})
})

app.get('/home',checkAuth, (req, res) => {
    res.render('home')
})

app.get('/user/logout', (req,res) => {
    req.logout()
    res.redirect('/')
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
), async(req, res) => {
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
       
        let userData = {
            name:req.body.name,
            accountNo:req.body.accountNo,
            mobile:req.body.mobile,
            signature_card:file.signature_card[0].filename,
            photo_id:file.photo_id[0].filename,
            acc_holder_id:file.acc_holder_id[0].filename,
            nomeny_holder_id:file.nomeny_holder_id[0].filename
        }


       
        try {
             // first insert data in user
             let user = await new User(userData).save()
             console.log(user)
            res.render('home', {
                success:'Data Recored Successfully !'
            })
            
        } catch (error) {
            res.render('home', {
                msg:'Server Error !'
            })
        }
        
    }
   
})

// Search Data
app.get('/search/:phone', async(req, res) => {
    if(req.params.phone ==""){
        return res.json({msg:'Please put a valid client phone number'})
    }else{
        try {
            let user = await User.find({mobile:req.params.phone}).lean()
            console.log(user)
            if(user.length <= 0){
                return res.json({msg:'no user found with this phone number'})
            }else{
                return res.json({msg:null, data:user})
            }
        } catch (error) {
            return res.json({msg:'server error'})
        }
    }
    
})

app.listen(port, console.log(`server running on http://localhost:${port}`))