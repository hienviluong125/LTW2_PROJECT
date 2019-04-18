require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 4200;
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

//================== Routes require =================

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const postsRouter = require('./routes/postsRouter');
const writersRouter = require('./routes/writersRouter');

//================End Routes require =================









//================== Routes =================

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts',postsRouter);
app.use('/writers',writersRouter);

//================ End Routes =================


//================ Error pages =================

app.use((req,res)=>{
    res.render('commons/error404');
})

//============== End Error pages =============


app.listen(port, () => console.log("connected port " + port));