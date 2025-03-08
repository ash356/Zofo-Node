
import nodemailer from "nodemailer";
// Sending Email Method
const sendEmail = async ({
     to = [], // list of Receivers
     cc, //  To Show  Other Receivers Emails يعرفوا بعض 
     bcc, // To Hide Other Receivers Emails ميعرفوش بعض 
     subject,// Subject Line
     text,// Plain Text Body
     html, // Html Body
     attachments = [],
} = {}) => {
     let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
               user: process.env.EMAIL_NAME,    // Sender Email Name
               pass: process.env.EMAIL_PASSWORD, // Sender Email Password
          },
     });

     // send mail with defined transport object
     let info = await transporter.sendMail({
          from: `Ashour Dev Team  🚀<${process.env.EMAIL_NAME}>`, // sender address
          to,
          cc,
          bcc,
          subject,
          text,
          html,
          attachments,
     });
     // console.log(info);
     return info.rejected.length ? false : true;
};
export default sendEmail;
