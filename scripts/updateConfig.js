/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

var config = require('../app.json');
var keys = require('./keys.json');
var fs = require('fs');

const appRelease = process.argv[2]; // app version, e.g. 3.0
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

if (dest !== 'WEB') {
  const newReleaseNum = `${parseInt(extra.MyVersion) + 1}`;
  expo.version = appRelease;
  extra.MyVersion = newReleaseNum;
  hooks.postPublish[0].config.release = newReleaseNum;
  console.log(`Setting custom release to ${newReleaseNum}\n`);
} else {
  console.log(`Not updating custom release number (${extra.MyVersion})`);
}

// Update sentry token
hooks.postPublish[0].config.authToken = keys.sentry_auth_token;

// write file from root diretory
fs.writeFileSync('app.json', JSON.stringify(config, null, 2));
