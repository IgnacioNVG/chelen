import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src/pages', (filePath) => {
    if (filePath.endsWith('.astro')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        
        content = content.split('../../../../../').join('../../');
        content = content.split('../../../../').join('../../'); // catch any outliers
        
        if (original !== content) {
            fs.writeFileSync(filePath, content);
        }
    }
});

console.log('Fixed over-replaced paths!');
