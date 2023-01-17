import express, { response } from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
/* const express = require('express')
const path = require('path');
const nunjucks = require('nunjucks'); */
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.set('views', './views');


app.get('/', async (request, response) => {
    const users = await prisma.user.findMany();
    await prisma.$disconnect();
    console.log(users);
    response.render('index.njk', { users });
});

nunjucks.configure('views', {
    autoescape:true,
    express:app
})

app.get('/register', (request, response) => {
    console.log(request.quary)
    response.render('register.njk');
});

app.post('/register', async (request, response) => {
  console.log(request.body);
  const user = await prisma.user.create({
    data: {
      name: request.body.name,
      email: request.body.email,
    },
  });
  await prisma.$disconnect();
  console.log(user)
  response.redirect("/");
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})