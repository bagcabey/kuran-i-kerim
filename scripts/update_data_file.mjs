import fs from 'fs';

const db = JSON.parse(fs.readFileSync('makam_okulu/data/makamlar.json', 'utf8'));
const backupContent = fs.readFileSync('backup_pre_v3/kimatik_lab/tilavet_akademi_data.js', 'utf8');
const fakeWindow = {};
new Function('window', backupContent)(fakeWindow);
const oldMakamlar = fakeWindow.TilavetAkademiDefaultData.makamlar;
const oldMap = new Map(oldMakamlar.map(m => [m.id, m]));

// Merge ayahExamples from backup into the makamlar objects
const mergedMakamlar = db.makamlar.map(m => {
  const old = oldMap.get(m.id);
  return {
    ...m,
    ayahExamples: old?.ayahExamples || []
  };
});

const file = 'kimatik_lab/tilavet_akademi_data.js';
let content = fs.readFileSync(file, 'utf8');

const pStart = content.indexOf('"makamlar":');
const pLessons = content.indexOf('"lessons":');
if (pStart === -1 || pLessons === -1) throw new Error('keys not found');

const pComma = content.lastIndexOf(',', pLessons);

const newMakamlarStr = '"makamlar": ' + JSON.stringify(mergedMakamlar, null, 2);
content = content.slice(0, pStart) + newMakamlarStr + content.slice(pComma);
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated kimatik_lab/tilavet_akademi_data.js with merged makamlar and ayahExamples!');
