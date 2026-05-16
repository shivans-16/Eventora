const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Use explicit SMTP config instead of 'service: gmail'
// This works reliably in production (Render, Railway, etc.)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // Must be Gmail App Password (not your login password)
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter on startup (optional, helps debug)
transporter.verify((error) => {
    if (error) {
        console.error('Email transporter error:', error.message);
    } else {
        console.log('Email server is ready');
    }
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
        <h2>Hi ${userName}!</h2>
        <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
        <p>Thank you for choosing Eventora.</p>
      `
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', userEmail);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your Eventora Account' : 'Eventora Booking Verification';
        const msg = type === 'account_verification'
            ? 'Please use the following OTP to verify your new Eventora account.'
            : 'Please use the following OTP to verify and confirm your event booking.';

        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email:', error.message);
        throw error; // Re-throw so controller can handle it
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };
