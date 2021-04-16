const express = require ('express')
const router =  express.Router()
const passport = require('passport')
const {ensureAuth, ensureUser} = require ('../config/auth')

const User = require('../models/User')
const Ticket = require('../models/Ticket')
//landing
router.get('/', (req,res) => res.render('landing'))

//dashboard
router.get('/dashboard', ensureUser, (req,res) =>
res.render('dashboard'))

//ticket
router.get('/tickets',(req,res) => 
res.render('tickets'));

module.exports = router;