/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const config = require('../app.config.json');
const easConfig = require('../eas.json');
const keys = require('./keys.json');
const fs = require('fs');

const appReleaseDashed = process.argv[2]; // app version, e.g. 3-0
const appRelease = appReleaseDashed.replace('-', '.');
const dest = process.argv[3]; // build destination, e.g. WEB/ANDROID/IOS/NONE

const { expo } = config;
const { ios, android, extra, hooks } = expo;

if (dest === 'IOS') {
  if (expo.version !== appRelease) {
    // We're on a new version, reset ios build number
    ios.buildNumber = '1';
  } else {
    ios.buildNumber = `${parseInt(config.expo.ios.buildNumber) + 1}`;
  }
  console.log(`\nios.buildNumber set to ${ios.buildNumber}\n`);
} else if (dest === 'ANDROID') {
  android.versionCode += 1;
  console.log(`\nandroid.versionCode set to ${android.versionCode}\n`);
} else {
  console.log('\nNo version/build number changes made\n');
}

expo.version = appRelease;

easConfig.build.production.releaseChannel = 'prod-' + appReleaseDashed;

const newReleaseNum = `${parseInt(extra.MyVersion) + 1}`;
extra.MyVersion = newReleaseNum;

// Update sentry token
hooks.postPublish[0].config.authToken = keys.sentry_auth_token;

// write file from root diretory
fs.writeFileSync('app.config.json', JSON.stringify(config, null, 2));
fs.writeFileSync('eas.json', JSON.stringify(easConfig, null, 2));
