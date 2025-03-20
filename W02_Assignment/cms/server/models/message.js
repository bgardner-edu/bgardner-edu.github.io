const mongoose = require('mongoose');
 
const messageSchema = mongoose.Schema({
    id: { type: String },
    subject: { type: String },
    msgText: { type: String },
    sender: { type: String }
});

module.exports = mongoose.model('Message', messageSchema);