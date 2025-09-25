//This module handles OTP methods for file retrieval functions
const
    otplib = require('otplib'),
    fs = require('fs'),
    path = require('path');

const Document = require("../../models/document");
const otp = require("../../models/printCodes")

// let otps = [];
// try {
//     otps = JSON.parse(fs.readFileSync('binafsi/database/fileInfo.json', 'utf-8'));
// } catch (err) {

// }

function generateOTP() {
    const secret = otplib.authenticator.generateSecret();
    const token = otplib.authenticator.generate(secret);
    //const timeStamp = Date.now() + 1800000; //OTP validity set to 30 minutes

    return token
}

const appendOTPs = async (data) => {
    try {
        const authcode = new otp(data);
        await authcode.save();
        // otps.push(data);
        // fs.writeFileSync('binafsi/database/fileInfo.json', JSON.stringify(otps, null, 2));
    } catch (err) {
        console.error(error);
        res.status(500).json({ error: 'There was a problem generating your OTP' })
    }
}

exports.getOTP = async function (docId) {
    console.log(docId)
    const token = generateOTP();

    const otpInfo = ({ token, docId });
    appendOTPs(otpInfo);
    console.log(token, otpInfo);
    return token;
}

// exports.getOTP = (req, res) => {
//     let documentId = req.query;
//     console.log(documentId);
//     const { token, timeStamp } = generateOTP();

//     const otpInfo = ({ token, documentId, timeStamp });
//     appendOTPs(otpInfo);
//     console.log(token, timeStamp, otpInfo);
//     res.send(token);
// }

async function validateOTP(token) {
    const now = Date.now();

    const otpDoc = await otp.findOne({ token: token });

    if (otpDoc) {
        //Check for expiry
        if (otp.timeStamp) {
            //valid unexpired OTP
            return { valid: true, documentId: otp.documentId };
        } else {
            //Expired OTP, remove from array
            otp.deleteOne({ token: otpDoc });
            // fs.writeFileSync('binafsi/database/fileInfo.json', JSON.stringify(otps, null, 2));
        }
    }

    // Invalid or expired OTP
    return { valid: false };
}

exports.printDoc = async (req, res) => {
  try {
    const { otp } = req.params;
    const { valid, documentId } = await validateOTP(otp);

    if (!valid) {
      return res.status(410).json({ message: "Print code expired or invalid." });
    }

    const doc = await Document.findById(documentId);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    if (doc.storageType === 'local') {
      const filePath = path.resolve(doc.attributes.location);
      if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found.' });

      return res.sendFile(filePath, {
        headers: {
          'Content-Disposition': `inline; filename="${doc.filename || doc.name}"`,
          'Content-Type': doc.attributes.mimetype || 'application/pdf'
        }
      });
    }

    if (doc.storageType === "google_drive") {
      const downloadLink = doc.attributes?.downloadLink || doc.attributes?.location;
      if (downloadLink) return res.redirect(downloadLink);
      return res.status(501).json({ message: "Google Drive file not available." });
    }

    return res.status(500).json({ message: "Unsupported storage type." });
  } catch (err) {
    console.error("PrintDoc GET error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

/* (req, res) => {
    // res.send(data);
    let { otp } = req.query;

    const { valid, documentId } = validateOTP(otp);

    if (valid) {
        console.log(otp);
        // Successfully validated
        Document.findById(documentId.documentId)
            .then((dataOut) => {
                fileInfo = dataOut;
                const sourcePath = fileInfo.attributes.location;
                console.log(sourcePath)
                const file = path.join(__dirname, '../../../', decodeURIComponent(sourcePath));
                fs.readFile(file, (err, data) => {
                    if (err) {
                        console.log(err);
                        // res.status(404).send('File not found');
                    } else {
                        res.send(data);
                    }
                });
            })
            .catch((err) => {
                res.send("There was an error retrieving your document")
            })
        //  if (!file) {
        //      return res.status(404).json({ message: 'File not found' });
        //  }
        //  Verify the OTP
        // const isValid = otplib.authenticator.check(otp, secret);
        // if (!isValid) {
        //     return res.status(401).json({ message: 'Invalid OTP' });
        // }
        // // send the file
        // res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
        // res.setHeader('Content-type', file.mimetype);
    }
    if (!valid) {
        res.send("Invalid OTP")
    }
} */