const router = require('express').Router();
const usersService = require('./../services/usersService');

const renderLoginPage = (req,res,next) => {
    res.render('users/login');
}

const renderRegisterPage = (req,res,next) => {
    res.render('users/register');
}

const registerAccount = async (req, res, next) => {
    let user = {email, password, repassword} = req.body;

    let errors = await usersService.validateRegisterData(email, password, repassword, next);
    
    if(errors.length > 0){
        res.render('users/register', {
            errors,
            email,
            
        });
    }else{
        usersService.create(user)
        .then(user =>{
            
            console.log("user created");
            //create session
            
            //redirect to main paged
            res.end("created, redirecting to main page...");
        })
        .catch(err => next(err));
    }
}


router.get('/register',renderRegisterPage);
router.get('/login',renderLoginPage);
router.post('/register', registerAccount);

module.exports = router;