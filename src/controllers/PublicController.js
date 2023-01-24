import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


router.get('/', async (req, res,next) => {
  const users = await prisma.user.findMany();
  await prisma.$disconnect()
  console.log(users);
  console.log('request');
  console.log(req.session);
  res.render('index.njk', { users});
  next();
});

router.get('/register', (req, res) => {
    console.log(req.query);
    res.render('register.njk');
    req.session.error = null;
});

router.post('/register', async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });
    await prisma.$disconnect();
    console.log(user)
    req.session.message = "User Created successfully";
    res.redirect('/')
  } catch(e) {
    console.log(e.meta.target);
    let error = {
      message: e.message.match(/Unique constraint failed on the fields: \(`\w+`\)/g),
      field: e.meta.target
    }
    if(error.message){
      req.session.error = error;
      req.session.save();
    }
    res.redirect('/register')
  }
  next();
  
});

router.use((req,res,next)=>{
  next();
  console.log('Middleware ....');
  if(req.method == 'GET'){
    req.session.message = null;
    req.session.error = null;
    req.session.save();
  }
  console.log('middleware message');
  console.log(req.session);
})





export default router;