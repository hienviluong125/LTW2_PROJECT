require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 4200;

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const writersRouter = require('./routes/writersRouter');


app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');




//================== Routes =================

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/writers',writersRouter);


//===========================================




//================== no exist routes ==================

app.use((req,res,next) => {
    res.render('commons/error404');
})

//===========================================









app.listen(port, () => console.log("connected port " + port));