var Sequence = require('../models/sequence');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

var maxEntryId;
const sequenceId = new ObjectId("67db92e0201ca84f004c9aa2");

function SequenceGenerator() {
  Sequence.findOne().exec()
  .then(sequence => {
    if (!sequence) {
      console.error('No sequence document found');
      return;
    }

    this.maxEntryId = sequence.maxEntryId;
  })
  .catch(err => {
    console.error('Error fetching sequence:', err);
  });
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'entries':
      this.maxEntryId++;
      updateObject = {maxEntryId: this.maxEntryId};
      nextId = this.maxEntryId;
      break;
    default:
      return -1;
  }

  Sequence.updateOne({ _id: sequenceId }, { $set: updateObject })
  .then(() => {
    console.log("Update successful");
  })
  .catch((err) => {
    console.log("nextId error = " + err);
  });
  return nextId;
}

module.exports = new SequenceGenerator();
