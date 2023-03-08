const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {db, User, Blogpost} = require('./connect');
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

// app.get('/blogs', getToken, async (req, res) => {
//     jwt.verify(req.token, key, (err, authData) => {
//         if(err)res.json({error:err});
//         else {
//             res.json(authData);
//             //Send the blog posts
//         }
//     });
// });
app.get('/blog', (req, res, next) => {
    Blogpost.find()
    .then(blogs=> {
        res.json(blogs);
    })
    .catch(e=> {
        console.log('error getting blogs: ', e);
    });
});
app.post('/blog', getToken, checkToken,(req, res, next) => {
    const blogpost = new Blogpost({
        email: req.body.email,
        author: req.body.author,
        title: req.body.title,
        text: req.body.text,
        publish: req.body.publish,
        timestamp: new Date(),
    }).save()
    .then(data=> {
        console.log('data after post: ', data);
        res.json({message: "success"});
    })
    .catch(e=> {
        console.error('error in Blogpost: ', e);
    });

    // res.json({message: 'hh'});
});

app.post('/signup', checkSignup, createToken, (req, res) => {
    console.log('after signup, token: ', req.token);
});

app.get('/login', getToken, (req,res)=> {
    jwt.verify(req.token, key, (err, authData) => {
        if(err)res.json({error:err});
        else {
            req.session.user=authData.user;
            delete authData.user.password
            res.json(authData.user);
        }
    });
});
app.get('/auth/google/callback', (req, res) => {
    console.log('got a req after google auth');
});
app.get('/loginError', (req, res) => {
    console.log('login error');
    res.json({error: "Login unsuccessful"});
});
app.post('/login', handleLogin, passport.authenticate('local', {
    failureRedirect: '/loginError',
    failureMessage: true,
    }),
    (req, res, next) => {
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
    
});

//----Helper functions
function checkToken(req, res, next) {
    jwt.verify(req.token, key, (err, authData) => {
        if(err)res.json({error:err});
        next();
    });
}

function checkAuthenticated(req,res,next) {
    if(req.isAuthenticated())next();
    
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
    next();
}

async function checkSignup(req, res, next) {
    const isTaken = await User.findOne({username: req.body.email}).exec();
    if(isTaken) {
        res.json({
            emailTaken: true,
        });
    } else {
        bcrypt.hash(req.body.password, 10, async (err, hashed) => {
            if(err) {
                console.error('error');
                return next(err);
            }
            const user = new User({
                email: req.body.email,
                username: req.body.username,
                password: hashed,
                admin: false,
            }).save()
            .then(user=> {
                req.user=user;
                next();
            })
            .catch(e=> {
                res.json({error: "Wrong format"});
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
    res.json({error: err});
    // res.render('error');
});
//----
module.exports = app;
