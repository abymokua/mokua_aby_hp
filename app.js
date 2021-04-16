const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require ('express-session')
const passport = require ('passport')

const app = express()
//passport config
require('./config/passport')(passport)

//database
//db config
const db = require('./config/keys').MongoURI;
//db connect
mongoose.connect(db,{useNewUrlParser:true})
.then(()=> console.log('Database Connected'))
.catch(()=>console.log(err))

//bodyparser
app.use(express.urlencoded ({ extended:false}))

//session middleware
app.use(session({
    secret: 'banana',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

  //passport middleware
app.use(passport.initialize());
app.use(passport.session());
  //flash
app.use(flash())

  //global variables
app.use(function(req, res, next ) {
    res.locals.success_msg = req.flash('success_msg')  
    res.locals.error_msg = req.flash('error_msg')  
    res.locals.error = req.flash('error')  
    next()
  })

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs')

//route
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
