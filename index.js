import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import { PrismaClient } from '@prisma/client'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env);

const prisma = new PrismaClient();
const app = express();
const port = 3000;


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

console.log(env, app.settings.nunjucks);
import FlashMessages from './src/middlewares/FlashMessages.js';
app.use((req,res,next) =>FlashMessages(req,res,next,env));

env.addGlobal('hello', 'Adding Global');




// routing
import publicRoutes from './src/controllers/PublicController.js';
app.use(publicRoutes);
 
// middleware after
import ClearFlashMessages from './src/middlewares/ClearFlashMessages.js';
app.use(ClearFlashMessages);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});