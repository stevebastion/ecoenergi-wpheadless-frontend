import { describe, it, expect } from 'vitest';
import { splitTitle } from './splitTitle';

describe('splitTitle', () => {
	it.each([
		['Everyday convenience', ['Everyday', 'convenience']],
		['Tariff flexibility', ['Tariff', 'flexibility']],
		['A suitable setup', ['A suitable', 'setup']],
		['Simple controls', ['Simple', 'controls']],
		['Local installation', ['Local', 'installation']]
	])('splits "%s" evenly', (input, expected) => {
		expect(splitTitle(input)).toEqual(expected);
	});

	it('leaves a single word on one line', () => {
		expect(splitTitle('Overview')).toEqual(['Overview']);
	});

	it('never returns more than two lines, however long the title', () => {
		expect(splitTitle('High-quality components from trusted manufacturers')).toHaveLength(2);
	});

	it('copes with empty, null and extra whitespace', () => {
		expect(splitTitle('')).toEqual(['']);
		expect(splitTitle(null)).toEqual(['']);
		expect(splitTitle('  Solar   PV ')).toEqual(['Solar', 'PV']);
	});
});
