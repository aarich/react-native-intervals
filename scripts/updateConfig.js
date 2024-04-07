/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const config = require('../app.config.json');
const fs = require('fs');

const appReleaseDashed = process.argv[2]; // app version, e.g. 3-0
const appRelease = appReleaseDashed.replaceAll('-', '.');
const dest = process.argv[3]; // build destination, e.g. WEB/ANDROID/IOS/NONE

const { expo } = config;
const { ios, android, extra } = expo;

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

const newReleaseNum = `${parseInt(extra.MyVersion) + 1}`;
extra.MyVersion = newReleaseNum;

// write file from root diretory
fs.writeFileSync('app.config.json', JSON.stringify(config, null, 2));
