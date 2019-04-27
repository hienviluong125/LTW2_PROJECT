const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./../models/index').Users;

module.exports = function(passport){
    passport.use(
        new localStrategy({
            usernameField: 'email'
        },
        (email, password, done) => {
            User.findOne({
                raw: true,
                where: {email}
            })
            .then(user => {
                if(!user){
                    done(null, false, {message: "User is not registered."});
                }
                bcrypt.compare(password, user.password)
                .then(result => {
                    if(result == true){
                        done(null, user);
                    }else{
                        done(null, false, {'message':'Password incorrect.'});
                    }
                })
                .catch(err => {
                    throw err;
                })
            })
            .catch(err => {
                throw err;
            });
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findByPk(+id).then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err, user);
        });
      });
};