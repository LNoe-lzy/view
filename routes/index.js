var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'VIEW',
    user: req.session.user
  });
});

router.post('/signup', function (req, res) {
  User.findOne({
    email: req.body.email
  }, function (err, u) {
    if (u) {
      req.flash('error', '用户已存在!');
      res.redirect('/');
    }
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var passwordRep = req.body.passwordRep;
    var md5 = crypto.createHash('md5');
    if (password !== passwordRep) {
      req.flash('error', '两次输入的密码不一致!');
      res.redirect('/');
    }
    var user = new User({
      name: name,
      password: md5.update(password).digest('hex'),
      email: email
    });
    user.save(function (err) {
      if (err) {
        console.log(err);
      }
      req.session.user = user;
      res.redirect('/');
    });
  });
});

router.post('/signin', function (req, res) {
  var password = crypto.createHash('md5').update(req.body.password).digest('hex');
  User.findOne({
    email: req.body.email
  }, function (err, u) {
    if (err) {
      console.log(err);
    }
    if (!u || u.password !== password) {
      req.flash('error', '用户名或密码错误！');
      res.redirect('/');
    }
    req.session.user = u;
    res.redirect('/');
  })
});

router.get('/logout', function (req, res) {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;
