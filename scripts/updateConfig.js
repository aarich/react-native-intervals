/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

var config = require('../app.json');
var keys = require('./keys.json');
var fs = require('fs');

// Update release number
const releaseNum = process.argv[2];
const appRelease = process.argv[3].replace('-', '.');
const updateVersions = process.argv[4] === 'Y';

const { expo } = config;
const { ios, extra, hooks } = expo;

if (updateVersions) {
  if (expo.version !== appRelease) {
    // We're on a new version, reset ios build number
    ios.buildNumber = '1';
  } else {
    ios.buildNumber = `${parseInt(config.expo.ios.buildNumber) + 1}`;
  }
  console.log('ios.buildNumber set to ' + ios.buildNumber);
} else {
  console.log('Not updating iOS buildNumber');
}

expo.version = appRelease;
extra.MyVersion = releaseNum;
hooks.postPublish[0].config.release = releaseNum;

// Update sentry token
hooks.postPublish[0].config.authToken = keys.sentry_auth_token;

// write file from root diretory
fs.writeFileSync('app.json', JSON.stringify(config, null, 2));
