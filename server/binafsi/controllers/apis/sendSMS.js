const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
  apiKey: process.env.AT_APP_APIKEY,
  username: process.env.AT_APP_USERNAME
});

module.exports = async function sendSMS(stuff) {

  // TODO: Send message
  try {
    const result = await africastalking.SMS.send({
      to: stuff.to,
      message: stuff.message,
    });
  } catch (ex) {
    console.error(ex);
  }

};