const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./../models/index').Users;

module.exports = function (passport) {
    passport.use(
        new localStrategy({
            usernameField: 'email'
        },
            (email, password, done) => {
                User.findOne({
                    raw: true,
                    where: { email }
                })
                    .then(user => {
                        if (user === null) {
                            done(null, false, { message: "User is not registered." });

                        } else {
                            bcrypt.compare(password, user.password)
                                .then(result => {
                                    if (result == true) {
                                        done(null, user);
                                    } else {
                                        done(null, false, { 'message': 'Password incorrect.' });
                                    }
                                })
                                .catch(err => {
                                    throw err;
                                })
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            })
    );
    passport.serializeUser((user, done) => {
        done(null, { id: user.id, email: user.email });
    });

    passport.deserializeUser((user, done) => {
        User.findByPk(+user.id).then(returnUser => {
            // done(null, returnUser);
            //hien edit
            let { username, email, role } = returnUser;
            done(null, { username, email, role });
            //end hien edit
        })
        .catch(err => {
            done(err, user);
        });
    });
};