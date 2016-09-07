const PublicGoogleCalendar = require('./gcal');
const moment = require('moment-timezone');
const stats = require('./stats');

const GcalService = {
  events: [],
  last_updated: null,

  // Return the gcal parser
  gcal : function() {
    return this._gcal || new PublicGoogleCalendar(
      { calendarId: process.env.GCAL_ID }
    );
  },

  // Update our data
  update: function(cb) {
    var self = this;

    self.gcal().getEvents(function(err, events) {
      if (err) {
        return cb(err);
      }
      self.events = events;
      self.last_updated = moment.tz();
      stats.increment('gcal_update_count');
      cb(null, events);
    });
  },

  // schedule regular updates
  schedule: function(seconds, cb) {
    if (this._scheduled) {
      clearInterval(this._scheduled);
      this._scheduled = undefined;
    }
    this._scheduled = setInterval(this.update.bind(this), 1000 * seconds, cb);
  },

  // timezone for first event we have, if we have it
  tz: function() {
    if (this.events.length > 0) {
      var e = this.events[0];
      if (e.baseEvent !== undefined) {
        return e.baseEvent.start.tz();
      } else {
        return e.start.tz();
      }
    } else {
      return null;
    }
  },

  // Returns events taking place at this moment in time
  rightNow: function() {
    var tz = this.tz();
    var now = moment.tz(tz);
    var results = [];
    this.events.forEach(function(e) {
      if ( now.isBetween(e.start, e.end) ) {
        results.push(e);
      }
    });
    return results;
  }
};

module.exports = GcalService;
