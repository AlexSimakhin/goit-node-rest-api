import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { UKRNET_USER, UKRNET_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKRNET_USER,
    pass: UKRNET_PASS,
  },
});

export async function sendVerificationEmail({ to, token }) {
  const verifyUrl = `${process.env.BASE_URL}/auth/verify/${token}`;
  const mailOptions = {
    from: UKRNET_USER,
    to,
    subject: 'Verify your email',
    html: `<p>To verify your email, click <a href="${verifyUrl}">here</a></p>`,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${to}:`, error);
    throw error;
  }
}
