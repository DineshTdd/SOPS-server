const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var path = require('path');

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

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('playground/views/email'),
      layoutsDir: path.resolve('playground/views/email'),
      defaultLayout: 'index.html',
    },
    viewPath: path.resolve('playground/views/email'),
    extName: '.html',
  }),
);

const mailOptions = {
  from: '"D2K Developers" - d2kdevelopers@gmail.com',
  to: 'dineshthiru.1998@gmail.com, selvakumardhivakar@gmail.com',
  subject: 'AFter less secure - ON',
  template: 'index',
  context: {
    username: 'Dinesh',
  },
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
