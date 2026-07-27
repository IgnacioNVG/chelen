import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('getCollection(')) return;
  
  console.log('Processing', filePath);

  // 1. Calculate relative path to d1Content
  const dir = path.dirname(filePath);
  const root = path.join(process.cwd(), 'src', 'lib', 'd1Content');
  let relPath = path.relative(dir, root).replace(/\\/g, '/');
  if (!relPath.startsWith('.')) relPath = './' + relPath;

  // 2. Replace imports
  content = content.replace(/import\s+\{[^}]*getCollection[^}]*\}\s+from\s+['"]astro:content['"];?/g, `import { getCollection } from '${relPath}';`);
  
  // 3. Insert db variable after ---
  if (content.includes('---')) {
    const dbDecl = `\nconst db = (Astro.locals as any).runtime?.env?.DB;\n`;
    if (!content.includes('const db =')) {
        content = content.replace(/---\r?\n/, `---\r\n${dbDecl}`);
    }
  }

  // 4. Replace await getCollection('name') with await getCollection(db, 'name')
  content = content.replace(/getCollection\(['"]([^'"]+)['"]\)/g, "getCollection(db, '$1')");

  fs.writeFileSync(filePath, content);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath);
    } else if (f.endsWith('.astro')) {
      processFile(dirPath);
    }
  });
}

walkDir(path.join(process.cwd(), 'src', 'pages'));
