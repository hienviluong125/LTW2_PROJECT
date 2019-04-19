const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./../models/index').Users;

module.export = function(passport){
    passport.use(
        new localStrategy(
        (username, password, done) => {
            User.findOne({
                raw: true,
                where: {username}
            })
            .then(user => {
                if(!user){
                    done(null, false, {message: "Username already taken."});
                }
            })
            .catch(err => done(err, false));
        })
    )
};