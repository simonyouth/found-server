const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title: '2333'});
});

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
router.get('/login', (req, res) => {
  console.log(req)
  res.send(req.query.code.toString())
});

module.exports = router;
