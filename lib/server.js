const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const logger = require('morgan');
const GcalService = require('./gcal_service');

// Initialization
require('dotenv').config({silent: true});

const app = express();

// Configuration
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Actual middlewares
app.use(logger(process.env.ENV || 'dev' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routing
app.use('/', require('./routes'));

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port: ', process.env.PORT || 3000);


  var gcalUpdateHandler = function(err) {
    if (err) {
      return console.log('Failed to update Gcal data');
    }
    console.log('Gcal data updated');
  }

  console.log('Updating Gcal data');
  // GcalService.update(gcalUpdateHandler);

  console.log('scheduling gcal updates every 30 minutes');
  GcalService.schedule(60 * 30, gcalUpdateHandler);
});
