//This file handles methods related to ussd requests

const
  express = require("express"),
  router = express.Router(),
  UssdMenu = require('ussd-builder'),
  User = require('../../models/user'),
  Document = require('../../models/document');


const getDoc = require('../../services/dashboard/getDocs');
const printCode = require('../../services/authentication/printerAuth');
const sendSMS = require('./sendSMS')

let menu = new UssdMenu();

//Menu states
menu.startState({
  run: () => {
    menu.con('Welcome to Digibox.' + '\n' +//'\nWhat would you like to do?' +
      //'\n1. Register' +
      '\n1. View available documents');
  },
  next: {
    //'1': 'register',
    '1': 'viewDocs'
  }
});

menu.state('register', {
  run: () => {
    //Capture user input
  }
})

async function getDocumentsList() {
  try {
    let num = menu.args.phoneNumber.split('+254')[1];
    console.log(num);

    const docs = await getDoc.getAll(num);
    const docsList = docs.reduce((documentList, document, index) => { documentList.push({ "id": document._id, "key": index, "value": document.name + ' ' + (document.attributes.size / 1024).toFixed(2) + 'kb' }); return documentList; }, [])
    console.log(docs);
    // const names = `\n ${docsList["key"] + 1}. ${docsList["value"]}`;
    // console.log(names);
    return docsList;
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error here, e.g., send an error message to the user.
  }
}

menu.state('viewDocs', {
  run: async function () {
    let docs = await getDocumentsList();
    const names = docs.map(((el, i) => `\n ${i + 1}. ${el.value}`));
    console.log(names + " hi");
    if (names.length < 1) {
      menu.con(`You currently have no files` + 
      `\n 0. Exit`)
    } else {
      menu.con(names)
    };
  },
  next: {
    '*\\d+': 'viewDocs.document'
  }
})

menu.state('viewDocs.document', {
  run: async () => {
    let num = menu.args.phoneNumber.split('+254')[1];
    const docs = await getDoc.getAll(num);

    let dNum = menu.val - 1
    let docName = docs[dNum].name;
    menu.con(`What would you like to do with ${docName}?\n` +
      '\n1. Print' +
      `\n2. View Details`)
  }, next: {
    '1': 'viewDocs.print',
    '2': 'viewDocs.details'
  }
})

menu.state('viewDocs.print', {
  run: async () => {
    try {
      let num = menu.args.phoneNumber.split('+254')[1];
      const docs = await getDoc.getAll(num);

      let dNum = menu.val - 1
      let docName = docs[dNum].name;
      let docId = docs[dNum]._id;
      // let session = getSession(menu.args.sessionId);
      let token = await printCode.getOTP(docId);
      // session.set('documentId', docId);

      const smsMessage = 'To print ' + `${docName}` + ', go to digibox.com/print and enter this code: ' + `${token}` + '.'
      // Send the sms message using Africa's talking
      const options = {
        to: menu.args.phoneNumber,
        message: smsMessage,
      };
      console.log(options);

      // Send the SMS message using Africa's Talking and await the result
      await sendSMS(options);

      // End the USSD session with a response message
      menu.end(`You will receive an SMS with a document print code for ${docName}. Thank you for using digibox`);
    } catch (error) {
      console.error(error);
      // Handle the error and end the USSD session with an error message
      menu.end("An error occurred while sending the SMS. Please try again later.");
    }
  }
})

exports.initUssd = (req, res) => {
  menu.run(req.body, ussdResult => {
    res.send(ussdResult);
  });
}