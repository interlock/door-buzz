const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const GcalService = require('../gcal_service');


function handleCall(req, res) {
  stats.increment('calls_count');
  res.set('Content-Type', 'text/xml');
  var resp = new twilio.TwimlResponse();
  if (GcalService.rightNow().length > 0 || process.env.OVERRIDE == 'true') {
    // Mash 9 a few times
    resp.play({digits: 9}).pause({length: 1}).play({digits: 9}).pause({length: 1}).play({digits: 9});
    res.send(resp.toString());
    stats.increment('door_buzz_count');
  } else {
    if (process.env.AFTER_HOURS_NUMBER) {
      resp.dial({timeout: 10}, function(node) {
        node.number(process.env.AFTER_HOURS_NUMBER);
      });
      res.send(resp.toString());
      stats.increment('call_forward_count');
    } else {
      resp.say("Sorry, no one is avaliable right now to let you in").hangup();
      res.send(resp.toString());
    }
  }
}

router.post('/call', handleCall);
router.get('/call', handleCall);

module.exports = router;
