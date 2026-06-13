import fs from 'node:fs';
import path from 'node:path';

const columnistasDir = path.join('src', 'content', 'columnistas');

function authorSlug(name) {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function loadColumnistaSlugs() {
	const slugs = new Map();
	for (const file of fs.readdirSync(columnistasDir)) {
		if (!file.endsWith('.md')) continue;
		const id = file.replace(/\.md$/, '');
		const content = fs.readFileSync(path.join(columnistasDir, file), 'utf8');
		const nameMatch = content.match(/^name:\s*(.+)$/m);
		const name = nameMatch?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? id;
		slugs.set(authorSlug(name), id);
		slugs.set(id, id);
	}
	return slugs;
}

function resolveAuthorSlug(rawAuthor, columnistaSlugs) {
	if (!rawAuthor) return undefined;
	const cleaned = rawAuthor.trim().replace(/^['"]|['"]$/g, '');
	if (cleaned.toLowerCase() === 'anónimo' || cleaned.toLowerCase() === 'anonimo') {
		return undefined;
	}
	return columnistaSlugs.get(authorSlug(cleaned)) ?? columnistaSlugs.get(cleaned);
}

function updateFrontmatter(content, updates) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) throw new Error('Missing frontmatter');
	const [, frontmatter, body] = match;
	const lines = frontmatter.split(/\r?\n/);
	const nextLines = [];
	const handled = new Set();

	for (const line of lines) {
		const keyMatch = line.match(/^(\w+):/);
		if (!keyMatch) {
			nextLines.push(line);
			continue;
		}
		const key = keyMatch[1];
		if (key in updates) {
			handled.add(key);
			const value = updates[key];
			if (value === undefined) continue;
			if (typeof value === 'string' && (value.includes(':') || value.includes('"'))) {
				nextLines.push(`${key}: '${value.replace(/'/g, "''")}'`);
			} else {
				nextLines.push(`${key}: ${value}`);
			}
			continue;
		}
		nextLines.push(line);
	}

	for (const [key, value] of Object.entries(updates)) {
		if (handled.has(key) || value === undefined) continue;
		nextLines.push(`${key}: ${value}`);
	}

	return `---\n${nextLines.join('\n')}\n---\n${body}`;
}

function resolveHeroPath(heroPath, contentDir) {
	const cleaned = heroPath.trim().replace(/^['"]|['"]$/g, '');
	if (cleaned.startsWith('./')) {
		return path.join(contentDir, cleaned.slice(2));
	}
	if (cleaned.startsWith('../')) {
		return path.join(contentDir, cleaned);
	}
	return path.join(contentDir, cleaned);
}

function migrateFlatEntries({
	contentDir,
	mapAuthor,
	excludeDirs = [],
}) {
	const mdFiles = fs
		.readdirSync(contentDir, { withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
		.map((entry) => entry.name);

	for (const file of mdFiles) {
		const slug = file.replace(/\.md$/, '');
		const sourceMd = path.join(contentDir, file);
		const targetDir = path.join(contentDir, slug);
		const targetMd = path.join(targetDir, 'index.md');

		fs.mkdirSync(targetDir, { recursive: true });

		let content = fs.readFileSync(sourceMd, 'utf8');
		const authorMatch = content.match(/^author:\s*(.+)$/m);
		const heroMatch = content.match(/^heroImage:\s*(.+)$/m);

		const updates = {};
		if (mapAuthor) {
			updates.author = resolveAuthorSlug(authorMatch?.[1], mapAuthor);
		}

		if (heroMatch) {
			const heroFile = resolveHeroPath(heroMatch[1], contentDir);
			if (fs.existsSync(heroFile)) {
				const ext = path.extname(heroFile);
				const heroName = `hero${ext}`;
				fs.copyFileSync(heroFile, path.join(targetDir, heroName));
				updates.heroImage = `./${heroName}`;
			} else {
				console.warn(`Hero image not found for ${slug}: ${heroFile}`);
			}
		}

		content = updateFrontmatter(content, updates);
		fs.writeFileSync(targetMd, content);
		fs.unlinkSync(sourceMd);
		console.log(`Migrated: ${path.relative('src/content', targetDir)}`);
	}

	for (const entry of fs.readdirSync(contentDir, { withFileTypes: true })) {
		if (entry.isDirectory() && excludeDirs.includes(entry.name)) continue;
		if (
			entry.isFile() &&
			/\.(webp|jpg|jpeg|png)$/i.test(entry.name)
		) {
			fs.unlinkSync(path.join(contentDir, entry.name));
			console.log(`Removed orphaned image: ${path.join(contentDir, entry.name)}`);
		}
	}
}

const columnistaSlugs = loadColumnistaSlugs();

migrateFlatEntries({
	contentDir: path.join('src', 'content', 'cartas'),
	mapAuthor: columnistaSlugs,
});

migrateFlatEntries({
	contentDir: path.join('src', 'content', 'poemas', 'antologia'),
	mapAuthor: null,
});

migrateFlatEntries({
	contentDir: path.join('src', 'content', 'poemas'),
	mapAuthor: null,
	excludeDirs: ['antologia'],
});
