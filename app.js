require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT;
const exphbs  = require('express-handlebars');
const usersRouter = require('./routes/usersRouter');


app.use(express.urlencoded({extended: true}));

app.engine('.hbs', exphbs({extname: '.hbs',defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.use('/users',usersRouter);



app.listen(port,() => console.log("connected port " + port));