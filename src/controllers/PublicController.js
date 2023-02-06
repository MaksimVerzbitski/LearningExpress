import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
    const users = await prisma.user.findMany();
    await prisma.$disconnect();
    res.render('index.njk', { users });
    next();
});
 
export default router;