const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

app.post('/send-alert', async (req, res) => {
  const { name, contactNumber, userLocation } = req.body;

  const message = `🚨 Distress Alert!\n${name} may be in danger.\nLocation: ${userLocation}`;

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: contactNumber,
    });

    res.status(200).json({ message: 'SMS alert sent successfully' });
  } catch (err) {
    console.error("❌ Error sending SMS:", err);
    res.status(500).json({ error: 'Failed to send SMS alert' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚨 Server running on http://localhost:${process.env.PORT}`);
});


    // Send Email
    // await sgMail.send({
    //   to: contactEmail,
    //   from: process.env.FROM_EMAIL,
    //   subject: 'Emergency Alert',
    //   text: message,
    // });

   