const express = require('express');
const router = express.Router();
const GcalService = require('../gcal_service');
const moment = require('moment-timezone');

router.get('/', function(req, res) {
  // GcalService.update(function())
  // cal = new PublicGoogleCalendar({ calendarId: 'functionalimperative.com_7r6nkoutb990e67ebvu9sjhr4s%40group.calendar.google.com' });
  // events is now array of all calendar events
  var matching = GcalService.rightNow();

  res.render('pages/home', {
    matching: matching,
    last_updated: GcalService.last_updated
  });

});

router.post('/refresh', function(req, res) {
  GcalService.update(function(err) {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect('/');
  });
});

router.use('/twilio', require('./twilio'));



module.exports = router;
