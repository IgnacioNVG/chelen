import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function escapeSqlString(str) {
  if (str === null || str === undefined) return 'NULL';
  if (str instanceof Date) {
      return `'${str.toISOString()}'`;
  }
  return `'${String(str).replace(/'/g, "''")}'`;
}

async function run() {
  const sqlStatements = [
    "PRAGMA foreign_keys = OFF;"
  ];
  
  // 1. Migrate Columnistas (Authors)
  const columnistasDir = path.join(process.cwd(), 'src/content/columnistas');
  if (fs.existsSync(columnistasDir)) {
    const files = fs.readdirSync(columnistasDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    for (const file of files) {
      const slug = file.replace(/\.(md|mdx)$/, '');
      const fileContent = fs.readFileSync(path.join(columnistasDir, file), 'utf-8');
      const { data, content } = matter(fileContent);
      
      const tagsJson = JSON.stringify(data.tags || []);
      const featured = data.featured ? 1 : 0;
      const authorName = data.name || slug;
      
      sqlStatements.push(`INSERT OR REPLACE INTO columnistas (slug, name, role, summary, portrait, email, instagram, tags, featured, bio) VALUES (${escapeSqlString(slug)}, ${escapeSqlString(authorName)}, ${escapeSqlString(data.role || 'Columnista')}, ${escapeSqlString(data.summary)}, ${escapeSqlString(data.portrait)}, ${escapeSqlString(data.email)}, ${escapeSqlString(data.instagram)}, ${escapeSqlString(tagsJson)}, ${featured}, ${escapeSqlString(content)});`);
    }
  }

  // 2. Migrate Articulos
  const articulosDir = path.join(process.cwd(), 'src/content/articulos');
  if (fs.existsSync(articulosDir)) {
    const dirs = fs.readdirSync(articulosDir).filter(f => fs.statSync(path.join(articulosDir, f)).isDirectory());
    for (const dir of dirs) {
      const slug = dir;
      const indexPath = path.join(articulosDir, dir, 'index.md');
      const indexMdxPath = path.join(articulosDir, dir, 'index.mdx');
      
      let filePath = null;
      if (fs.existsSync(indexPath)) filePath = indexPath;
      else if (fs.existsSync(indexMdxPath)) filePath = indexMdxPath;
      
      if (filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const tagsJson = JSON.stringify(data.tags || []);
        const temasJson = JSON.stringify(data.temas || []);
        const title = data.title || slug;
        const description = data.description || '';
        const pubDate = data.pubDate || new Date().toISOString();
        
        sqlStatements.push(`INSERT OR REPLACE INTO articulos (slug, title, description, pubDate, heroImage, author_slug, category, pdf, temas, tags, content) VALUES (${escapeSqlString(slug)}, ${escapeSqlString(title)}, ${escapeSqlString(description)}, ${escapeSqlString(pubDate)}, ${escapeSqlString(data.heroImage)}, ${escapeSqlString(data.author)}, ${escapeSqlString(data.category || 'Artículo')}, ${escapeSqlString(data.pdf)}, ${escapeSqlString(temasJson)}, ${escapeSqlString(tagsJson)}, ${escapeSqlString(content)});`);
      }
    }
  }

  // 3. Migrate Cartas
  const cartasDir = path.join(process.cwd(), 'src/content/cartas');
  if (fs.existsSync(cartasDir)) {
    const dirs = fs.readdirSync(cartasDir).filter(f => fs.statSync(path.join(cartasDir, f)).isDirectory());
    for (const dir of dirs) {
      const slug = dir;
      const indexPath = path.join(cartasDir, dir, 'index.md');
      const indexMdxPath = path.join(cartasDir, dir, 'index.mdx');
      
      let filePath = null;
      if (fs.existsSync(indexPath)) filePath = indexPath;
      else if (fs.existsSync(indexMdxPath)) filePath = indexMdxPath;
      
      if (filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const tagsJson = JSON.stringify(data.tags || []);
        const temasJson = JSON.stringify(data.temas || []);
        const title = data.title || slug;
        const pubDate = data.pubDate || new Date().toISOString();
        
        sqlStatements.push(`INSERT OR REPLACE INTO cartas (slug, title, pubDate, heroImage, author_slug, category, temas, tags, content) VALUES (${escapeSqlString(slug)}, ${escapeSqlString(title)}, ${escapeSqlString(pubDate)}, ${escapeSqlString(data.heroImage)}, ${escapeSqlString(data.author)}, ${escapeSqlString(data.category || 'Cartas al Director')}, ${escapeSqlString(temasJson)}, ${escapeSqlString(tagsJson)}, ${escapeSqlString(content)});`);
      }
    }
  }

  // 4. Migrate Poemas
  const poemasDir = path.join(process.cwd(), 'src/content/poemas');
  if (fs.existsSync(poemasDir)) {
    const dirs = fs.readdirSync(poemasDir).filter(f => fs.statSync(path.join(poemasDir, f)).isDirectory() && f !== 'antologia');
    for (const dir of dirs) {
      const slug = dir;
      const indexPath = path.join(poemasDir, dir, 'index.md');
      const indexMdxPath = path.join(poemasDir, dir, 'index.mdx');
      
      let filePath = null;
      if (fs.existsSync(indexPath)) filePath = indexPath;
      else if (fs.existsSync(indexMdxPath)) filePath = indexMdxPath;
      
      if (filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const tagsJson = JSON.stringify(data.tags || []);
        const temasJson = JSON.stringify(data.temas || []);
        const title = data.title || slug;
        const pubDate = data.pubDate || new Date().toISOString();
        
        sqlStatements.push(`INSERT OR REPLACE INTO poemas (slug, title, pubDate, heroImage, author, category, antologia_slug, temas, tags, content) VALUES (${escapeSqlString(slug)}, ${escapeSqlString(title)}, ${escapeSqlString(pubDate)}, ${escapeSqlString(data.heroImage)}, ${escapeSqlString(data.author || 'Anónimo')}, ${escapeSqlString(data.category || 'Poesía')}, ${escapeSqlString(data.antologia)}, ${escapeSqlString(temasJson)}, ${escapeSqlString(tagsJson)}, ${escapeSqlString(content)});`);
      }
    }
  }

  // 5. Migrate Antologias
  const antologiasDir = path.join(process.cwd(), 'src/content/poemas/antologia');
  if (fs.existsSync(antologiasDir)) {
    const dirs = fs.readdirSync(antologiasDir).filter(f => fs.statSync(path.join(antologiasDir, f)).isDirectory());
    for (const dir of dirs) {
      const slug = dir;
      const indexPath = path.join(antologiasDir, dir, 'index.md');
      const indexMdxPath = path.join(antologiasDir, dir, 'index.mdx');
      
      let filePath = null;
      if (fs.existsSync(indexPath)) filePath = indexPath;
      else if (fs.existsSync(indexMdxPath)) filePath = indexMdxPath;
      
      if (filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const tagsJson = JSON.stringify(data.tags || []);
        const temasJson = JSON.stringify(data.temas || []);
        const title = data.title || slug;
        const description = data.description || '';
        const pubDate = data.pubDate || new Date().toISOString();
        
        sqlStatements.push(`INSERT OR REPLACE INTO antologias (slug, title, description, pubDate, heroImage, editor, category, temas, tags, content) VALUES (${escapeSqlString(slug)}, ${escapeSqlString(title)}, ${escapeSqlString(description)}, ${escapeSqlString(pubDate)}, ${escapeSqlString(data.heroImage)}, ${escapeSqlString(data.editor || 'Redacción Chelén')}, ${escapeSqlString(data.category || 'Antología')}, ${escapeSqlString(temasJson)}, ${escapeSqlString(tagsJson)}, ${escapeSqlString(content)});`);
      }
    }
  }

  // 6. Migrate Nosotros
  const nosotrosPath = path.join(process.cwd(), 'src/content/nosotros/index.json');
  if (fs.existsSync(nosotrosPath)) {
     try {
       const data = JSON.parse(fs.readFileSync(nosotrosPath, 'utf-8'));
       sqlStatements.push(`INSERT OR REPLACE INTO nosotros (id, origen_titulo, origen_texto, highlight_box, teoria_titulo, teoria_texto, repensar_titulo, repensar_texto) VALUES (1, ${escapeSqlString(data.origen_titulo)}, ${escapeSqlString(data.origen_texto)}, ${escapeSqlString(data.highlight_box)}, ${escapeSqlString(data.teoria_titulo)}, ${escapeSqlString(data.teoria_texto)}, ${escapeSqlString(data.repensar_titulo)}, ${escapeSqlString(data.repensar_texto)});`);
     } catch (e) {
       console.error("Error reading nosotros JSON", e);
     }
  }

  fs.writeFileSync('inserts.sql', sqlStatements.join('\n'));
  console.log('Migration SQL generated in inserts.sql');
}

run().catch(console.error);
