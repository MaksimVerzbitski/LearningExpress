//const express = require('express');
//const nunjucks = require('nunjucks');
//const path = require('path');
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { PrismaClient } from '@prisma/client'
import session from 'express-session';
import cookieParser from 'cookie-parser';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.set('views', './views');
//app.set('trust proxy', 1);

app.use(session({
  secret: 'keyboard cat',
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(async (req,res,next) => {
  await next();
  req.session.message = null;
  req.session.error = null;
  req.session.save();
  console.log(req.session);
  
});

app.get('/', async (request, response) => {
  const users = await prisma.user.findMany();
  await prisma.$disconnect()
  console.log(users);
  response.render('index.njk', { users });
});

app.get('/register', (request, response) => {
    console.log(request.query);
    response.render('register.njk', {error: request.session.error});
    request.session.error = null;
});

app.post('/register', async (request, response) => {
  console.log(request.body);
  try {
    const user = await prisma.user.create({
      data: {
        name: request.body.name,
        email: request.body.email,
      },
    });
    await prisma.$disconnect();
    console.log(user)
    req.session.message = "User Created successfully";
    response.redirect('/')
  } catch(e) {
    console.log(e.meta.target);
    let error = {
      message: e.message.match(/Unique constraint failed on the fields: \(`\w+`\)/g),
      field: e.meta.target
    }
    if(error.message){
      request.session.error = error;
    }
    response.redirect('/register')
  }
  
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});