const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    id: { type: String },
    name: { type: String },
    url: { type: String },
    description : { type: String },
    children: [{ type: String }]
});

module.exports = mongoose.model('Document', documentSchema);