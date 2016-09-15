const PublicGoogleCalendar = require('./google');
const moment = require('moment-timezone');
const stats = require('./stats');

function dateToMoment(d) {
  return moment.tz(d.dateTime, d.timeZone);
}

const GcalService = {
  events: [],
  last_updated: null,

  // Update our data
  update: function(cb) {
    var self = this;
    PublicGoogleCalendar.getEvents({
      calendarId: process.env.GCAL_ID,
      maxResults: 50,
      singleEvents: true,
      timeMin: moment().add(-1, 'days').format(),
      timeMax: moment().add(1, 'days').format()
    }, function(err, events) {
      if (err) {
        return cb(err);
      }
      self.events = events;
      self.last_updated = moment.tz();
      stats.record('gcal_updated');
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
      return e.start.timeZone;
    }
    return null;
  },

  // Returns events taking place at this moment in time
  rightNow: function() {
    var tz = this.tz();
    var now = moment.tz(tz);
    var results = [];
    this.events.forEach(function(e) {
      if ( now.isBetween(dateToMoment(e.start), dateToMoment(e.end)) ) {
        results.push(e);
      }
    });
    return results;
  },

  today: function() {
    var tz = this.tz();
    var start = moment.tz(tz).hour(0).minute(0).second(0).millisecond(0);
    var end = start.clone().add(24,'hours');
    var results = [];
    this.events.forEach(function(e) {
      if (dateToMoment(e.start).isBetween(start, end) || dateToMoment(e.end).isBetween(start, end)) {
        results.push(e);
      }
    });
    return results;
  }
};

module.exports = GcalService;
