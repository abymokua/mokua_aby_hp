const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true
    }, 
    category:{
    type: String,
    required: true
    }, 
    assignedTo:{
        type: String,
        required: true
    }, 
    priority:{
        type: String,
        required: true
    }, 
    status:{
        type: String,
        required: true
    }, 
    comment:{
        type: String,
        required: true
    }, 
    timestamp:{
        type: Date,
        default: Date.now
    } 
})

module.exports = mongoose.model('Ticket', TicketSchema)