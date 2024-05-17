const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newActiveUser = async () => {
    try {
        const ActiveSession = await prisma.activeSession.create({
            data: {}
        });

        res.json({
            status: true,
            message: 'User created!',
            data: ActiveSession
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    newActiveUser
}