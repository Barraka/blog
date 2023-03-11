const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const {db, User, Blogpost, Comment} = require('./connect');
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

let cacheBlogposts=[];
let cacheUnpublished=[];

//Routes

function authenticate(req, res, next) {
    let bearerToken;    
    const bearerHeader = req.headers['authorization'];    
    if(bearerHeader)bearerToken = bearerHeader.split(' ')[1];
    if(bearerToken) {
        jwt.verify(bearerToken, key, (err, authData) => {
            if(err) {
                console.error('error verifying token: ', err);
            } else {
                req.user=authData;
            }
        });
    }
    next();
}

app.delete('/blog/:id', authenticate, (req, res, next) => {
    const thisid = req.params.id;
    Blogpost.deleteOne({_id:thisid})
    .then(result=>getBlogPosts(res))
    .catch(err=>console.error('error deleting comment: ', err));
});

app.delete('/comment/:id', authenticate, (req, res, next) => {
    const thisid = req.params.id;
    console.log('getting delete for: ', thisid);
    Comment.deleteOne({_id:thisid})
    .then(result=> {
        console.log('delete ok');
        res.sendStatus(200);
    })
    .catch(err=>console.error('error deleting comment: ', err));
});
app.post('/comment', authenticate, (req, res, next) => {
    if(req.user) {
        new Comment({
            author: req.body.author,
            comment: req.body.comment,
            blogId: req.body.blogId,
            timestamp: new Date(),
            _id: req.body._id,
        }).save()
        .then(data=> {
            res.sendStatus(200);
        })
        .catch(e=> {
            console.error('error in Comment: ', e);
        });
    }
});

app.get('/comment', (req, res, next) => {
    Comment.find()
        .then(data=> {
            res.json(data);
        })
        .catch(e=> {
            console.error('error in Comment: ', e);
        });
});

app.post('/updateBlog', authenticate, (req, res, next) => {
    console.log('req.body: ', req.body);
});
app.post('/publish', authenticate, (req, res) => {    
    if(req.user) {
        Blogpost.updateOne({_id:req.body._id}, {publish: true, timestamp: new Date()})
        .then(result => {
            let tempPublished=[...cacheBlogposts];
            let tempUnpublished=[...cacheUnpublished];
            console.log('unpublished before: ', tempUnpublished.length);
            const index = tempUnpublished.findIndex(x=>x._id.valueOf()===req.body._id);
            const removed = tempUnpublished.splice(index, 1)[0];
            removed.timestamp = new Date();
            removed.publish = true;
            tempPublished.push(removed);
            console.log('unpublished after: ', tempUnpublished.length);
            res.json({
                published: tempPublished,
                unpublished: tempUnpublished,   
            });
            cacheBlogposts=[...tempPublished];
            cacheUnpublished=[...tempUnpublished];
        })
        .catch(err=> {
            console.error('error publishing: ', err);
        });
    }
});

app.get('/blog', async (req, res) => {
    if(cacheBlogposts.length)res.json(cacheBlogposts);
    else getBlogPosts(res);
});

app.get('/unpublished', authenticate, (req, res, next) => {
    if(req.user)res.json(cacheUnpublished);
    else next(); 
});

app.post('/blog', getToken, checkToken,(req, res, next) => {
    
    const blogpost = new Blogpost({
        email: req.body.email,
        author: req.body.author,
        title: req.body.title,
        text: req.body.text,
        publish: req.body.publish,
        timestamp: new Date(),
        _id: req.body._id,
    }).save()
    .then(data=> {
        if(data.publish)cacheBlogposts=[...cacheBlogposts, data];
        else cacheUnpublished=[...cacheUnpublished, data];
        res.json(cacheBlogposts);
    })
    .catch(e=> {
        console.error('error in Blogpost: ', e);
    });
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
    console.log('login error: ', req.body);
    res.json({error: "Login unsuccessful"});
});
app.post('/login', handleLogin, passport.authenticate('local', {
    failureRedirect: '/loginError',
    failureMessage: true,
    }),
    (req, res, next) => {
        console.log('trying to sign');
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
function getBlogPosts(res) {
    Blogpost.find()
    .then(blogs=> {
        let tempPublished=[];
        let tempUnpublished=[];
        blogs.forEach(x=> {
            if(x.publish===true)tempPublished.push(x)
            else tempUnpublished.push(x);
        });
        cacheBlogposts=[...tempPublished];
        cacheUnpublished=[...tempUnpublished];
        res.json(cacheBlogposts);
        // return tempPublished;
    })
    .catch(e=> {
        console.error('error getting blogs: ', e);
    });
}

function checkToken(req, res, next) {

    jwt.verify(req.token, key, (err, authData) => {
        if(err) {
            console.error('error verifying token: ', err);
            res.json({error:err});
        }
        else next();
    });
}

function checkAuthenticated(req,res,next) {
    if(req.isAuthenticated())next();
    
}

function getToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];    
    if(bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];
        
        if(bearerToken!=='undefined') {
            req.token = bearerToken;
            next();
        }
        // next();
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
});
//----
module.exports = app;
