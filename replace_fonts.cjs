const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.astro') || file.endsWith('.css')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let changed = 0;
files.forEach(file => {
    if (file.endsWith('Header.astro') || file.endsWith('Footer.astro') || file.endsWith('HeaderLink.astro')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Sifonn')) {
        content = content.replace(/'Sifonn'/g, "'Satoshi'");
        content = content.replace(/"Sifonn"/g, "'Satoshi'");
        fs.writeFileSync(file, content, 'utf8');
        changed++;
        console.log('Updated', file);
    }
});
console.log('Total files updated:', changed);
