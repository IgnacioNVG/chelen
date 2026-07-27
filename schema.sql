-- schema.sql

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS articulos;
DROP TABLE IF EXISTS cartas;
DROP TABLE IF EXISTS poemas;
DROP TABLE IF EXISTS antologias;
DROP TABLE IF EXISTS columnistas;
DROP TABLE IF EXISTS nosotros;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE columnistas (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Columnista',
    summary TEXT,
    portrait TEXT,
    email TEXT,
    instagram TEXT,
    tags TEXT DEFAULT '[]', -- JSON string
    featured BOOLEAN DEFAULT 0,
    bio TEXT
);

CREATE TABLE articulos (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    pubDate DATETIME NOT NULL,
    heroImage TEXT,
    author_slug TEXT REFERENCES columnistas(slug),
    category TEXT DEFAULT 'Artículo',
    pdf TEXT,
    temas TEXT DEFAULT '[]', -- JSON string
    tags TEXT DEFAULT '[]', -- JSON string
    content TEXT
);

CREATE TABLE cartas (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    pubDate DATETIME NOT NULL,
    heroImage TEXT,
    author_slug TEXT REFERENCES columnistas(slug),
    category TEXT DEFAULT 'Cartas al Director',
    temas TEXT DEFAULT '[]',
    tags TEXT DEFAULT '[]',
    content TEXT
);

CREATE TABLE poemas (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    pubDate DATETIME NOT NULL,
    heroImage TEXT,
    author TEXT DEFAULT 'Anónimo',
    category TEXT DEFAULT 'Poesía',
    antologia_slug TEXT REFERENCES antologias(slug),
    temas TEXT DEFAULT '[]',
    tags TEXT DEFAULT '[]',
    content TEXT
);

CREATE TABLE antologias (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    pubDate DATETIME NOT NULL,
    heroImage TEXT,
    editor TEXT DEFAULT 'Redacción Chelén',
    category TEXT DEFAULT 'Antología',
    temas TEXT DEFAULT '[]',
    tags TEXT DEFAULT '[]',
    content TEXT
);

CREATE TABLE nosotros (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Singleton
    origen_titulo TEXT,
    origen_texto TEXT,
    highlight_box TEXT,
    teoria_titulo TEXT,
    teoria_texto TEXT,
    repensar_titulo TEXT,
    repensar_texto TEXT
);
