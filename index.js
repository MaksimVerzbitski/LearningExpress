//const express = require('express');
//const nunjucks = require('nunjucks');
//const path = require('path');
import express from 'express';
import nunjucks from 'nunjucks';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.static('public'));
app.set('views', './views');
//app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

import flashMessages from './src/middlewares/FlashMessages.js';
app.use(flashMessages);

// routing
import publicRoutes from './src/controllers/PublicController.js';

app.use('/', publicRoutes);


import authRoutes from './src/controllers/AuthController.js';

app.use('/', authRoutes);

// middleware after
import clearFlashMessages from './src/middlewares/ClearFlashMessages.js';
app.use(clearFlashMessages);

app.listen(process.env.PORT, () => {
  console.log(`Example app running on http://localhost:${process.env.PORT}`);
});