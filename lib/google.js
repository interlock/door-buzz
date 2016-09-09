const key = require('./google_jwt').getJwt();
const google = require('googleapis');
const calendar = google.calendar('v3');
const moment = require('moment');

var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ["https://www.googleapis.com/auth/calendar.readonly"], null);

module.exports = {
  getToken: function(cb) {
    jwtClient.authorize(cb);
  },
  getEvents: function(params, cb) {
    this.getToken(function(err) {
      if (err) {
        return cb(err);
      }

      params.auth = jwtClient;
      calendar.events.list(params, function(err, events) {
        if (err) {
          return cb(err);
        }
        cb(null, events.items);
      });
    });
  }
};
