var express = require('express');
var router = express.Router();
var test = require('./browser/start');
var mongoose = require('mongoose');

var exec = require('child_process').exec;
var path = require('path');
var app_path = path.join(__dirname, 'reboot.js');

var Client;
var status_server = {
  pending: false
};
var RS = {
  onStop: function RSonStop () {

  },
  stop: function RSstop () {
    status_server.pending = false;
    RS.onStop();
  }
};

router.use(function router_use (req, res, next) {
  if (req.method === 'GET') {
    if (!Client) Client = mongoose.model('Client');
    return next();
  }
  if (req.method === 'POST') {
    return next();
  }
  res.json({msg: 'WRONG METHOD', data: null});
});

router.route('/configure/:command/:params')

  .get(function router_configure (req, res) {

    var command = req.params.command,
        params = req.params.params;

    switch (command) {
      case 'mongo':
        if (GLOBAL.dbcs) {
          return res.json({msg: 'Allready connected to mongoDB'});
        }
        var mongo_params = params.split(':');
        params = {
          address: mongo_params[0],
          port: mongo_params[1]
        };
        GLOBAL._address = 'mongodb://' + params.address + ':' + params.port;
        res.json({msg: 'Set mongoDB address to: '+ GLOBAL._address});
        break;
    
      default:
        res.json({msg: 'Pass url / :commad / :params'});
        break;
    }

  });

var all_done, s_status;

router.route('/status/:action')

  .get(function router_status (req, res) {

    var status = req.params.action;

    switch (status) {
      case 'start':
        if (status_server.pending) {
          return res.json({msg: 'Server pending. Stop action first.'});
        }
        status_server.pending = false;
        res.json({msg: 'Server ready to action.'});
        break;

      case 'stop':
        if (status_server.pending) {
          status_server.pending = false;
          RS.onStop = function RSonStopOverwrite () {
            res.json({msg: 'Server action stoped.'});
          };
          return;
        }
        status_server.pending = false;
        res.json({msg: 'Server action stoped allready.'});
        break;

      case 'check':
        if (status_server.pending) {
          return res.json(
            {
              msg: 'Server action pending.',
              data: {
                db_status: GLOBAL.dbcs ? 'connected' : 'not connected',
                db_address: GLOBAL._address ? GLOBAL._address : 'default',
                www_checked: all_done,
                www_curent: s_status.current_www,
                check_query: s_status.province
              }
            });
        }
        res.json(
          {
            msg: 'Server ready to action.', 
            data: {
              db_status: GLOBAL.dbcs ? 'connected' : 'not connected',
              db_address: GLOBAL._address ? GLOBAL._address : 'default'
            }
          });
        break;

      case 'reboot':
        if (status_server.pending) {
          status_server.pending = false;
          RS.onStop = function RSonStopOverwrite () {
            res.json({msg: 'Action stoped. Rebooting now...'});
          };
          exec('node '+ app_path);
          setTimeout(function () {
            process.exit();
          }, 3000);
          return;
        }
        status_server.pending = false;
        res.json({msg: 'No Actions Rebooting now...'});
        
        exec('node '+ app_path);
        setTimeout(function () {
          process.exit();
        }, 3000);
        break;

      case 'shutdown':
        if (status_server.pending) {
          status_server.pending = false;
          RS.onStop = function RSonStopOverwrite () {
            res.json({msg: 'shutting down...'});
          };

          setTimeout(function () {
            process.exit();
          }, 3000);
          return;
        }
        status_server.pending = false;
        res.json({msg: 'shutting down...'});
        
        setTimeout(function () {
          process.exit();
        }, 3000);
        break;
    
      default:
        res.json({msg: 'Pass one off these parameters: [start, stop, check, reboot, shutdown]'});
        break;
    }

  });

