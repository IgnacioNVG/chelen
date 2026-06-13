import fs from 'node:fs';
import path from 'node:path';

const articulosDir = path.join('src', 'content', 'articulos');
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
			if (typeof value === 'string' && value.includes(':')) {
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

const columnistaSlugs = loadColumnistaSlugs();
const mdFiles = fs
	.readdirSync(articulosDir)
	.filter((file) => file.endsWith('.md'));

for (const file of mdFiles) {
	const slug = file.replace(/\.md$/, '');
	const sourceMd = path.join(articulosDir, file);
	const targetDir = path.join(articulosDir, slug);
	const targetMd = path.join(targetDir, 'index.md');
	const targetHero = path.join(targetDir, 'hero.webp');

	fs.mkdirSync(targetDir, { recursive: true });

	let content = fs.readFileSync(sourceMd, 'utf8');
	const authorMatch = content.match(/^author:\s*(.+)$/m);
	const heroMatch = content.match(/^heroImage:\s*(.+)$/m);
	const authorSlugValue = resolveAuthorSlug(authorMatch?.[1], columnistaSlugs);

	const updates = {
		heroImage: './hero.webp',
		author: authorSlugValue,
	};

	content = updateFrontmatter(content, updates);
	fs.writeFileSync(targetMd, content);

	if (heroMatch) {
		const heroPath = heroMatch[1].trim().replace(/^['"]|['"]$/g, '');
		const heroFile = heroPath.startsWith('./')
			? path.join(articulosDir, heroPath.slice(2))
			: path.join(articulosDir, heroPath);
		if (fs.existsSync(heroFile)) {
			fs.copyFileSync(heroFile, targetHero);
		} else {
			console.warn(`Hero image not found for ${slug}: ${heroFile}`);
		}
	}

	fs.unlinkSync(sourceMd);
	console.log(`Migrated: ${slug}`);
}

for (const file of fs.readdirSync(articulosDir)) {
	if (file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.png')) {
		fs.unlinkSync(path.join(articulosDir, file));
		console.log(`Removed orphaned image: ${file}`);
	}
}
