const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: false });

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  sendThankYouEmail(email);
  sendTelegramMessage(name, email, message);

  res.send('Form submitted successfully!');
});

function sendThankYouEmail(email) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Thank you for contacting us',
    text: 'We appreciate your message and will get back to you shortly.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

function sendTelegramMessage(name, email, message) {
  const chatId = 'YOUR_CHAT_ID';

  const text = `
    New contact form submission:
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `;

  bot.sendMessage(chatId, text);
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
