# Door Buzz

Direct a door buzzer to this project, and press the 9 button to let people in when a google calendar ical file has anything scheduled.

## Requirements

- Twilio account with a number for your buzzer to call
- Heroku account for deployment (ideally you pay for a small dyno, the spin up time on hobby leads to dropped calls)
- A free heroku mongodb database to record metrics
- A public Google Calendar you want to define events in
- Google API Service account keys with scoped access to read calendar data
- Optionally a number to forward call to after hours (default is to say we are closed)

## Setup

- Setup a google developer app and create some service account credentials
- Convert the json file above to environment variables:
  - G_PROJECT_ID
  - G_PRIVATE_KEY_ID
  - G_PRIVATE_KEY
  - G_CLIENT_EMAIL
  - G_CLIENT_ID
  - G_CLIENT_X509_CERT_URL
  - _optional_
  - G_TYPE (defaults to: service_account)
  - G_AUTH_URI (defaults to: https://accounts.google.com/o/oauth2/auth)
  - G_TOKEN_URI (defaults to: https://accounts.google.com/o/oauth2/token)
  - G_AUTH_PROVIDER_X509_CERT_URL (defaults to: https://www.googleapis.com/oauth2/v1/certs)
  - `node utils/token.js ../my_token_jwt.json` will output env variables you can use
- Configure the GCAL_ID to your public calendar
- Configure the AFTER_HOURS_NUMBER to point to the number you want calls to go to when closed
- Configure the AFTER_HOURS_CODE to set a four digit code to unlock after hours
- Configure the SECRET if you want to use the /admin?secret=<SECRET> url
- Point your Twilio numbers call handling to: https://<your-app-name>.herokuapp.com/twilio/call (POST or GET, does not matter)


## Operation

Create events in the calendar for periods of time you want door-buzz to open the door.

Manually override door-buzz on the admin panel.

Admin Panel Url: https://<app>.herokuapp.com/admin?secret=SECRET
