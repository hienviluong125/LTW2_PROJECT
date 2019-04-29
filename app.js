require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 4200;
const session = require('express-session');
const passport = require('passport');
//Passport config
require('./config/passport-local')(passport);
const flash = require('connect-flash');

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use(session({
     secret: 'hmmm', cookie: { maxAge: 3600000 },
     resave:true,
     saveUninitialized:true
    }
));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



//================== Routes =================

app.use('/', indexRouter);
app.use('/users', usersRouter);


//===========================================




//================== no exist routes ==================

app.use((req,res,next) => {
    res.render('commons/error404');
})

//===========================================









app.listen(port, () => console.log("connected port " + port));