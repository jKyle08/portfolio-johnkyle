const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// Create public directory if it does not exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Files to copy
const rootFiles = ['index.html', 'styles.css', 'app.js'];
rootFiles.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> public/${file}`);
  }
});

// Directories to copy
const dirsToCopy = ['images', 'files', 'static'];
dirsToCopy.forEach(dir => {
  const srcDir = path.join(__dirname, dir);
  const destDir = path.join(publicDir, dir);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true, force: true });
    console.log(`Copied directory ${dir} -> public/${dir}`);
  }
});

console.log('Build completed successfully: public/ directory prepared for deployment.');
