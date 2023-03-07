const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {db, User} = require('./connect');
require('./passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors =require('cors');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const session = require("express-session");

//Get env variables:
const key=process.env.SECRETKEY;
const HOST=process.env.HOST;


//Run app
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: key, store: new MongoStore({
    mongoUrl: process.env.MONGODB,
    secret: key,
}), cookie: { maxAge: 864000000 }, rolling: true, resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.get('/blogs', getToken, async (req, res) => {
    jwt.verify(req.token, key, (err, authData) => {
        if(err)res.json({error:err});
        else {
            res.json(authData);
            //Send the blog posts
        }
    });
});
app.post('/signup', checkSignup, createToken, (req, res) => {
    console.log('after signup, token: ', req.token);
});
// app.post('/login', checkSignup, createToken, (req, res) => {
//     jwt.sign({user: user}, key, {expiresIn: '10 days'}, (err, token) => {
//         res.json({token: token});
//     });
// });

// app.post('/login', (req,res) => {
//     console.log('login demanded');
// });
app.get('/login', getToken, (req,res)=> {
    jwt.verify(req.token, key, (err, authData) => {
        if(err)res.json({error:err});
        else {
            req.session.user=req.user;
            res.json(authData);
        }
    });
});
app.get('/auth/google/callback', (req, res) => {
    console.log('got a req after google auth');
});
app.post('/login', handleLogin, passport.authenticate('local', {
    // failureRedirect: '/oops',
    failureMessage: true,
    }),
    (req, res, next) => {
        console.log('in login request');
        // req.session.user=req.user;
        // res.redirect('/');
        jwt.sign({user: req.user}, key, {expiresIn: '10 days'}, (err, token) => {
            res.json({token: token});
        });
    }
);

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ]
}));
app.get('/auth/google/callback', passport.authenticate( 'google', {
   successRedirect: '/dashboard',
   failureRedirect: '/login'
}));
app.get('/dashboard', checkAuthenticated, (req, res) => {
    console.log('in dashboard get');
});

//----Helper functions

function checkAuthenticated(req,res,next) {
    if(req.isAuthenticated())next();
    console.log('not authenticated');
}

function getToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.json({error: "no token found"});
    }
}

function handleLogin(req, res, next) {
    req.body.username=req.body.email;
    console.log('body: ', req.body);
    
    next();
}


async function checkSignup(req, res, next) {
    console.log('body: ', req.body);
    const isTaken = await User.findOne({username: req.body.email}).exec();
    if(isTaken) {
        res.json({error: "email already in use"});
    } else {
        bcrypt.hash(req.body.password, 10, async (err, hashed) => {
            if(err) {
                console.error('error');
                return next(err);
            }
            const user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.email,
                password: hashed,
                admin: false,
            }).save()
            .then(user=> {
                console.log('user after signup: ', user);
                // req.session.user=user;
                req.user=user;
                next();
            });
        });            
        }
}

function createToken(req, res, next) {
    jwt.sign({user: req.user}, key, {expiresIn: '10 days'}, (err, token) => {
        res.json({token: token});
 }); 
}




//----------------------------------------------
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
//----
module.exports = app;
