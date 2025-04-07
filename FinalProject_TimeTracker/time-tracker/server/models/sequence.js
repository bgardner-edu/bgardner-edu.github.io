
const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
    maxEntryId: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);