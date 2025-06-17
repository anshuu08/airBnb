const express = require('express');
const router = express.Router();

router.get('/facebook', (req, res) => {
  res.render('socials/facebook');
});

router.get('/instagram', (req, res) => {
  res.render('socials/instagram');
});

router.get('/linkedin', (req, res) => {
  res.render('socials/linkedin');
});

module.exports = router;
