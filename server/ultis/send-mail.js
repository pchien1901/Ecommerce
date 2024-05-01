const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

/**
 * Hàm thực hiện gửi email
 * Author:
 */
const sendMail = asyncHandler(async (email, html) => {
  console.log("Email: ", email, "html: ", html);
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
      // user: "phamminhchien.forwork@gmail.com",
      // pass: "chien1901#"
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Cuahangdientu" <no-replycuahangdientu.com>', // sender address
    to: email, // list of receivers
    subject: "Forgot password", // Subject line
    //text: "Hello world?", // plain text body
    html: html, // html body
  });

  return info;
});

module.exports = sendMail;
