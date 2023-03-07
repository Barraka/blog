require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

router.post('/login', (req, res, next) => {
    res.render('index', { title: 'Express' });
});
  
module.exports = router;