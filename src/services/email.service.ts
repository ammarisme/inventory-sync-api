const nodemailer = require('nodemailer');

async function sendEmail(recipientEmail, subject, text, html) {
    // Configure email transporter using OAuth2 authentication (recommended for Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'team.catlitter@gmail.com',
        pass: 'catlitter@1234', // **Not recommended for production!** (Use access tokens instead)
      },
    });

    // Email content
    const mailOptions = {
      from: 'Team Catlitter<team.catlitter@gmail.com>',
      to: recipientEmail,
      subject,
      text, // Plain text version of the email
      html, // HTML version of the email (optional)
    };
  
    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully: ${info.response}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  export = {
    sendEmail
  }