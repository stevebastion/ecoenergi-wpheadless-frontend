import { marked } from 'marked';

export function renderMarkdown(md = '') {
  if (!md) return '';
  return marked.parse(md);
}