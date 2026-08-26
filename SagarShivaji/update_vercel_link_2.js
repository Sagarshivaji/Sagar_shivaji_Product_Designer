import fs from 'fs';
import path from 'path';

const baseDir = 'C:/Users/Sagar/SagarShivaji';
const files = [
  'index.html',
  'work.html',
  'work/job-pulse.html'
];

const oldUrl = 'https://jobnotification-7l239ca15-sagar197.vercel.app';
const newUrl = 'https://job-pulse-toie.onrender.com/';

files.forEach(f => {
  const filePath = path.join(baseDir, f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.split(oldUrl).join(newUrl);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated link in ${f}`);
  } else {
    console.log(`File not found: ${f}`);
  }
});
