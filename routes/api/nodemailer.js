const router = require('express').Router();
const nodemailer = require("nodemailer");

router.post('/send', (req, res, next) => {
    var name = req.body.name;
    var emailFrom = req.body.email;
    var message = req.body.message;
    var subject = req.body.subject;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com", //replace with your email provider
        port: 587,
        auth: {
            user: "XXXXXXXXXXX",
            pass: "XXXXXXXXXXX",
        },
    });
    
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    var mailOptions = {
        from: 'XXXXXXXXXXXXXXXXX',
        to:  'XXXXXXXXXXXXXXXXXX',
        cc: emailFrom,
        subject: ' Nuevo Mensaje | ' + name + ' | ' + subject,
        text: message,
        html: '<h1>'+message+'</h1>'+' | Solicitado por | '+'<h1>'+name+'</h1>'
    };
    
    transporter.sendMail(mailOptions, (err, info) =>{
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong.");
          } else {
            res.status(status).send(body, info);
          }
    });
  });

  module.exports = router;