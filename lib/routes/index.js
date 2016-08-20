const express = require('express');
const router = express.Router();
const GcalService = require('../gcal_service');
const moment = require('moment-timezone');
const stats = require('../stats');

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

function access_key(req, res, next) {
  if (req.query.secret && process.env.SECRET && req.query.secret == process.env.SECRET) {
    next();
  } else {
    res.status(401).send("Not Authorized");
  }
}

router.get('/admin', access_key, function(req, res) {
  res.render('pages/admin', {
    status: '...',
    stats: stats
  });
});

router.post('/admin', access_key, function(req, res) {
  if (req.body.override !== undefined) {
    process.env.OVERRIDE = process.env.OVERRIDE == 'true' ? 'false' : 'true';
  }
  res.redirect(req.originalUrl);
});

router.use('/twilio', require('./twilio'));



module.exports = router;
