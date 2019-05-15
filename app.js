require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 4200;
const session = require('express-session');
const passport = require('passport');
//Passport config
// const multer = require('multer');
require('./config/passport-local')(passport);
const flash = require('connect-flash');
const upload = require('./helpers/uploader');


app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

app.use(require('./middlewares/users/local-auth').registerStatus);





const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const postsRouter = require('./routes/postsRouter');
const writersRouter = require('./routes/writersRouter');
const editorsRouter = require('./routes/editorsRouter');
const subscriberRouter = require('./routes/subscriberRouter');

//================End Routes require =================









//================== Routes =================

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts',postsRouter);
app.use('/writers',writersRouter);
app.use('/editors',editorsRouter);
app.use('/subscribers', subscriberRouter);

//================ End Routes =================


//================ Error pages =================

app.use((req,res)=>{
    res.render('commons/error404');
})

//============== End Error pages =============


app.listen(port, () => console.log("connected port " + port));