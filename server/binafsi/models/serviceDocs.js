//Creates a new schema for documents with information such as the document name, type(extension), size, and owner
const mongoose = require('mongoose');


const ServiceDocSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    attributes: {
        size: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        owner: {
            type: String,
            required: true
        }
    },
    uploadInfo: {
        uploaderNumber: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: false
        }
    }
});

module.exports = mongoose.model('ServiceDoc', ServiceDocSchema);