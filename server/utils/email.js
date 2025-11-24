const nodEmailer = require('nodemailer');
const dotEnv = require('dotenv');

dotEnv.config();

const transPorter = nodEmailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// send notification to email
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transPorter.sendMail({
            from: `<h1>chatbook</h1>`,
            to,
            subject,
            html,
        });

        console.log(`Email succsesfully to ${to}: ${info.messageId}`);
    } catch (err) {
        console.log(`Err sending Email: ${err}`);
        throw err;
    }
};

module.exports = sendEmail;
