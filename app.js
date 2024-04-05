const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 9000;
const rateLimit = require("express-rate-limit"); // Rate limiting for spam prevention

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Rate limit to prevent excessive email sending (adjust limits as needed)
const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit to 5 emails per 15 minutes
  message: "Too many emails sent, please try again later.",
});
app.use("/api/send_email", emailRateLimiter); // Apply rate limiting to /api/send_email


const transporter = nodemailer.createTransport({
  host: process.env.Email_Host,
  port: 587,
  secure: false,
  // tls: {
  //   ciphers: 'SSLv3'
  // },
  auth: {
    user: process.env.Email_User,
    pass: process.env.Email_Pass
  }

});





app.post('/api/send_email', async (req, res) => {

  const { Subject, driverName, Notes, fileUrl } = req.body;
  console.log(req.body);
  try {


    const mailOptions = {
      // from: '"hampton" <Delivery.note@hampton.co.uk>',
      // to: "Delivery.note@hampton.co.uk",
      subject: Subject,
      html: ` 
          <ul>
              <li><strong>Drive Name:</strong> ${driverName}</li>
              <li><strong>Notes:</strong> ${Notes}</li>
              <li><img src="${fileUrl}" alt="Attached Image" style="max-width: 100%; height: auto;" /></li>
              <li><a href="${fileUrl}" target="_blank">Open File Externally</a></li>
          </ul>
      `
    };


    const info = await transporter.sendMail(mailOptions);
    console.log("Message Sent status: " + info.messageId);
    res.status(200).json({ message: 'Email Sent Successfully',  });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to Send Email', error: error.message});
  }
});



app.get('/', async (req, res) => {
  res.json({ message: 'server is running' })
})
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});




