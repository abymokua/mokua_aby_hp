const express = require ('express')
const router =  express.Router()
const bcrypt = require ('bcryptjs')
const passport = require ('passport')
const sanitize = require ('mongo-sanitize')

//user model
const User = require('../models/User');
const Ticket = require('../models/Ticket');

//Login Page 
router.get('/login', (req,res) => res.render('Login'));
//Register Page
router.get('/register', (req,res) => res.render('Register'));
//dashboard
router.get('/dashboard', (req,res) => res.render('Dashboard'));
//ticket
router.get('/tickets', (req,res) => res.render('Ticket'))

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

router.post('/tickets',(req, res)=> {
    const {category, createdBy, assignedTo, priority, status, comment} = req.body
 
    let errors =[];
    if(!category || !createdBy || !assignedTo || !priority || !status || !comment) {
        errors.push({msg: 'All fields are required!'})
    }
 
    if (errors.length > 0) {
     res.render('tickets',{
         errors,
         category,
         createdBy,
         assignedTo,
         priority,
         status,
         comment
     })
         } else {
             const newTicket = new Ticket({
                category,
                createdBy,
                assignedTo,
                priority,
                status,
                comment 
             })
             newTicket.save()
             .then(user => {
                req.flash('success_msg', 'Ticket Created!')
                res.redirect('/dashboard')
                         })
                         .catch(err => console.log(err));
 
    }
 })
//logout
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')

})


module.exports = router;