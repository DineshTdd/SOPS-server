const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GOOGLE_OAUTH2_CLIENT_ID, // ClientID
  process.env.GOOGLE_OAUTH2_SECRET_KEY, // Client Secret
  'https://developers.google.com/oauthplayground', // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Storing accessToken
const accessToken = oauth2Client.getAccessToken();

// Sending passphrase to the email
const sendPassphrase = ({ email, passphrase, cardName }) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.SERVER_GMAIL_ADDRESS,
      clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH2_SECRET_KEY,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: `"D2K Developers" - ${process.env.SERVER_GMAIL_ADDRESS}`,
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
