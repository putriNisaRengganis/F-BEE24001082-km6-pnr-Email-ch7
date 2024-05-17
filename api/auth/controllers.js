const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const i0 = require('../../libs/socket');
const { JWT_SECRET } = process.env;
//const Sentry = require('../libs/sentry');
const { sendMail } = require('../helper/mailer');
const { saveNewNotif } = require('../notification/controllers');

const register = async (req, res, next) => {
    try {
        const { name, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                email: email
            }
        });

        //make notification using socket.io
        await saveNewNotif('New user registered!', user.id);

        i0.emit('notification', {
            message: 'New user registered!',
            data: user
        });

        res.json({
            status: true,
            message: 'User registered!',
            data: user
        });
    } catch (error) {
        next(error);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.json({
                status: false,
                message: 'User not found!'
            });
        }
        // generate token using user id and email and hash it using crypto
        const token = crypto.createHash('sha256').update(user.id + user.email).digest('hex');

        // save token to user
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                resetPasswordToken: token
            }
        });

        // send email
        await sendMail(email, 'Reset Password', `Click this link to reset your password: http://localhost:3000/reset-password?token=${token}`);
        res.json({
            status: true,
            message: 'Token sent to your email!'
        });
    } catch (error) {
        next(error);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token
            }
        });

        if (!user) {
            return res.json({
                status: false,
                message: 'Invalid token!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hashedPassword,
                resetPasswordToken: null
            }
        });

        //notification
        await saveNewNotif('Password updated!', user.id);

        i0.emit('notification', {
            message: 'Password updated!',
            data: user
        });
        res.json({
            status: true,
            message: 'Password updated!'
        });

    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.json({
                status: false,
                message: 'User not found!'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.json({
                status: false,
                message: 'Invalid password!'
            });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            status: true,
            message: 'Login success!',
            data: {
                id: user.id,
                token
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    forgotPassword,
    resetPassword,
    login
}