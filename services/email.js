const nodemailer = require('nodemailer');

// Sending passphrase to the email
const sendPassphrase = ({ email, passphrase, cardName }) => {
  var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'd2kdevelopers@gmail.com', // here use your real email
      pass: 'tdkisidhiva', // put your password correctly (not in this question please)
    },
  });
  console.log(email);

  const mailOptions = {
    from: '"D2K Developers" - d2kdevelopers@gmail.com',
    to: email,
    subject: 'Generated passphrase - reg.',
    text: `Passphrase for your card - ${cardName} is generated.
            Here is your passphrase - ${passphrase}.
            Don't share it to anyone! Keep it safe.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendPassphrase };
