const express = require('express');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth2");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {db, User} = require('./connect');

const GOOGLE_CLIENT_ID=process.env.GOOGLEID;
const GOOGLE_CLIENT_SECRET=process.env.GOOGLESECRET;
const HOST=process.env.HOST;

let authUser = (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }

//Passport config
passport.use(
    new LocalStrategy((username, password, callback) => {
        User.findOne({email: username})
        .then(user => {
            if(!user) {
                return callback(null, false, {message: "Incorrect username" });
            }
            bcrypt.compare(password, user.password, (err, res) => {                
                if (res) {;
                    return callback(null, user);
                } else {
                    // passwords do not match!
                    return callback(null, false, { message: "Incorrect password" });
                }
              })
        })
        .catch(err=> {
            console.error('error loging in');
            return callback(err);
        });

    })
);

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: HOST+"/auth/google/callback",
    passReqToCallback   : true
    }, authUser),
);

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, {id: user.id, email: user.username, firstname:user.firstname, lastname:user.lastname, admin:user.admin});
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});