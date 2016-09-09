/*
Simple check for environment variables being set.
*/
module.exports = function() {
  var checks = [];
  if (process.env.SECRET === undefined) {
    checks.push("No SECRET set, /admin path will not work");
  }

  if (process.env.GCAL_ID === undefined) {
    checks.push("No GCAL_ID set, will not open the door without the OVERRIDE being set to true");
  }

  if (process.env.AFTER_HOURS_NUMBER === undefined) {
    checks.push("No AFTER_HOURS_NUMBER set, calls will get a message and then hungup.");
  }
  return checks;
};
