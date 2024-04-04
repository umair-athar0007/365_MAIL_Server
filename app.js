const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const PORT = process.env.PORT | 9000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: "Delivery.note@hampton.co.uk",
    pass: "Deliveries769?!%"
  }

});





app.post('/api/send_email', async (req, res) => {

  const { Subject, Message, email } = req.body;
  console.log(req.body);
  try {
    if (!Message || !Message) {
      return res.status(400).json({ message: "Invalid Email Body Parameters" })
    }

    const mailOptions = {
      from: '"hampton" <Delivery.note@hampton.co.uk>',
      to: email,
      subject: Subject,
      html: ` 
    <p>${Message}</p>
   `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message Sent status: " + info.messageId);
    res.status(200).json({ message: 'Email Senf Successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to Send Email' });
  }
});



app.get('/', async (req, res) => {
  res.json({ message: 'server is running' })
})
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});




