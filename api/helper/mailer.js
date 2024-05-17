const mailer = require('nodemailer');
const { MAILER_EMAIL, MAILER_PASSWORD } = process.env;

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAILER_EMAIL,
        pass: MAILER_PASSWORD
    }
});

const sendMail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: MAILER_EMAIL,
            to,
            subject,
            text
        });
        return info;
    } catch (error) {
        throw error;
    }
}

module.exports = { sendMail };