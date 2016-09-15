const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const StatsService = {
  _dbInstance: null,
  _stats: {},
  db: function(cb) {
    if (this._dbInstance !== null) return cb(null, this._dbInstance);
    MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost/doorbuzz' , (err, db) => {
      if (err) {
        return cb(err);
      }
      this._dbInstance = db;
      cb(null, db);
    });
  },
  record: function(name, cb) {
    this.db( (err, db) => {
      if (err) {
        return cb ? cb(err) : false;
      }
      db.collection('events').insert(
        {
          name: name,
          at: new Date()
        },
        function(err, result) {
          if (err) {
            return cb ? cb(err) : false;
          }
          return cb ? cb(null, result) : false;
        }
      );
    });
  },
  count: function(name, cb) {
    this.db( (err, db) => {
      if (err) {
        return cb(err);
      }
      db.collection('events').count({name: name}, (err, result) => {
        if (err) {
          return cb(err);
        }
        return cb(null, result);
      });
    });
  },
  table: function(cb) {
    this.db( (err, db) => {
      if (err) {
        return cb(err);
      }
      db.collection('events').aggregate([
        {$group: { _id: '$name', count: { $sum: 1 } } }
      ], function(err, results) {
        if (err) {
          return cb(err);
        }
        cb(null, results.reduce(function(o, item) {
          o[item._id] = item.count;
          return o;
        }, {}));
      });
    });
  }
};

module.exports = StatsService;
