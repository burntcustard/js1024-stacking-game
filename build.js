import { readFileSync, writeFileSync } from 'fs';
import { minify as minifyJs } from "terser";
import { minify as minifyHtml } from 'html-minifier';
import { cmdRegPack } from 'regpack';

const options = {
  toplevel: true,
  compress: {
    passes: 2,
    // unsafe: true,
    // unsafe_arrows: true,
    // unsafe_comps: true,
    // unsafe_math: true,
    booleans_as_integers: true,
  },
  mangle: {
   properties: {
    keep_quoted: true,
   },
  },
  format: {
    wrap_func_args: false,
  },
};

let js = readFileSync('src/main.js', 'utf8');

// Some custom mangling of JS to assist / work around Terser
js = js
  // Remove whitespace in CSS template literals
  .replace(/`[^`]+`/g, tag => tag
    .replace(/`\s+/, '`')  // Remove newlines & spaces at start or string
    .replace(/\n\s+/g, '') // Remove newlines & spaces within values
    .replace(/:\s/g, ':')  // Remove spaces in between property & values
    .replace(/\,\s/g, ',') // Remove space after commas
    .replace(/(%) ([\d$])/g, '$1$2') // Remove space between '100% 50%' in clip-path
    .replace(/\s\/\s/g, '/') // Remove spaces around `/` in hsl
    .replace(/;\s+/g, ';') // Remove newlines & spaces after semicolons
    .replace(/\)\s/g, ')') // Remove spaces after closing brackets
    .replace(/;`/, '`') // Remove final semicolons
  )
  // Replace slices global vars with single letter non-declared versions
  .replaceAll(/(const\s)?slices/g, 's')
  .replaceAll(/(const\s)?renderSlice/g, 'r')
  .replaceAll(/(const\s)?box/g, 'o')
  .replaceAll(/(const\s)?addSlice/g, 'a')
  .replaceAll(/(const\s)?reflection/g, 'e')
  .replaceAll(/(const\s)?handleClick/g, 'h')
  .replaceAll(/(const\s)?slice/g, 'l')
  .replaceAll(/(const\s)?prevBox/g, 'p')
  .replaceAll(/(const\s)?currBox/g, 'c')
  .replaceAll(/(const\s)?overlapX/g, 'x')
  .replaceAll(/(const\s)?overlapY/g, 'y')
  // Replace all strict equality comparison with abstract equality comparison
  .replaceAll('===', '==')

const minifiedJs = await minifyJs(js, options);

const code = minifiedJs.code
  // Replace all double quotes with backticks for consistency
  .replaceAll('"', '`')
  // Remove final semicolon
  .replace(/;$/, '');

const packed = cmdRegPack(code, {
  crushLengthFactor : parseFloat(0),
});

const html = readFileSync('src/index.html', 'utf8');

const inlined = html.replace(
  /<script[^>]*><\/script>/,
  `<script>${packed}</script>`,
);

const inlinedNonPacked = html.replace(
  /<script[^>]*><\/script>/,
  `<script>${code}</script>`,
);

const minifiedInlined = minifyHtml(inlined, {
  removeAttributeQuotes: true,
  collapseWhitespace: true,
});

const minifiedInlinedNonPacked = minifyHtml(inlinedNonPacked, {
  removeAttributeQuotes: true,
  collapseWhitespace: true,
});

const mangled = minifiedInlined
  .replace('<!DOCTYPE html><html>', '') // Remove doctype & HTML opening tags
  .replace(';</script>', '</script>') // Remove final semicolon
  .replace('<head>', '') // Remove head opening tag
  .replace('</head>', '') // Remove head closing tag
  .replace('"initial-scale=1"', 'initial-scale=1') // Remove initial-scale quotes
  .replace('<body>', '') // Remove body opening tag
  .replace('</body></html>', ''); // Remove closing tags

console.log(`Mangled: ${mangled.length}B`);

writeFileSync('index.nonpacked.html', minifiedInlinedNonPacked);
writeFileSync('index.watch.html', minifiedInlined);
writeFileSync('index.html', mangled);
