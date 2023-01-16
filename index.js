const express = require('express')
const path = require('path');
const nunjucks = require('nunjucks');
const app = express();
const port = 3000;

app.set('views', './views');

app.get('/', (request, response) => {
    response.render('index.njk');
});

app.get('/page1', (request, response) => {
    response.render('index.njk');
  });

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})