const ical = require('ical');
const RRule = require('rrule').RRule;
const moment = require('moment-timezone');

module.exports = function PublicGoogleCalendar(args) {

  // args: {
  //    calendarId: Google calendar ID
  // }

  var calendarId = args.calendarId;

  this.getEvents = function(options, callback) {
    // Retrieves Google Calendar events in ical format and converts data to simple JSON form
    // Calendar events are sorted (latest event first)
    // callback is called with error and array of events

    if (!callback) {
      callback = options;
      options = {};
    }

    var events = [];
    var expandedEvents = [];
    var properties = [                         // properties to include in result
          { name: 'start', type: 'moment' },
          { name: 'end', type: 'moment' },
          { name: 'status', type: 'string' },
          { name: 'summary', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'rrule', type: 'object' },
          { name: 'location', type: 'string' },
          { name: 'uid', newName: 'id', type: 'string'} ];
    var defaults = {
        expandRecurring: true,
        recurringRange: moment.utc().add(4, 'weeks').hour(23).minute(59).second(59).millisecond(999).toDate(),
        earliestFirst: false };
    var k;
    var obj;

    // set default options
    for (k in defaults) {
      if (defaults.hasOwnProperty(k) && !(k in options)) {
        options[k] = defaults[k];
      }
    }

    // define sorting order ascending/descending
    var sortingModifier = options.earliestFirst ? -1 : 1;

    if (calendarId) {
      var url = 'https://www.google.com/calendar/ical/' + calendarId + '/public/basic.ics';

      ical.fromURL(url, {}, function(err, data) {

        var k;

        var iterator = function(prop) {
          var key = prop.newName ? prop.newName : prop.name;
          obj[key] = data[k][prop.name];
          if (prop.type === 'string') {
            obj[key] = typeof obj[key] === 'string' ? obj[key] : '';
          } else if (prop.type === 'moment') {
            // HACK ical returns dates as UTC format even though they have a TZ... sigh
            obj[key] = moment.tz(obj[key].toISOString().replace(/Z$/,''), obj[key]['tz']);
          }
        };

        if (err) { return callback(err); }
        for (k in data) {
          if (data.hasOwnProperty(k) && data[k].type === 'VEVENT') {

            obj = {};
            properties.forEach(iterator);
            events.push(obj);
          }
        }

        // expand recurring events
        if (options.expandRecurring) {
          events.forEach(function (event) {

            var rule, eventLength, ruleSet;
            if (event.rrule) {

              // Ugly hack, because latest version of 'ical' is not yet in npm
              event.rrule.origOptions.dtstart = event.start.toDate();

              rule = new RRule(event.rrule.origOptions);

              eventLength = event.end ? event.end - event.start : 0;

              var today = moment.utc().subtract(1, 'weeks').hour(0).minute(0).second(0).millisecond(0);
              ruleSet = rule.between(today.toDate(), options.recurringRange);

              ruleSet.forEach(function (dateString) {

                var newObject = {};
                var k, tz;
                tz = event.start.tz();
                // TODO: Should make this property copying future proof
                for (k in event) {
                  if (event.hasOwnProperty(k) && typeof event[k] === 'string') {
                    newObject[k] = event[k];
                  }
                }
                newObject.start = moment.tz(dateString, tz);
                if (eventLength) {
                  newObject.end = newObject.start.clone().add(eventLength, 'ms');
                }
                newObject.baseEvent = event;
                expandedEvents.push(newObject);
              });
            }
          });
          events = events.concat(expandedEvents);
        }


        // sort events
        events.sort(function(a, b) {
            if (a.start > b.start) {
              return -1 * sortingModifier;
            }
            else {
              return sortingModifier;
            }
          });

        callback(null, events);
      });

    }
    else {
      callback(new Error('Missing calendarId'));
    }

  };
};
