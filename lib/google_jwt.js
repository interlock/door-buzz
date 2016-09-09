require('dotenv').config({silent: true});

module.exports = {
  env_map: {
    "project_id": {default: "", key: "G_PROJECT_ID"},
    "private_key_id": {default: "", key: "G_PRIVATE_KEY_ID"},
    "private_key": {default: "", key: "G_PRIVATE_KEY"},
    "client_email": {default: "", key: "G_CLIENT_EMAIL"},
    "client_id": {default: "", key: "G_CLIENT_ID"},
    "client_x509_cert_url": {default: "", key: "G_CLIENT_X509_CERT_URL"},
    "type": {default: "service_account", key: "G_TYPE"},
    "auth_uri": {default: "https://accounts.google.com/o/oauth2/auth", key: "G_AUTH_URI"},
    "token_uri": {default: "https://accounts.google.com/o/oauth2/token", key: "G_TOKEN_URI"},
    "auth_provider_x509_cert_url": {default: "https://www.googleapis.com/oauth2/v1/certs", key: "G_AUTH_PROVIDER_X509_CERT_URL"},
  },

  getJwt: function() {
    var jwt = {};
    for(var k in this.env_map) {
      if (process.env[this.env_map[k].key] !== undefined) {
        jwt[k] = process.env[this.env_map[k].key].replace('\n',"\n");
      } else {
        jwt[k] = this.env_map[k].default;
      }
    }
    return jwt;
  }
};
