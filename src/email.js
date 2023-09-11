const nodemailer = require("nodemailer");

//import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'davide.aprea86@gmail.com',
      pass: 'ntyxbziqqkobdxvx'
  }
});

var mailOptions = {
    from: '"Fred Foo 👻" <davide.aprea86@gmail.com>', // sender address
    to: "crisisart86@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

