var express = require('express');
var router = express.Router();
var path = require('path');
var test = require(path.join(__dirname, '../virtual_browser/start'));
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var Client = mongoose.model('Client');
var Event = mongoose.model('Event');
var User = mongoose.model('User');
var passport = require('passport');
var rToken = require('rand-token');

var pending = false;
var pending_ids = [];  //  www_stats queueing

/*
session.users = {
  token1: {admin: true, user_id: User._id},
  token2: {admin: true, user_id: User._id}  
}
 */

//  EACH CLIENT NEEDS TO BE CLASIFIED:
//  + NEVER CHECKED
//  + LATER CONTACT
//  + CHEEP WEBSITE
//  + DONT KNOW HOW TO USE WEBSITE


function Session () {
  var self = this;
  
  this.users = {};
}
Session.prototype.create = function (options) {
  var self = this;
  var def_options = {
    cache: {
      data: [],
      pages: 0
    },
    settings: {
      maxOnPage: 10
    }
  };

  if (!options.username || !options._id || !options.ip || !options.token) {
    throw new Error('Wrong options for Session.create()');
  }

  var token = options.token;

  //  token is session id
  this.users[options.token] = {};
  delete options.token;

  Object.assign(self.users[token], def_options, options);

};
Session.prototype.getUserId = function (token) {
  var _id, self = this;
  try {_id = self.users[token]._id;}
  catch (e) {_id = false;}
  return _id;
};
Session.prototype.getUsername = function (token) {
  var username, self = this;
  try {username = self.users[token].username;}
  catch (e) {username = false;}
  return username;
};
Session.prototype.isAdmin = function (token) {
  var isAdmin, self = this;
  try {isAdmin = self.users[token].admin;}
  catch (e) {isAdmin = false;}
  return isAdmin;
};
//  session instance
var session = new Session();

//  main middleware
router.use(function (req, res, next) {

  var timer;
  function queueing () {  //  blocks every one need to be changed later on
      timer = setTimeout(function () {

        if (pending) {
          clearTimeout(timer);
          return timeout();
        }

        clearTimeout(timer);
        next();

        }, 1000);

        if (pending_ids.length === 0) {
          next();
          return clearTimeout(timer);
        }
  }

  //  get token from path
  var token = req.getToken();

  //  pass only login path if wrong token
  if (!session.users[token]) {
    if (req.url === '/login') {
      return next();
    } else {
      return res.status(401).json({pages: 0, msg: [], data: []});
    }
  }

  //  match IP for token
  if (session.users[token].ip !== req.getRemoteIP()) {
    return res.status(401).json({pages: 0, msg: [], data: []});
  }

  //  pass GET requests
  if (req.method === 'GET') {
    return queueing();
  }

  //  pass POST requests
  if (req.method === 'POST') {
    return queueing();
  }

  //  pass POST requests
  if (req.method === 'DELETE') {
    return queueing();
  }

  //  if else wrong request method
  return res.status(405).json({pages: 0, msg: [], data: []});
});
router.route('/login')

  .post(function (req, res) {

    passport.authenticate('login', function(err, user, info) {

      if (err) { return res.json( {msg: {status: false, token: ''}} ); }
      if (!user) { return res.json( {msg: {status: false, token: ''}} ); }
      req.logIn(user, function(err) {
        if (err) { return res.json( {msg: {status: false, token: ''}} ); }
        var token = rToken.generate(16);
        session.create({
          token: token, 
          username: user.username, 
          _id: user._id, 
          admin: user.admin, 
          ip: req.connection.remoteAddress
        });
        return res.json( {msg: {status: true, token: token}} );
      });
    })(req, res);

  });
router.route('/:token/scrap')

  //  get info about scraping
  .get(function (req, res) {
    return res.send({msg: 'Nothin yet'});
  })

  //  start scaping
  .post(function (req, res) {
  
    var url = req.body.url,
        platform = req.body.platform,
        picture = req.body.picture;

    test(url)
    .settings({platform: platform, picture: picture})
    .done(function (data) {
      res.send({msg: data});
      /*  nodemon enabled - no file changing - test reads output of child process
      fs.readFile(path.join(__dirname, '../browser/data/www.json'), 'utf-8', function (err, data) {
        res.send({msg: data});
      });
      */
    }, function (err) {
      res.send({msg: '404'});
    });

  });

router.route('/:token/session/status')

  .get(function (req, res) {
    var token = req.params.token;

    if (session.users[token]) return res.json({msg: 'ok'});
    return res.json({msg: 'k.o.'});

  });

router.route('/:token/signup')
  .post(function (req, res) {

    if (!session.isAdmin(req.params.token)) return res.status(401).json({msg: 'You need to be Admin'});

    passport.authenticate('signup', function(err, user, info) {

      if (err) { return res.json( {msg: {status: false, token: ''}} ); }
      if (!user) { return res.json( {msg: {status: false, token: ''}} ); }
      req.logIn(user, function(err) {

        if (err) { return res.json( {msg: {status: false, token: ''}} ); }
        return res.json( {msg: {status: true, token: ''}} );

      });
    })(req, res);

  });

  //  1000 lines removed - code sample

module.exports = router;

// global helper functions
function queryGen (query, queryData, isAdmin) {

  if (queryData.city) query.regex('city', new RegExp(queryData.city, 'i'));
  if (queryData.province) query.regex('province', new RegExp(queryData.province, 'i'));
  if (queryData.name) query.regex('name', new RegExp(queryData.name, 'i'));
  if (queryData.www) query.in('www', [new RegExp(queryData.www, 'i')]);
  if (!isAdmin) {
    query.or({'user': {$exists: false}})
  }
  if (queryData.wwwStatistics) {
    console.log('www');
    query.where('wwwStatistics').elemMatch(function (elem) {
      elem.where('rwd').exists(true);
      if (queryData.wwwRwd) {
          elem.where('rwd').equals(false);
      }
    });
  } else {
    query.size('wwwStatistics', 0);
  }
  if (queryData.inProgress) {
    query.where('inProgress', queryData.inProgress);
  }

  return query;

}