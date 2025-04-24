//This module handles functions related to file methods
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Document = require("../../models/document");
//const ServiceDoc = require("../../models/serviceDocs");
const User = require("../../models/user");
const sendSMS = require('../../controllers/apis/sendSMS');
const fileDrDir = './filedrop';
const ussdCode = process.env.USSD

//Upload a new document
exports.create = (req, res) => {
  const document = new Document
}

//Retrieve all documents for a particular phone number
exports.getAll = async function (userNum) {
  try {
    const data = await Document.find();
    const userdocs = docsFilter(data, (d) => d.attributes.owner == userNum);
    return userdocs;
  } catch (err) {
    console.error("An error occurred while retrieving documents:", err);
    throw err; // Rethrow the error to be caught in the calling function
  }

  //Function to filter incoming documents 
  function docsFilter(list, criteria) {
    let passed = [];
    for (let element of list) {
      if (criteria(element)) {
        passed.push(element)
      }
    }
    return passed;
  }
}

exports.getFiles = async (req, res) => {
  let num = req.query.userNum;
  console.log(num)
  let docs = await this.getAll(num);
  res.send(docs)
}

//Retrieve a single document with a document ID
exports.getOne = (req, res) => {
  Document.findById()
}

//Delete a file based on its ID
exports.docDelete = (req, res) => {
  Document.findByIdAndRemove(req.params.documentId)
    .then((data) => {
      res.send({ message: "Document deleted successfully!" });
    })
    .catch((err) => {
      console.log(err + req.params.documentId);
    });
  // console.log(req.params.documentId)
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname)
  }
})

function upload_letter(req, res) {
  const upload = multer({ storage: storage }).single('attachment');
  upload(req, res, () => {
    if (req.file) {
      let { filename, path, size } = req.file;
      console.log(path, size)
    }
    console.log("No file!")
    // File uploaded successfully

  });
}

// Send personalized letters from word alongside SMS notification
exports.massShareDocs = async (req, res) => {
  let { recipient, filename, message, attachment } = req.body;
  console.log(attachment);
  let num = recipient.split('254')[1];
  const sourcePath = attachment;

  try {
    // Check if user exists
    const user = await User.findOne({ phone: num });
    if (!user) {
      const dest = `${fileDrDir}/${num}`;
      // ... handle file upload logic ...
      console.log(dest);

      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const destinationPath = path.posix.join(dest, filename);
      fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        const fileUrl = req.protocol + '://' + req.get('host') + '/' + destinationPath;
        console.log(destinationPath);
      });

      const stats = fs.statSync(sourcePath);
      const fileSize = stats.size;

      const document = new Document({
        name: filename,
        attributes: {
          size: fileSize,
          location: destinationPath,
          owner: num
        },
        uploadInfo: {
          uploaderNumber: recipient,
          message: message
        }
      });
      document.save(err => {
        if (err) {
          // req.flash('saveErr', "There was an error saving your document");
          console.log(err);
          res.send("The system encountered an error");
        }
        documentId = document._id;
        console.log(documentId);
      })
      console.log(document)

      let appmsg = ` Dial ${ussdCode} to access and print your document`

      // upload_letter(req, res);
      // Handle file upload success, then send SMS     
      const smsOptions = {
        to: '+' + `${recipient}`,
        message: message + `\n` + appmsg,
      };

      await sendSMS(smsOptions);

      // Send response after all operations have completed
      res.status(200).json({ success: true, message: 'Letter and SMS sent successfully.' });
    }
  } catch (error) {
    // Handle errors and send appropriate error response
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to send Letter and SMS.' });
  }
};


