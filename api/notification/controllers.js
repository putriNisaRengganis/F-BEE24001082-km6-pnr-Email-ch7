const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getNotif= async (req, res) => {
    try {
        const notif = await prisma.notification.findMany();
        return notif;
    } catch (error) {
        return [];
    }
}

const saveNewNotif = async (message, userId) => {
    try {
        const notif = await prisma.notification.create({
            data: {
                message : message,
                userId: userId
            }
        });

        return notif;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    saveNewNotif,
    getNotif
}