/**
 * Split a title over two lines as evenly as possible.
 *
 *   "A suitable setup"  -> ["A suitable", "setup"]
 *   "Everyday convenience" -> ["Everyday", "convenience"]
 *
 * Picks the word boundary that keeps the longer line as short as possible.
 * A single word stays on one line.
 */
export function splitTitle(text) {
	const words = (text || '').trim().split(/\s+/).filter(Boolean);
	if (words.length < 2) return [text || ''];

	let best = 1;
	let bestWidth = Infinity;
	for (let i = 1; i < words.length; i++) {
		const width = Math.max(words.slice(0, i).join(' ').length, words.slice(i).join(' ').length);
		if (width < bestWidth) {
			bestWidth = width;
			best = i;
		}
	}
	return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}
