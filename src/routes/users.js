const express = require('express');
const router = express.Router();
const { code2Session } = require('../middleware/request');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title: '2333'});
});

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
router.get('/login', (req, res) => {
  const { code } = req.query;
  code2Session(code, (error, response, data) => {
    console.log(data)
  });
  res.send(req.query.code.toString())
});

module.exports = router;
