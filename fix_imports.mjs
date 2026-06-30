import fs from 'fs';
import path from 'path';

const fileReplacements = [
    {
        file: 'src/pages/acerca/nosotros.astro',
        replaces: [
            ['../components/', '../../components/'],
            ['../layouts/', '../../layouts/'],
            ['../consts', '../../consts'],
            ['../lib/', '../../lib/'],
            ['../assets/', '../../assets/']
        ]
    },
    {
        file: 'src/pages/acerca/organizacion.astro',
        replaces: [
            ['../components/', '../../components/'],
            ['../layouts/', '../../layouts/'],
            ['../consts', '../../consts'],
            ['../lib/', '../../lib/'],
            ['../assets/', '../../assets/']
        ]
    },
    {
        file: 'src/pages/multimedia/arte.astro',
        replaces: [
            ['../components/', '../../components/'],
            ['../layouts/', '../../layouts/'],
            ['../consts', '../../consts'],
            ['../lib/', '../../lib/'],
            ['../assets/', '../../assets/']
        ]
    },
    {
        file: 'src/pages/multimedia/audiovisual.astro',
        replaces: [
            ['../components/', '../../components/'],
            ['../layouts/', '../../layouts/'],
            ['../consts', '../../consts'],
            ['../lib/', '../../lib/'],
            ['../assets/', '../../assets/']
        ]
    },
    {
        file: 'src/pages/multimedia/grafica.astro',
        replaces: [
            ['../components/', '../../components/'],
            ['../layouts/', '../../layouts/'],
            ['../consts', '../../consts'],
            ['../lib/', '../../lib/'],
            ['../assets/', '../../assets/']
        ]
    },
    {
        file: 'src/pages/publicaciones/cuadernillos.astro',
        replaces: [
            ['../components/', '../../components/'],
            ['../layouts/', '../../layouts/'],
            ['../consts', '../../consts'],
            ['../lib/', '../../lib/'],
            ['../assets/', '../../assets/']
        ]
    }
];

// Execute explicit file replacements
for (const { file, replaces } of fileReplacements) {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        for (const [search, replace] of replaces) {
            content = content.split(search).join(replace);
        }
        fs.writeFileSync(fullPath, content);
    }
}

// Global recursive replacements
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const globalReplaces = [
    ['components/Header.astro', 'components/layout/Header.astro'],
    ['components/Footer.astro', 'components/layout/Footer.astro'],
    ['components/BaseHead.astro', 'components/layout/BaseHead.astro'],
    ['components/HeaderLink.astro', 'components/layout/HeaderLink.astro'],
    ['components/ItemCard.astro', 'components/ui/ItemCard.astro'],
    ['components/PostCard.astro', 'components/ui/PostCard.astro'],
    ['components/ContentImage.astro', 'components/ui/ContentImage.astro'],
    ['components/FormattedDate.astro', 'components/ui/FormattedDate.astro'],
    ['components/AuthorLink.astro', 'components/ui/AuthorLink.astro'],
    
    // Route links (standard quotes)
    ['href="/nosotros"', 'href="/acerca/nosotros"'],
    ['href="/organizacion"', 'href="/acerca/organizacion"'],
    ['href="/arte"', 'href="/multimedia/arte"'],
    ['href="/audiovisual"', 'href="/multimedia/audiovisual"'],
    ['href="/grafica"', 'href="/multimedia/grafica"'],
    ['href="/cuadernillos"', 'href="/publicaciones/cuadernillos"'],
    
    // Route links (Astro backticks expressions)
    ['href=`/nosotros`', 'href=`/acerca/nosotros`'],
    ['href=`/organizacion`', 'href=`/acerca/organizacion`'],
    ['href=`/arte`', 'href=`/multimedia/arte`'],
    ['href=`/audiovisual`', 'href=`/multimedia/audiovisual`'],
    ['href=`/grafica`', 'href=`/multimedia/grafica`'],
    ['href=`/cuadernillos`', 'href=`/publicaciones/cuadernillos`']
];

walkDir('./src', (filePath) => {
    if (filePath.endsWith('.astro') || filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        for (const [search, replace] of globalReplaces) {
            content = content.split(search).join(replace);
        }
        if (original !== content) {
            fs.writeFileSync(filePath, content);
        }
    }
});

console.log('All replacements done via Node!');
