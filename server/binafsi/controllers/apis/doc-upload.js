//This controller handles file uploads
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const Document = require('../../models/document');
const docDetails = [];

//methods for document upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  }
})

function uploadDocument(req, res) {
  let upload = multer({ storage: storage }).single('userdoc');

  upload(req, res, () => {
    if (req.file) {
      let { filename, path, size } = req.file;
      docDetails.push(filename, size, path);
      console.log(docDetails)
    }
  });
}

function addDocument(req, res) {
  let { uploadNumber, uploadMessage } = req.body;
  const docSendDetails = [parseInt(uploadNumber), uploadMessage];
  console.log(docSendDetails);
  docDetails.push(docSendDetails);
  console.log(docDetails);

  //create a new document object based on form data
  const document = new Document({
    name: docDetails[0],
    attributes: {
      size: docDetails[1],
      location: docDetails[2],
      owner: docSendDetails[0]
    },
    uploadInfo: {
      uploaderNumber: docSendDetails[0],
      message: docSendDetails[1]
    }
  });
  console.log(document);

  document.save(err => {
    if (err) {
      req.flash('saveErr', "There was an error saving your document");
      console.log(err);
      return res.send("Document not uploaded");
    }
    res.redirect('/');
    documentId = document._id;
    console.log(documentId);
  })
};

module.exports = {
  add: addDocument,
  upload: uploadDocument
};