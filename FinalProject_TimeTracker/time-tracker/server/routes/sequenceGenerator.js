var Sequence = require('../models/sequence');

var maxEntryId;
var sequenceId = null;

function SequenceGenerator() {
  Sequence.findOne().exec()
  .then(sequence => {
    if (!sequence) {
      console.error('No sequence document found');
      return;
    }

    this.sequenceId = sequence._id;
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
      updateObject = {maxMessageId: this.maxEntryId};
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
