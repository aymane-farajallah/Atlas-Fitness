const nodemailer = require("nodemailer");
const sendMailUser = async ({ userEmail, resetLink }) => {
  return new Promise((resolve, reject) => {
    console.log("email sending", userEmail);
    console.log("email reset link", resetLink);

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.TRANSPORT_USER,
        pass: process.env.TRANSPORT_PASS,
      },
    });

    const mailOptions = {
      from: process.env.managerEmail,
      to: userEmail,
      subject: "Reset Your Password",
      html: `<b>Reset your password <a href="${resetLink}">here</a></b>`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("Error sending email:", err);
        reject({
          message: "Error sending email",
          status: 500,
        });
      } else {
        resolve({
          message: "Email sent successfully",
          status: 200,
        });
      }
    });
  });
};

module.exports = sendMailUser;