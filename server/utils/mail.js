import transporter from "../config/nodemailer.js"
import "dotenv/config";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js'

export const sendWelcomeMail = async (email) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome to auth',
        text: `Welcome to auth website. Your account has been create with email id ${email}`,
    } 

    await transporter.sendMail(mailOptions);
}

export const sendOtpVerifyMail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Account Verifification OTP',
        // text: `Your OTP is ${otp}. Verify you account using OTP`,
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", email)
    } 

    await transporter.sendMail(mailOptions);
}

export const sendResetOtpMail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Password Reset Otp',
        // text: `Password Reset Otp ${otp}`,
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", email)
    } 

    await transporter.sendMail(mailOptions);
}

