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
      res.send(resp.toString());
      stats.record('code_prompt');
    } else if (process.env.AFTER_HOURS_NUMBER) {
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

function handleDigits(req, res) {
  stats.record('calls');
  res.set('Content-Type', 'text/xml');
  var digits = parseInt(req.query.Digits || req.body.Digits, 10);
      console.log('digits', digits);
      console.log('code', process.env.AFTER_HOURS_CODE);
  var resp = new twilio.TwimlResponse();
  if (digits === 0) {
    resp.dial({timeout: 10}, function(node) {
      node.number(process.env.AFTER_HOURS_NUMBER);
    });
    res.send(resp.toString());
    stats.record('call_forward');
  } else if (digits === parseInt(process.env.AFTER_HOURS_CODE, 10)) {
    resp.play({digits: 9}).pause({length: 1}).play({digits: 9}).pause({length: 1}).play({digits: 9});
    res.send(resp.toString());
    stats.record('door_buzz');
  } else {
    resp.say('Invalid code').hangup();
    res.send(resp.toString());
    stats.record('invalid_code');
  }
}

router.post('/call', handleCall);
router.get('/call', handleCall);
router.post('/digits', handleDigits);
router.get('/digits', handleDigits);
module.exports = router;
