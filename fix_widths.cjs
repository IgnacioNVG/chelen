const fs = require('fs');
const path = require('path');

function replaceWidths(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceWidths(fullPath);
        } else if (fullPath.endsWith('.astro')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content.replace(/width:\s*min\([^,]+,\s*calc\(100%\s*-\s*[^\)]+\)\);/g, 'width: calc(100% - 4vw);\n                max-width: 1800px;');
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}
replaceWidths(path.join(__dirname, 'src'));