router.route('/clone/dbs')

  .get(function router_test_dbs(req, res) {

    var db = require('./db.js');

    var LocalClient = db.localClient;
    var RemoteClient = db.remoteClient;

    var counter = {
      saved : 0,
      rerr: 0,
      serr: 0
    };
    var removed = false;

    res.json({msg: 'done'});

    var stream = LocalClient.find().stream();
    stream.on('data', function (doc) {

      stream.pause();

      var ndoc = doc.toJSON();
      
      try {
        if (ndoc._id) delete ndoc._id;
      } catch (e) {

      }

      try {
        if (ndoc.__v) delete ndoc.__v;
      } catch (e) {

      }

      try {
        if (ndoc.category) {
          for (var i = 0, l = ndoc.category.length; i < l; i++) {
            ndoc.category[i] = ndoc.category[i].trim();
          }
        }
      } catch (e) {

      }

      if (counter.saved % 1000 === 0) console.log('Saved: '+ counter.saved +' Errors:  Read error: '+ counter.rerr +' Save error: '+ counter.serr +' Removed: '+ removed);

      var rc = new RemoteClient();

      Object.assign(rc, ndoc);

      rc.save(function (err, doc) {

        if (!err) {
          counter.saved++;
          stream.resume();
          return;
        }
        counter.serr++;
        stream.resume();

      });

    })
    .on('error', function (err) {

      counter.rerr++;
      if (stream.paused) stream.resume();

    })
    .on('end', function (err) {

      console.log('\n\n------------------  done  ----------------------');

    });

  });

router.route('/check/www/by/province/:province')

  .get(function router_check_www (req, res) {

      var province = req.params.province;

      s_status = {
        province: province        
      };

      if (status_server.pending) return res.json({msg: 'Server pending.'});
      status_server.pending = true;
      console.log('started with '+ province);

      all_done = 0;

      wwwChecker(province).request();

  });

  module.exports = router;

  function wwwChecker (province) {

    var self = {};
    var counter = 0;

    self.stop = function wwwChecker_stop () {
      return;
    };

    self.request = function wwwChecker_request () {

      waitForDB();

      var query = Client.findOne({province: province});

      query.size('wwwStatistics', 0);

      query.exec(function mongod_query_exec (err, doc) {
        if (err) {
          waitForDB();
          return;
        }

        if (doc === null) {
          status_server.pending = false;
          console.log('Looks like it\'s all done! \n----------\n '+ JSON.stringify(err));
          return;
        }

        var current_id = doc._id;
        ++counter;
        waitForDB();
        console.log(++all_done +' ->  '+doc.www[0]);
        s_status.current_www = doc.www[0];
        test(doc.www[0])
        .settings({platform: 'phone', picture: 'false'})
        .done(function test_resolved (data) {

          waitForDB();

          Client.update(
            {_id: current_id}, 
            {wwwStatistics: [data]}, 
            {}, 
            function Client_update_cb (e) {

              waitForDB();

              if (e) {
                waitForDB();
                return;
              }
                
              return next();

            });

        }, function test_rejected (err) {

          waitForDB();

          Client.update(
            {_id: current_id}, 
            {wwwStatistics: ['404']}, 
            {}, 
            function Client_update_cb (e) {

              if (e) {
                waitForDB();
                return;
              }
              
              return next();

          });
          

        });

      });

    };

    self.next = function wwwChecke_next () {

      waitForDB();

      if (counter > 200) {
        return wwwChecker(province).request();
      }

      if (!status_server.pending) {
        RS.stop();
        console.log('Server action stoped.');
        return;
      }

      return setImmediate(function () {
        self.request();
      });

    };

    function next () {
      
      return setImmediate(function () {
        self.next();
      });
    }

    function waitForDB () {
      if (!GLOBAL.dbcs) {
        console.log('Lost DB connection.');
        var timer = setTimeout(function () {
          if (!status_server.pending) {
            RS.stop();
            console.log('Server action stoped.');
            return;
          }
          RS.stop();
          clearTimeout(timer);
          
        }, 5000);
        self.stop();
      }
    }

    return self;

  }

