var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {
  Sequence.findOne().exec()
  .then(sequence => {
    if (!sequence) {
      console.error('No sequence document found');
      return;
    }

    this.sequenceId = sequence._id;
    this.maxDocumentId = sequence.maxDocumentId;
    this.maxMessageId = sequence.maxMessageId;
    this.maxContactId = sequence.maxContactId;
  })
  .catch(err => {
    console.error('Error fetching sequence:', err);
  });
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      this.maxDocumentId++;
      updateObject = {maxDocumentId: this.maxDocumentId};
      nextId = this.maxDocumentId;
      break;
    case 'messages':
      this.maxMessageId++;
      updateObject = {maxMessageId: this.maxMessageId};
      nextId = this.maxMessageId;
      break;
    case 'contacts':
      this.maxContactId++;
      updateObject = {maxContactId: this.maxContactId};
      nextId = this.maxContactId;
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
