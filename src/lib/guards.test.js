// Source-level guards: cheap checks that stop known regressions coming back.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		return e.isDirectory() ? walk(p) : [p];
	});
}

const files = walk(SRC).filter((f) => !f.endsWith('.test.js'));
const svelte = files.filter((f) => f.endsWith('.svelte'));
const read = (f) => fs.readFileSync(f, 'utf8');
const rel = (f) => path.relative(SRC, f);

describe('accessibility', () => {
	it('every <img> has an alt attribute (empty is fine for decorative images)', () => {
		const bad = [];
		for (const f of svelte) {
			for (const tag of read(f).match(/<img\b[^>]*>/gs) || []) {
				if (!/\salt[=\s>]/.test(tag + '>') && !/\salt$/.test(tag)) bad.push(rel(f));
			}
		}
		expect(bad).toEqual([]);
	});

	it('no leftover debug outlines', () => {
		const bad = svelte.filter((f) => /outline:\s*1px solid red/.test(read(f))).map(rel);
		expect(bad).toEqual([]);
	});

	it('target="_blank" links always carry rel="noopener noreferrer"', () => {
		const bad = [];
		for (const f of svelte) {
			for (const tag of read(f).match(/<a\b[^>]*target="_blank"[^>]*>/gs) || []) {
				if (!/rel="[^"]*noopener[^"]*"/.test(tag)) bad.push(rel(f));
			}
		}
		expect(bad).toEqual([]);
	});
});

describe('privacy and performance', () => {
	it('does not load Google Fonts (fonts are self-hosted)', () => {
		const bad = [...files, path.join(SRC, 'app.html')]
			.filter((f) => /fonts\.(googleapis|gstatic)\.com/.test(read(f)))
			.map(rel);
		expect(bad).toEqual([]);
	});

	it('has no stray console.log in components or routes', () => {
		const bad = svelte.filter((f) => /^\s*console\.log\(/m.test(read(f))).map(rel);
		expect(bad).toEqual([]);
	});

	it('only ships JSON-LD from MetaHead (one graph per page)', () => {
		const bad = svelte.filter((f) => /ld\+json/.test(read(f)) && !f.endsWith('MetaHead.svelte')).map(rel);
		expect(bad).toEqual([]);
	});
});

describe('CSS', () => {
	it('interpolated url() values are quoted', () => {
		const bad = [...svelte, ...files.filter((f) => f.endsWith('.css'))]
			.filter((f) => /url\(\s*\{/.test(read(f)) || /url\(\s*\$\{/.test(read(f)))
			.map(rel);
		expect(bad).toEqual([]);
	});
});
