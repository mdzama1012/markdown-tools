export const GITHUB_MARKDOWN_CSS_CDN =
	'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown.css" integrity="sha512-Hasfm7Iv5AG2/v5DSRXetpC33VjyPBXn5giooMag2EgSbiJ2Xp4GGvYGKSvc68SiJIflF/WrbDFdNmtlZHE5HA==" crossorigin="anonymous" referrerpolicy="no-referrer" />';

export const HIGHLIGHT_JS_CDN = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/default.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/go.min.js"></script><script>hljs.highlightAll();</script>`;

export const MARKDOWN_CLASS_CSS = `
  .markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
  }

  @media (max-width: 767px) {
    .markdown-body {
      padding: 15px;
    }
  }`;

export function sanitizeHtml(htmlBody: string, title: string) {
	const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${GITHUB_MARKDOWN_CSS_CDN}
        ${HIGHLIGHT_JS_CDN}
      </head>
      <style>
        ${MARKDOWN_CLASS_CSS}
      </style>
      <body class="markdown-body">
        ${htmlBody}
      </body>
    </html>`;

	return html;
}
