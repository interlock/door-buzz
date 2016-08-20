const PublicGoogleCalendar = require('./gcal');
const moment = require('moment-timezone');

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
      self.last_updated = new Date();
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

  // Returns events taking place at this moment in time
  rightNow: function() {
    var results = [];
    this.events.forEach(function(e) {
      if (e.baseEvent !== undefined) {
        let tz = e.baseEvent.start.tz;
      } else {
        let tz = e.start.tz;
      }
      let now = moment.tz(tz);
      let start = moment(e.start);
      let end = moment(e.end);
      if ( now.isBetween(start, end) ) {
        results.push(e);
      }
    });
    return results;
  }
};

module.exports = GcalService;
