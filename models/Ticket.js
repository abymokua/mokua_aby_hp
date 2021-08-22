const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
    }, 
    role:{
        type: String,
        required: true,
    }, 
    deadline:{
        type: Date,
        required: true,
    }, 
    status:{
        type: String,
        required: true,
        default: 'Not Applied',
        enum: ['Not Applied','Applied','Awaiting Feedback','Interview', 'Accepted','Rejected'], 
    },
    userId:{
        type: String,
        required: true,
    }
});
module.exports = mongoose.model('Ticket', TicketSchema)