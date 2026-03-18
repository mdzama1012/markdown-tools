import { Marked } from 'marked';
import markedFootnote from 'marked-footnote';
import markedAlert from 'marked-alert';

const marked = new Marked().use(markedFootnote()).use(markedAlert()).use({ gfm: true });

export default marked;
