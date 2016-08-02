var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  clients: [mongoose.Schema.Types.Mixed],
  events: [mongoose.Schema.Types.Mixed],
  settings: Object,
  admin: {type: Boolean, default: false},
  created_at: {type: Date, default: Date.now}
});

var clientSchema = new mongoose.Schema({
  name: String,
  category: [],
  address: String,
  city: String,
  province: String,
  user: String,
  phone: [mongoose.Schema.Types.Mixed],
  phoned: Boolean,
  nextContact: mongoose.Schema.Types.Mixed,
  inProgress: Boolean,
  interested: Boolean,
  done: Boolean,
  infoMsg: String,
  graphicalProject: Boolean,
  emails: [mongoose.Schema.Types.Mixed],
  www: [mongoose.Schema.Types.Mixed],
  wwwStatistics: [mongoose.Schema.Types.Mixed]
});

clientSchema.statics.findByIds = function (ids, done) {
  var toSend = [];
  var o = this;
  function getDocById (done) {

    if (!getDocById.cache) getDocById.cache = ids;
    var id = getDocById.cache[getDocById.cache.length- 1];
    getDocById.cache.pop();
    o.findById(id, function (err, doc) {

      if (err) {
        if (!getDocById.cache.length) return done(toSend);
        getDocById(done);
        return;
      }
      toSend.push(doc);
      if (!getDocById.cache.length) return done(toSend);
      getDocById(done);

    });

  }
  return getDocById(done);
};  //  }  .findByIds ()

var eventSchema = new mongoose.Schema({
  clientId: mongoose.Schema.Types.ObjectId,
  clientData: mongoose.Schema.Types.Mixed,
  userId: mongoose.Schema.Types.ObjectId,
  done: { type: Boolean, default: false },
  date: Date,
  msg: String
});
eventSchema.statics.findEventsByDate = function (params, done) {
  var self = this;
  var events = [];
  var query = {};

  if (!params.isAdmin) {
    query.userId = params.userId;
  }

  self.find(query, function (err, docs) {
    if (err) return done(events);

    docs.forEach(function (doc) {
      if (doc) {

        var date = new Date(doc.date);
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();

        if (year == params.year && month == params.month) {
          if (day == params.day || day == (parseInt(params.day) + 1)) {
            events.push(doc);
          }
        }

      }
    });

    done(events);

  });

};
eventSchema.statics.updateEvent = function (params, newOne, done) {
  if (!params || !params.id) return false;

  var def_params = {
    id: '',
    date: ''
  };

  Object.assign(def_params, params);
  var self = this;
  var options = { upsert: true, new: true, setDefaultsOnInsert: true };

  self.findOneAndUpdate({clientId: def_params.id}, options, function (err, doc) {

    if (err) return false;

    if (!doc) return newOne(def_params);

    doc.clientId = def_params.id;
    doc.date = def_params.date;
    doc.save();

    if (typeof done === 'function') done(doc);
    
  });

  return;
};

eventSchema.statics.removeEvent = function (clientId, done) {
  var self = this;
  self.find({clientId: clientId}).remove(done);

  return;

};

var pendingClientSchema = new mongoose.Schema({
  name: String,
  category: [],
  address: String,
  city: String,
  province: String,
  phone: [mongoose.Schema.Types.Mixed],
  phoneContact: Date,
  nextContact: Date,
  interested: Boolean,
  graphicalProject: Boolean,
  emails: [mongoose.Schema.Types.Mixed],
  www: [mongoose.Schema.Types.Mixed],
  wwwStatistics: [mongoose.Schema.Types.Mixed]
});

var doneClientSchema = new mongoose.Schema({
  name: String,
  category: [],
  address: String,
  city: String,
  province: String,
  phone: [mongoose.Schema.Types.Mixed],
  phoneContact: Date,
  nextContact: Date,
  interested: Boolean,
  graphicalProject: Boolean,
  emails: [mongoose.Schema.Types.Mixed],
  www: [mongoose.Schema.Types.Mixed],
  wwwStatistics: [mongoose.Schema.Types.Mixed]
});

mongoose.model('User', userSchema);
mongoose.model('Client', clientSchema);
mongoose.model('Event', eventSchema);

mongoose.model('PendingClient', pendingClientSchema);
mongoose.model('DoneClient', doneClientSchema);
