const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

// a function - to send email

async function sendVerificationEmail(email, otp) {
  // send the mail
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from CodeEmpower",
      emailTemplate(otp)
    );

    console.log("Email sent Successfully:", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending mails:", error);
    throw error;
  }
}

// define a post- save hook to send email after the cocument has been saved

OTPSchema.pre("save", async function (next) {
  console.log("New document saved to database");
  // only send an email when  a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});


const OTP= mongoose.model("OTP", OTPSchema);

module.exports = OTP;
