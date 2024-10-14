const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const User = require('../models/User');
require('dotenv').config();

// Define UserService
const UserService = {
  async fetchDetails(targetUserId) {
    try {
      // Fetch the user's details, including their email, from the database
      const userInfo = await User.findById(targetUserId);
      console.log(userInfo);

      if (!userInfo) {
        return null;
      }

      return {
        id: userInfo._id,
        email: userInfo.email,
        // Add other user details as needed
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  }
};

async function sendInterestEmail(targetUserId) {
  const userDetails = await UserService.fetchDetails(targetUserId);
  console.log(userDetails);

  // Logic to send an email to the target user
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    }
  });

  let MailGenerator = new Mailgen({
    theme: "default",
    product : {
      name: "Mailgen",
      link:'https://mailgen.js/'
    }
  });

  let response = {
    body: {
      name: "Skillswap Team", 
      intro: "New Invitation!",
      table: {
          data:[
            {
              item : "Skillswap invitation Record",
              description :'Hello! Someone expressed interest in your profile. Check it out!',
            }
          ]
      },
      action: {
        button : {
          color: '#8E5D95', // Optional action button color
          text: 'Click to Check',
          link: 'http://localhost:3000/'
        },
      },
      outro: "Looking forward to join soon!"
    }
  }
  const mail = MailGenerator.generate(response);

  const mailOptions = {
    from: process.env.EMAIL,
    to: userDetails.email,
    subject: 'Someone expressed interest in your profile',
    html: mail
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

module.exports = { sendInterestEmail };