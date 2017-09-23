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
    if (process.env.AFTER_HOURS_CODE) {
      resp.say('Please enter access code or press 0 to call up')
      .gather({input: 'dtmf', timeout: 5, numDigits: 4, action: '/twilio/digits'});
      stats.record('code_prompt');
      res.send(resp.toString());
    } else if (process.env.AFTER_HOURS_NUMBER) {
      resp.dial({timeout: 10}, function(node) {
        node.number(process.env.AFTER_HOURS_NUMBER);
      });
      stats.record('call_forward');
      res.send(resp.toString());
    } else {
      resp.say("Sorry, no one is avaliable right now to let you in").hangup();
      stats.record('call_rejected');
      res.send(resp.toString());
    }
  }
}

function handleDigits(req, res) {
  stats.record('calls');
  res.set('Content-Type', 'text/xml');
  var digits = parseInt(req.query.Digits || req.body.Digits, 10);
  var afterHoursCode = parseInt(process.env.AFTER_HOURS_CODE, 10) || null;
  var resp = new twilio.TwimlResponse();
  if (digits === 0) {
    resp.dial({timeout: 10}, function(node) {
      node.number(process.env.AFTER_HOURS_NUMBER);
    });
    stats.record('call_forward');
    res.send(resp.toString());
  } else if (digits === afterHoursCode) {
    resp.play({digits: '9ww9ww9'});
    stats.record('door_buzz');
    res.send(resp.toString());
  } else {
    resp.say('Invalid code').hangup();
    stats.record('door_buzz');
    res.send(resp.toString());
  }
}

router.post('/call', handleCall);
router.get('/call', handleCall);
router.post('/digits', handleDigits);
router.get('/digits', handleDigits);
module.exports = router;
