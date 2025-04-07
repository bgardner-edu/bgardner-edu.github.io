var express = require('express');
var router = express.Router();
var sequenceGenerator = require('./sequenceGenerator');
var Entry = require('../models/entry');

router.get('/', (req, res, next) => {
    Entry.find()
    .then(entries => {
      res.status(200).json({
        message: 'Entries fetched successfully!',
        entries: entries
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred!',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  const maxEntryId = sequenceGenerator.nextId("entries");

  const entry = new Entry({
    id: maxEntryId,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    total: req.body.total
  });

  entry.save()
    .then(createdEntry => {
      res.status(201).json({
        message: 'Entry added successfully',
        entry: createdEntry
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.put('/:id', (req, res, next) => {
    Entry.findOne({ id: req.params.id })
    .then(entry => {
        entry.startDate = req.body.startDate;
        entry.endDate = req.body.endDate;
        entry.total = req.body.total;

      Entry.updateOne({ id: req.params.id }, entry)
        .then(result => {
          res.status(204).json({
            message: 'Entry updated successfully'
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    });
});

router.delete("/:id", (req, res, next) => {
    Entry.findOne({ id: req.params.id })
    .then(message => {
      Entry.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Entry deleted successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: "An error occurred",
            error: error
          });
        });
    });
});

module.exports = router; 