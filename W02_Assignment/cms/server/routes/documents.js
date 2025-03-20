var express = require('express');
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');
const router = express.Router();

router.get('/', (req, res, next) => {
    Document.find()
        .then(documents => {
            res.status(200).json({
                message: 'Documents fetched successfully!',
                documents: documents
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
    const maxDocumentId = sequenceGenerator.nextId("documents");

    const document = new Document({
        id: maxDocumentId,
        name: req.body.name,
        url: req.body.url,
        description: req.body.description,
        children: req.body.children
    });

    document.save()
        .then(createdDocument => {
            res.status(201).json({
                message: 'Document added successfully',
                document: createdDocument
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
    Document.findOne({ id: req.params.id })
        .then(document => {
            document.name = req.body.name;
            document.url = req.body.url;
            document.description = req.body.description;
            document.children = req.body.children;

            Document.updateOne({ id: req.params.id }, document)
                .then(result => {
                    res.status(204).json({
                        message: 'Document updated successfully'
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'An error occurred',
                        error: error.message
                    });
                });
        });
});

router.delete("/:id", (req, res, next) => {
    Document.findOne({ id: req.params.id })
        .then(document => {
            Document.deleteOne({ id: req.params.id })
                .then(result => {
                    res.status(204).json({
                        message: "Document deleted successfully"
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

module.exports = router; 