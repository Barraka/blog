require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

/* POST login. */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Something is not right',
                user : user
            });
        }

    req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }

    // generate a signed son web token with the contents of user object and return it in the response

    const token = jwt.sign(user, process.env.SECRETKEY);
            return res.json({user, token});
            });
        })(req, res);
});