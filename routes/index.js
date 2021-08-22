const express = require ('express')
const router =  express.Router()
const {ensureAuth, ensureUser} = require ('../config/auth')

const User = require('../models/User')
const Ticket = require('../models/Ticket')

//landing
router.get('/', (req,res) => res.render('landing'))

//retrieving applications from DB
router.get('/dashboard',async(req,res)=> 
{
    try {
        const tickets = await Ticket.find({userId: req.user._id}).lean()
        console.log(tickets);
        res.render('dashboard.ejs',{tickets})
    } catch (err){
        console.error(err)
    }
})

//ticket
router.get('/tickets',(req,res) => 
res.render('tickets',{ userId:req.user._id}))

//opportunity
router.get('/opportunity', (req,res) =>
res.render('opportunity', {
}))

//session
router.get('/session', (req, res) => {
res.render('session', {
session: true
	});
});

//adding a new application
router.post('/tickets',(req, res)=> {
    const {company, role, deadline, status} = req.body
    let errors =[];
    if(!company || !role || !deadline || !status) {
        errors.push({msg: 'All fields are required!'})
    }
    if (errors.length > 0) {
     res.render('tickets',{
         errors,
         company,
         role,
         deadline,
         status
     })
         } else {
             const newTicket = new Ticket({
                company,
                role,
                deadline,
                status,
                userId:req.user._id
             })
             newTicket.save()
             .then(user => {
                req.flash('success_msg', 'Application Added!')
                res.redirect('/dashboard')
                         })
                         .catch(err => console.log(err));
 
    }
 })


module.exports = router;