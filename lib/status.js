const GcalService = require('./gcal_service');

// Returns if we are answering the door right now or not
module.exports = function() {
  return GcalService.rightNow().length > 0 || process.env.OVERRIDE == 'true';
};