//Share a file via USSD, website or mobile app
exports.share_file = (req, res) => {
  let { sender, recipient, documentId, message } = req.query;
  console.log(documentId);
  Document.findById(documentId)
    .then((data) => {
      fileInfo = data;
      const sourcePath = fileInfo.attributes.location;
      User.findOne({ phone: recipient })
        .then((user) => {
          if (!user) {
            const fileName = fileInfo.name;
            const dest = `${fileDrDir}/${recipient}`;
            console.log(dest);

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            const destinationPath = path.posix.join(dest, fileName);
            fs.copyFile(sourcePath, destinationPath, (err) => {
              if (err) {
                return res.status(500).send(err);
              }
              const fileUrl = req.protocol + '://' + req.get('host') + '/' + destinationPath;
              console.log(destinationPath);
              res.send(fileUrl)
            })
            const document = new Document({
              name: fileName,
              attributes: {
                size: fileInfo.attributes.size,
                location: destinationPath,
                owner: recipient
              },
              uploadInfo: {
                uploaderNumber: sender,
                message: message
              }
            });
            document.save(err => {
              if (err) {
                // req.flash('saveErr', "There was an error saving your document");
                console.log(err);
                res.send("The system encountered an error");
              }
              documentId = document._id;
              console.log(documentId);
            })
            console.log(document);
          }
        });

      // if () 
    })
}

// Send personalized letters from word alongside SMS notification
exports.shareServiceDocs = async (req, res) => {
  let { sender, identifier, filename, message, attachment } = req.body;
  console.log(attachment);
  const sourcePath = attachment;

  try {
    const dest = `${fileDrDir}/${sender}`;
    // ... handle file upload logic ...
    console.log(dest);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const destinationPath = path.posix.join(dest, filename);
    fs.copyFile(sourcePath, destinationPath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      const fileUrl = req.protocol + '://' + req.get('host') + '/' + destinationPath;
      console.log(destinationPath);
    });

    const stats = fs.statSync(sourcePath);
    const fileSize = stats.size;

    const document = new Document({
      name: filename,
      attributes: {
        size: fileSize,
        location: destinationPath,
        owner: identifier
      },
      uploadInfo: {
        uploaderNumber: sender,
        message: message
      }
    });
    document.save(err => {
      if (err) {
        // req.flash('saveErr', "There was an error saving your document");
        console.log(err);
        res.send("The system encountered an error");
      }
      documentId = document._id;
      console.log(documentId);
    })
    console.log(document)

    // Send response after all operations have completed
    res.status(200).json({ success: true, message: 'Letter and SMS sent successfully.' });
  } catch (error) {
    // Handle errors and send appropriate error response
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to send Letter and SMS.' });
  }
};

//This function processes a user request for a Service document received via an SMS
exports.getServiceDoc = async (req, res) => {
  console.log(req.body)
  let identifier = req.body.text;
  let recipient = req.body.from;
  let response;
  console.log(identifier);

  try {
    const data = await Document.find({ "attributes.owner": identifier });
    console.log(data)
    if (data) {
      fileInfo = data[0]; // Assuming you want to access the first document if multiple documents are found
      const name = fileInfo.name;
      const sender = fileInfo.uploadInfo.uploaderNumber;
      const sourcePath = fileInfo.attributes.location;
      console.log(sourcePath)

      let num = recipient.split('+254')[1];
      User.findOne({ phone: num })
        .then((user) => {
          if (!user) {
            const filename = name;
            const dest = `${fileDrDir}/${num}`;
            console.log(dest);

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            const destinationPath = path.posix.join(dest, filename);
            fs.copyFile(sourcePath, destinationPath, (err) => {
              if (err) {
                return res.status(500).send(err);
              }
              const fileUrl = req.protocol + '://' + req.get('host') + '/' + destinationPath;
              console.log(destinationPath);
              console.log(fileUrl)
            })
            const document = new Document({
              name: filename,
              attributes: {
                size: fileInfo.attributes.size,
                location: destinationPath,
                owner: num
              },
              uploadInfo: {
                uploaderNumber: sender,
                message: fileInfo.uploadInfo.message
              }
            });
            document.save(err => {
              if (err) {
                // req.flash('saveErr', "There was an error saving your document");
                console.log(err);
                res.send("The system encountered an error");
              }
              documentId = document._id;
              console.log(documentId);
            })
            console.log(document);
          }
        });
      let appmsg = ` Dial ${ussdCode} to access and print your document`
      response = `You have a file: ${name} from ${sender}.` + appmsg;
    } else {
      response = "File not found!";
    }
    const smsOptions = {
      to: `${recipient}`,
      message: response,
    };
  
    await sendSMS(smsOptions);
  } catch (error) {
    console.error(error);
    response = "Error occurred while retrieving the file.";
  }
}