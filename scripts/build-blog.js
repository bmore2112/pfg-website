// Builds the blog: /blog index + /blog/<slug> post pages, and refreshes the
// blog URLs in sitemap.xml. Touches ONLY blog files + the blog rows of the
// sitemap, so it never clobbers the hand-edited pages.
//
// Posts live in content/blog/*.json:
//   { slug, title, date:"YYYY-MM-DD", excerpt, tags:[], category, readMins,
//     published:true|false, body:"<p>...</p>..." }
// published:false = draft (written by the daily agent, awaiting approval).

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const V = 'v=22', SV = 'v=24', MV = 'v=8', OFV = 'v=14';
const SITE = 'https://premiumfangirls.com';
// Live origin that actually serves assets today (custom domain not pointed yet).
// Used only for absolute og:image URLs so link previews resolve. Switch to SITE
// once premiumfangirls.com is live on Vercel.
const OG = 'https://pfg-website2.vercel.app';
const DIR = 'content/blog';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${months[m - 1]} ${d}, ${y}`;
};

const head = (title, desc, path, ogType = 'website') => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${SITE}${path}" />
<meta name="theme-color" content="#060608" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<meta property="og:type" content="${ogType}" />
<meta property="og:site_name" content="Premiumfangirls" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${SITE}${path}" />
<meta property="og:image" content="${OG}/assets/og.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/png" href="/assets/logo-512.png?${V}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/styles.css?${SV}" />`;

const nav = `
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="nav nav--solid" id="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="/" aria-label="Premiumfangirls home">
      <img src="/assets/logo.png?${V}" alt="Premiumfangirls logo" width="944" height="233" />
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="/services">Services</a>
      <a href="/podcasts-streams">Podcasts &amp; Streams</a>
      <a href="/blog">Blog</a>
      <a href="/about">About</a>
    </nav>
    <a href="/apply" class="btn btn--neon nav__cta">Apply Now</a>
    <button class="nav__burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav__mobile" id="mobileMenu" hidden>
    <a href="/services">Services</a>
    <a href="/podcasts-streams">Podcasts &amp; Streams</a>
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
    <a href="/apply" class="btn btn--neon">Apply Now</a>
  </div>
</header>
<main id="main">`;

const footer = `</main>
<footer class="footer">
  <div class="wrap footer__inner">
    <div class="footer__brand">
      <img src="/assets/logo.png?${V}" alt="Premiumfangirls" width="944" height="233" />
      <p>A Florida-based creator management and production company. Management, marketing, brand building, production, podcasts, streams, and monetization. One team behind every creator.</p>
      <p class="footer__of">Managing creators on <img class="of-logo" src="/assets/onlyfans.png?${OFV}" alt="OnlyFans" width="512" height="512" /></p>
    </div>
    <nav class="footer__nav" aria-label="Footer">
      <a href="/services">Services</a>
      <a href="/podcasts-streams">Podcasts &amp; Streams</a>
      <a href="/blog">Blog</a>
      <a href="/about">About</a>
      <a href="/apply">Apply</a>
    </nav>
  </div>
  <div class="wrap footer__legal">
    <p>&copy; <span id="year">2026</span> Premiumfangirls. All rights reserved. 18+ only. A Florida-based company.</p>
  </div>
</footer>
<script src="/main.js?${MV}" defer></script>
</body>
</html>`;

const ctaBand = `
<section class="finalcta">
  <div class="finalcta__overlay"></div>
  <div class="wrap finalcta__content reveal">
    <h2>Want this handled for you?<br/><span class="grad">Let us get to work.</span></h2>
    <a href="/apply" class="btn btn--neon btn--lg">Apply Now</a>
  </div>
</section>`;

// ---- Load posts ----
if (!existsSync(DIR)) { console.error('No content/blog dir. Nothing to build.'); process.exit(0); }
const all = readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => {
  const p = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8'));
  p._file = f;
  return p;
});
const posts = all.filter(p => p.published === true).sort((a, b) => (a.date < b.date ? 1 : -1));
const drafts = all.filter(p => p.published !== true);

