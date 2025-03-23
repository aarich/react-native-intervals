import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findAppJson() {
  const parentDir = path.resolve(__dirname, '..');
  const appJsonPath = path.join(parentDir, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    return appJsonPath;
  } else {
    throw new Error('app.json not found in the parent directory.');
  }
}

export function updateAppJson(modifyCallback) {
  try {
    const appJsonPath = findAppJson();
    const appJsonData = fs.readFileSync(appJsonPath, 'utf8');
    const appJson = JSON.parse(appJsonData);

    modifyCallback(appJson);

    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), 'utf8');
    console.log('Successfully updated app.json.');
  } catch (error) {
    console.error('Error updating app.json:', error.message);
  }
}

updateAppJson((appJson) => {
  appJson.expo.experiments = { baseUrl: '/intervals' };
});
