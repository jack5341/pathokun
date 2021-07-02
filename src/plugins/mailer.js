import nodemailer from "nodemailer";

export const ResetPassword = (to, message) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "nedim.akar53411@gmail.com",
      pass: "259123nedim",
    },
  });

  var message = {
    from: "nedim.akar53411@gmail.com",
    to: to,
    subject: message.subject,
    html: `<a href="http://localhost:3000/a/reset-password?username=${message.username}&token=${message.token}" alt="your refresh token">Refrest Token</a>`,
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};
