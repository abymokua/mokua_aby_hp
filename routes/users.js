const express = require ('express')
const router =  express.Router()
const bcrypt = require ('bcryptjs')
const passport = require ('passport')
const sanitize = require ('mongo-sanitize')

const {ensureAuth, ensureUser} = require ('../config/auth')

//user model
const User = require('../models/User');
const Ticket = require('../models/Ticket');

//Login Page 
router.get('/login', (req,res) => res.render('login'));
//Register Page
router.get('/register', (req,res) => res.render('register'));
//dashboard page

//handle
router.post('/register',(req, res)=> {
   const {name, email, password, password2} = req.body

   let errors =[];
   if(!name || !email || !password || !password2) {
       errors.push({msg: 'All fields are required!'})
   }
   if(password !== password2){
       errors.push({ msg: 'The passwords dont match'})    
   }
   
//password length check 

   if(password.length < 8){
       errors.push({ msg:'Password must be at least 8 characters'})
   }

   if (errors.length > 0) {
    res.render('register',{
        errors,
        name,
        email,
        password,
        password2
    })
   } else {
//validation
       const clean = sanitize(req.body.email)

       User.findOne({email: clean})
       .then(user => {
           if(user) {
               errors.push({msg: 'Email already registered'})
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
           })

        } else {
            const newUser = new User({
                name,
                email,
                password 
            })

    //hashing password using bcrypt
            bcrypt.genSalt(10, (err, salt)=> 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    
                    newUser.password = hash
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'Yaaay! You are all registered, now log in!')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err));
                } ))

        }
       })
   }
})
//handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
       successRedirect: '/dashboard',
       failureRedirect: '/users/login',
       failureFlash: true 
    })
    (req,res,next)
})
//logout
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
})
module.exports = router;