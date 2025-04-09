const mongoose = require('mongoose');
 
const entrySchema = mongoose.Schema({
    id: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    total: { type: Number },
    modifiedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entry', entrySchema);