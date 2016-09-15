const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const stats = require('../stats');
const status = require('../status');

function handleCall(req, res) {
  stats.record('calls');
  res.set('Content-Type', 'text/xml');
  var resp = new twilio.TwimlResponse();
  if (status()) {
    // Mash 9 a few times
    resp.play({digits: 9}).pause({length: 1}).play({digits: 9}).pause({length: 1}).play({digits: 9});
    res.send(resp.toString());
    stats.record('door_buzz');
  } else {
    if (process.env.AFTER_HOURS_NUMBER) {
      resp.dial({timeout: 10}, function(node) {
        node.number(process.env.AFTER_HOURS_NUMBER);
      });
      res.send(resp.toString());
      stats.record('call_forward');
    } else {
      resp.say("Sorry, no one is avaliable right now to let you in").hangup();
      stats.record('call_rejected');
      res.send(resp.toString());
    }
  }
}

router.post('/call', handleCall);
router.get('/call', handleCall);

module.exports = router;
