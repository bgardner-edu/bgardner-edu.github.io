const mongoose = require('mongoose');
 
const entrySchema = mongoose.Schema({
    id: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    total: { type: Number }
});

module.exports = mongoose.model('Entry', entrySchema);