import module = require("module");
import utils = require("../common/util");
import mongo = require("../services/mongo.service");
import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import  email = require("../services/email.service");

@Controller("user")
export class UserController {


  @Post("/send-otp")
  async searchInvoices() {
    try {
      // Generate a random 4-digit number (you can customize the length)
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * digits.length)];

    // Example usage
const recipientEmail = 'a.b.ameerdeen@gmail.com';
const subject = 'Test Email from Node.js';
const text = 'This is a plain text email sent from Node.js.';
const html = `
  <p>This is an <b>HTML</b> email sent from Node.js.</p>
`;

email.sendEmail(recipientEmail, subject, text, html)
  .then(() => console.log('Email sent!'))
  .catch((error) => console.error(error));
  }
    } catch (error) {
      utils.log(error)
    }
  }
}