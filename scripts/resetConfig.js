/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const config = require('../app.config.json');
const fs = require('fs');

// Reset sentry token
config.expo.hooks.postPublish[0].config.authToken = 'SENTRY_AUTH_TOKEN';

// write file from root diretory
fs.writeFileSync('app.config.json', JSON.stringify(config, null, 2));
