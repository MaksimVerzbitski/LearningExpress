import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
    const users = await prisma.user.findMany();
    await prisma.$disconnect()
    res.render('index.njk', { users });
    next();
});
 
router.get('/register', (req, res, next) => {
    res.render('register.njk');
    next();
});

router.post('/register', async (req, res, next) => {
    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
            },
        });
        await prisma.$disconnect();
        req.session.message = 'User Created successfully';
        req.session.save();
        res.redirect('/')
    } catch (e) {
        let error = {
            message: e.message.match(/Unique constraint failed on the fields: \(`\w+`\)/g),
            field: e.meta.target
        }
        if (error.message) {
            req.session.error = error;
            req.session.save();
        }
        res.redirect('/register')
    }
    next();
});
export default router;