mkdirSync('public/blog', { recursive: true });

// ---- Index page ----
const card = (p) => `
    <a class="bpost reveal" href="/blog/${p.slug}">
      <div class="bpost__meta"><span class="bpost__cat">${esc(p.category || (p.tags && p.tags[0]) || 'Guide')}</span><span class="bpost__date">${fmtDate(p.date)}</span></div>
      <h2 class="bpost__title">${esc(p.title)}</h2>
      <p class="bpost__excerpt">${esc(p.excerpt || '')}</p>
      <span class="bpost__more">Read article</span>
    </a>`;

const indexBody = `
<section class="subhero subhero--blog">
  <p class="eyebrow">The Premiumfangirls Blog</p>
  <h1>Creator growth, <span class="grad">handled.</span></h1>
  <p>Straight, no-fluff guides on growing on OnlyFans, monetizing your audience, and what is actually working in the industry right now. New posts drop regularly.</p>
</section>
<section class="section"><div class="wrap">
  ${posts.length ? `<div class="bgrid">${posts.map(card).join('')}</div>` : `<p class="section__lead" style="text-align:center">First posts are on the way. Check back soon.</p>`}
</div></section>${ctaBand}`;

const blogListDesc = 'No-fluff guides on growing on OnlyFans, monetizing your audience, and what is working in the industry right now, from the Premiumfangirls team.';
writeFileSync('public/blog.html', head('Blog | Premiumfangirls', blogListDesc, '/blog') + nav + indexBody + footer);

// ---- Post pages ----
for (const p of posts) {
  const tags = (p.tags || []).map(t => `<span class="bchip">${esc(t)}</span>`).join('');
  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: p.title, datePublished: p.date, dateModified: p.date,
    description: p.excerpt || '', author: { '@type': 'Organization', name: 'Premiumfangirls' },
    publisher: { '@type': 'Organization', name: 'Premiumfangirls', logo: { '@type': 'ImageObject', url: `${SITE}/assets/logo-512.png` } },
    mainEntityOfPage: `${SITE}/blog/${p.slug}`,
  };
  const body = `
<article class="bpage">
  <div class="wrap bpage__wrap">
    <p class="bpage__eyebrow"><a href="/blog">Blog</a> <span>/</span> ${esc(p.category || 'Guide')}</p>
    <h1 class="bpage__title">${esc(p.title)}</h1>
    <div class="bpage__meta"><span>${fmtDate(p.date)}</span>${p.readMins ? `<span>&middot;</span><span>${p.readMins} min read</span>` : ''}</div>
    <div class="bpage__tags">${tags}</div>
    <div class="bpage__body">${p.body || ''}</div>
    <p class="bpage__back"><a href="/blog">&larr; Back to all posts</a></p>
  </div>
</article>
<script type="application/ld+json">${JSON.stringify(ld)}</script>${ctaBand}`;
  writeFileSync(`public/blog/${p.slug}.html`, head(`${p.title} | Premiumfangirls`, p.excerpt || '', `/blog/${p.slug}`, 'article') + nav + body + footer);
}

// ---- Sitemap: refresh blog rows only ----
const smPath = 'public/sitemap.xml';
if (existsSync(smPath)) {
  let sm = readFileSync(smPath, 'utf8');
  sm = sm.replace(/\s*<url><loc>[^<]*\/blog[^<]*<\/loc>[\s\S]*?<\/url>/g, ''); // drop old blog rows
  const rows = [`  <url><loc>${SITE}/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`]
    .concat(posts.map(p => `  <url><loc>${SITE}/blog/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`));
  sm = sm.replace(/\n?<\/urlset>/, '\n' + rows.join('\n') + '\n</urlset>');
  writeFileSync(smPath, sm);
}

console.log(`Built blog: ${posts.length} published post(s)${drafts.length ? `, ${drafts.length} draft(s) pending approval (${drafts.map(d => d.slug).join(', ')})` : ''}.`);
