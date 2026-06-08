import { writeFileSync } from 'fs';

const V = 'v=21', MV = 'v=7';
const CAL_URL = 'https://calendly.com/pfg_coaching_pbf/scale-your-agency';
// TODO: replace with the creator-call Calendly link when provided. While empty, creators use the application form.
const CAL_CREATOR = '';
const CAL_EMBED = CAL_URL + '?hide_gdpr_banner=1&background_color=0c0c0f&text_color=f6f6f8&primary_color=00aff0';
const calAssets = '<link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css"><script src="https://assets.calendly.com/assets/external/widget.js" async></script>';
const calBtn = (label) => `<a href="${CAL_URL}" target="_blank" rel="noopener" onclick="if(window.Calendly){Calendly.initPopupWidget({url:'${CAL_EMBED}'});return false}" class="btn btn--neon btn--lg">${label}</a>`;
const calInline = `<div class="calendly-inline-widget" data-url="${CAL_EMBED}"></div>`;
// Stream Hookups clips: add more filenames here (drop the files in public/assets/videos/) and rebuild.
const STREAM_CLIPS = ['stream-1.mp4', 'stream-2.mp4'];
const streamCarousel = `
<section class="section" id="stream-clips"><div class="wrap">
  <header class="section__head reveal"><p class="eyebrow">Stream Hookups</p><h2 class="section__title">Our creators, <span class="grad">on stream.</span></h2><p class="section__lead">Real clips of our creators featured on big streams. More dropping all the time.</p></header>
  <div class="vcarousel" data-vcarousel>
    <button class="vcarousel__btn vcarousel__btn--prev" type="button" aria-label="Previous video">&#8249;</button>
    <div class="vcarousel__viewport"><div class="vcarousel__track">${STREAM_CLIPS.map(c => `<div class="vcarousel__slide"><video src="/assets/videos/${c}#t=0.1" controls preload="metadata" playsinline></video></div>`).join('')}</div></div>
    <button class="vcarousel__btn vcarousel__btn--next" type="button" aria-label="Next video">&#8250;</button>
    <div class="vcarousel__dots"></div>
  </div>
</div></section>`;
const NAV_LINKS = [
  ['/services', 'Services'],
  ['/podcasts-streams', 'Podcasts &amp; Streams'],
  ['/agencies', 'For Agencies'],
  ['/about', 'About'],
];

const head = (title, desc, path) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="canonical" href="https://premiumfangirls.com${path}" />
<meta name="theme-color" content="#060608" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Premiumfangirls" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="https://premiumfangirls.com/assets/og.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/png" href="/assets/logo-512.png?${V}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/styles.css?${V}" />
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>`;

const nav = () => `
<header class="nav nav--solid" id="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="/" aria-label="Premiumfangirls home">
      <img src="/assets/logo.png?${V}" alt="Premiumfangirls logo" width="1196" height="444" />
    </a>
    <nav class="nav__links" aria-label="Primary">
      ${NAV_LINKS.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n      ')}
    </nav>
    <a href="/apply" class="btn btn--neon nav__cta">Apply Now</a>
    <button class="nav__burger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav__mobile" id="mobileMenu" hidden>
    ${NAV_LINKS.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n    ')}
    <a href="/apply" class="btn btn--neon">Apply Now</a>
  </div>
</header>`;

const footer = () => `
<footer class="footer">
  <div class="wrap footer__inner">
    <div class="footer__brand">
      <img src="/assets/logo.png?${V}" alt="Premiumfangirls" width="1196" height="444" />
      <p>A Florida-based creator management and production company. Management, marketing, brand building, production, podcasts, streams, and monetization. One team behind every creator.</p>
      <p class="footer__of">Managing creators on <img class="of-logo" src="/assets/onlyfans.png?v=11" alt="OnlyFans" width="512" height="512" /></p>
    </div>
    <nav class="footer__nav" aria-label="Footer">
      <a href="/services">Services</a>
      <a href="/podcasts-streams">Podcasts &amp; Streams</a>
      <a href="/agencies">For Agencies</a>
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

const subhero = (eyebrow, h1, accent, p, ctas) => `
<section class="subhero">
  <p class="eyebrow">${eyebrow}</p>
  <h1>${h1} <span class="grad">${accent}</span></h1>
  <p>${p}</p>
  <div class="subhero__cta">${ctas}</div>
</section>`;

const ctaBand = (title, accent) => `
<section class="finalcta">
  <div class="finalcta__overlay"></div>
  <div class="wrap finalcta__content reveal">
    <h2>${title}<br/><span class="grad">${accent}</span></h2>
    <a href="/apply" class="btn btn--neon btn--lg">Apply Now &nbsp;&rarr;</a>
  </div>
</section>`;

const btnApply = `<a href="/apply" class="btn btn--neon btn--lg">Apply Now &nbsp;&rarr;</a>`;

const FORM = `
<form class="form" id="applyForm" novalidate>
  <div class="seg" role="tablist" aria-label="What are you applying for?">
    <button type="button" class="seg__btn is-active" data-goal="creator" role="tab" aria-selected="true">I'm a Creator</button>
    <button type="button" class="seg__btn" data-goal="coaching" role="tab" aria-selected="false">I'm an Agency</button>
  </div>

  <div class="form__creatorFlow">
    <div class="form__row">
      <label>Full name<input type="text" name="name" autocomplete="name" required /></label>
      <label>Email<input type="email" name="email" autocomplete="email" required /></label>
    </div>
    <div class="form__row">
      <label>State / City<input type="text" name="location" /></label>
      <label>Instagram / main social<input type="text" name="social" placeholder="@username" /></label>
    </div>
    <div class="form__row">
      <label>What do you do?
        <select name="status">
          <option value="">Select&hellip;</option>
          <option>Creator, just starting out</option>
          <option>Creator, already earning</option>
          <option>Model / influencer</option>
          <option>Musician / artist</option>
        </select>
      </label>
      <label>Which package fits you?
        <select name="package">
          <option value="">Select&hellip;</option>
          <option>Full Service Management</option>
          <option>Remote Management</option>
          <option>24/7 Chatting</option>
          <option>Not sure yet</option>
        </select>
      </label>
    </div>
    <label class="form__full">Tell us about your goals
      <textarea name="message" rows="4" placeholder="Where you're at, where you want to be"></textarea>
    </label>
    <label class="form__check">
      <input type="checkbox" name="age" required />
      <span>I confirm I am 18 years or older and agree to be contacted.</span>
    </label>
    <button type="submit" class="btn btn--neon btn--lg btn--block">Send My Application</button>
    <p class="form__note">By applying you agree to our privacy practices. We never share your details.</p>
    <div class="form__success" id="formSuccess" hidden>
      <h3>You're in. &#127796;</h3>
      <p>Your application landed. A member of the Premiumfangirls team will reach out within 24 hours, so keep an eye on your inbox.</p>
    </div>
  </div>

  <div class="form__agencyFlow" hidden>
    <div class="agency-cta">
      <h3>Doing $10k+ a month?</h3>
      <p>We work with established agencies to source, brand, and launch a new earning creator with you. Book a discovery call to see if we are a fit.</p>
      ${calBtn('Book a Discovery Call')}
      <p class="form__note">Opens a scheduling window. Pick any time that works.</p>
    </div>
  </div>
</form>`;

const layout = (o) => head(o.title, o.desc, o.path) + nav() + `\n<main id="main">` + o.body + `</main>` + footer();

const pages = [];

/* ---------- Services overview ---------- */
pages.push({ slug: 'services', title: 'Services | Premiumfangirls', desc: 'Full service management, remote management, and 24/7 chatting for creators, plus coaching for agencies.', path: '/services',
  body: subhero('What We Offer', 'Pick how much you want', 'handled.',
    'From running your entire brand to simply keeping your inbox converting around the clock, there is a setup for exactly where you are right now.', btnApply) + `
<section class="section"><div class="wrap"><div class="cards">
  <a class="card reveal" href="/full-service-management"><div class="card__ico">&#128640;</div><h3>Full Service Management</h3><p>We run the whole thing. Social media, your subscription page, brand planning, 24/7 chatting, podcasts, streams, and clipping. You create, we handle the business.</p><span class="card__more">Learn more &rarr;</span></a>
  <a class="card reveal" href="/remote-management"><div class="card__ico">&#128225;</div><h3>Remote Management</h3><p>Want your socials run without the podcasts and streams? We manage all your platforms and keep a clipper team feeding your funnel every day.</p><span class="card__more">Learn more &rarr;</span></a>
  <a class="card reveal" href="/chatting"><div class="card__ico">&#128172;</div><h3>24/7 Chatting</h3><p>Just need your inbox handled? Trained chatters work your DMs around the clock so no tip, sale, or fan ever slips away.</p><span class="card__more">Learn more &rarr;</span></a>
  <a class="card reveal" href="/podcasts-streams"><div class="card__ico">&#127908;</div><h3>Podcasts &amp; Streams</h3><p>We put our creators in the room. Podcast features including The 305 Podcast with Fresh from Fresh N Fit, plus stream hookups with big names.</p><span class="card__more">Learn more &rarr;</span></a>
  <a class="card reveal" href="/agencies"><div class="card__ico">&#127891;</div><h3>For Agencies</h3><p>Doing $10k+/mo? We work together to source, brand, and launch a new earning creator for your roster, set up and earning by month end.</p><span class="card__more">Learn more &rarr;</span></a>
  <a class="card reveal" href="/full-service-management"><div class="card__ico">&#127909;</div><h3>Production &amp; Clipping</h3><p>An in-house team shooting photos and video, plus a clipper team turning your content into scroll stopping clips. Included in full service.</p><span class="card__more">Learn more &rarr;</span></a>
</div></div></section>` + ctaBand('Not sure which fits?', 'Apply and we will tell you straight.') });

/* ---------- Full service ---------- */
pages.push({ slug: 'full-service-management', title: 'Full Service Management | Premiumfangirls', desc: 'We run your social media, subscription page, brand, 24/7 chatting, podcasts, streams, and clipping. You create, we handle the business.', path: '/full-service-management',
  body: subhero('Full Service Management', 'We run', 'the whole thing.',
    'Your brand, your socials, your page, your chatting, your content, and your media. You create. We handle the business behind it.', btnApply) + `
<section class="section"><div class="wrap">
  <header class="section__head reveal"><p class="eyebrow">What's Included</p><h2 class="section__title">Everything, <span class="grad">actually handled.</span></h2></header>
  <ul class="incl">
    <li class="reveal"><span class="incl__ico">&#128241;</span><div><b>Social media management</b><span>We run and grow all of your platforms with a real content and posting strategy.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#128179;</span><div><b>Subscription page management</b><span>Your page is run for you. Pricing, posting, upsells, and retention dialed in.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#129513;</span><div><b>Brand planning</b><span>Positioning, identity, and a long term plan that keeps you relevant and bankable.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#128172;</span><div><b>24/7 chatting</b><span>Trained chatters working your inbox around the clock so nothing is left on the table.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#127908;</span><div><b>Podcasts</b><span>Get featured on our shows and podcast partners, including The 305 Podcast with Fresh from Fresh N Fit.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#127918;</span><div><b>Streams</b><span>We connect you with big streamers and set you up for collabs that grow your name.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#9986;&#65039;</span><div><b>Clipping</b><span>Our clipper team turns your long form and streams into short clips built to go viral.</span></div></li>
  </ul>
</div></section>` + ctaBand('Ready to hand it off?', 'Real work. Real results.') });

/* ---------- Remote management ---------- */
pages.push({ slug: 'remote-management', title: 'Remote Management | Premiumfangirls', desc: 'Full service management run remotely. Brand planning, page management, 24/7 chatting, and all your social media. Everything except podcasts and streams.', path: '/remote-management',
  body: subhero('Remote Management', 'Full service,', 'run remotely.',
    'Everything we do in full service management, handled remotely. Brand planning, your page, all of your social media, and 24/7 chatting. The only thing we leave out is podcasts and streams.', btnApply) + `
<section class="section"><div class="wrap">
  <header class="section__head reveal"><p class="eyebrow">What's Included</p><h2 class="section__title">Still <span class="grad">full service.</span></h2><p class="section__lead">Same team, same work, handled from anywhere. The only difference from full service management is no podcasts and no streams.</p></header>
  <ul class="incl">
    <li class="reveal"><span class="incl__ico">&#128241;</span><div><b>Social media management</b><span>We run and grow all of your platforms with a real content and posting strategy.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#128179;</span><div><b>Subscription page management</b><span>Your page is run for you. Pricing, posting, upsells, and retention dialed in.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#129513;</span><div><b>Brand planning</b><span>Positioning, identity, and a long term plan that keeps you relevant and bankable.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#128172;</span><div><b>24/7 chatting</b><span>Trained chatters working your inbox around the clock so nothing is left on the table.</span></div></li>
    <li class="reveal"><span class="incl__ico">&#9986;&#65039;</span><div><b>Clipping</b><span>Our clipper team cuts your content into short clips built to travel across every platform.</span></div></li>
  </ul>
</div></section>
<section class="section"><div class="wrap">
  <header class="section__head reveal"><p class="eyebrow">Platforms We Run</p><h2 class="section__title">Everywhere your <span class="grad">audience is.</span></h2></header>
  <ul class="platforms reveal"><li>TikTok</li><li>Twitter</li><li>Instagram</li><li><b>Snapchat</b></li><li>YouTube</li><li>YouTube Shorts</li></ul>
  <p class="note reveal">The only thing not included is podcasts and streams. Want those too? That is our <a href="/full-service-management">full service management</a>.</p>
</div></section>` + ctaBand('Want full service, remotely?', 'Let us take the wheel.') });

/* ---------- Chatting ---------- */
pages.push({ slug: 'chatting', title: '24/7 Chatting | Premiumfangirls', desc: 'Trained chatters working your DMs around the clock so no fan, tip, or sale ever slips through.', path: '/chatting',
  body: subhero('24/7 Chatting', 'Your inbox,', 'always converting.',
    'Trained chatters working your DMs around the clock so no fan, no tip, and no sale ever slips through. This is our smaller package for creators who just need the conversations handled.', btnApply) + `
<section class="section"><div class="wrap"><div class="cards">
  <article class="card reveal"><div class="card__ico">&#128336;</div><h3>Around the clock</h3><p>Real coverage 24 hours a day, 7 days a week. Your fans always get a fast, on brand reply.</p></article>
  <article class="card reveal"><div class="card__ico">&#127919;</div><h3>Trained to convert</h3><p>Our chatters know how to build connection and turn conversations into tips and sales.</p></article>
  <article class="card reveal"><div class="card__ico">&#128153;</div><h3>Sounds like you</h3><p>We learn your voice so every message feels personal, never copy and paste.</p></article>
  <article class="card reveal"><div class="card__ico">&#128178;</div><h3>More revenue</h3><p>Better PPV, more tips, stronger retention. We only win when you win.</p></article>
</div></div></section>` + ctaBand('Just want chatting handled?', 'We have got the inbox.') });

/* ---------- For Agencies ---------- */
pages.push({ slug: 'agencies', title: 'For Agencies | Premiumfangirls', desc: 'For agencies doing $10k+/mo. We work together to source, brand, and launch a new earning creator. Bunnyworks CRM, chat team, and marketing set up, earning by the end of the month.', path: '/agencies',
  body: subhero('For Agencies Doing $10k+/mo', 'We launch your next', 'earning creator.',
    'For agencies already doing over $10k a month. We work together to source and launch a fresh, brandable creator, fully set up and earning by the end of the month. Book a discovery call to see if we are a fit.', calBtn('Book a Discovery Call')) + `
<section class="section"><div class="wrap">
  <header class="section__head reveal"><p class="eyebrow">The Offer</p><h2 class="section__title">Exactly what we do <span class="grad">together.</span></h2><p class="section__lead">One offer, done with you from start to finish. By the end of the month, your new creator should be earning.</p></header>
  <ul class="incl">
    <li class="reveal"><span class="incl__num">1</span><div><b>We source the creator</b><span>We find you a fresh, brandable creator to build around.</span></div></li>
    <li class="reveal"><span class="incl__num">2</span><div><b>Interview call, together</b><span>We run the interview call together and lock her in.</span></div></li>
    <li class="reveal"><span class="incl__num">3</span><div><b>Branding call, together</b><span>We do the branding call together and shape her whole identity.</span></div></li>
    <li class="reveal"><span class="incl__num">4</span><div><b>Bunnyworks CRM setup</b><span>I set you up on the Bunnyworks CRM so your operation is organized from day one.</span></div></li>
    <li class="reveal"><span class="incl__num">5</span><div><b>My chat team</b><span>I plug in my chat team to work her inbox around the clock.</span></div></li>
    <li class="reveal"><span class="incl__num">6</span><div><b>Marketing plan and socials</b><span>We map the marketing plan and run her socials: Instagram, TikTok, Twitter, and Snapchat.</span></div></li>
    <li class="reveal"><span class="incl__num">+</span><div><b>Clippers, on request</b><span>Want clippers? We offer a dedicated clipper team as an add-on.</span></div></li>
    <li class="reveal"><span class="incl__num">&#10003;</span><div><b>Earning by month end</b><span>By the end of the month, she should be making money. That is the whole point.</span></div></li>
  </ul>
  <p class="note reveal">This is for established agencies doing $10k+ a month. If you are a creator, head to <a href="/services">our services</a> instead.</p>
</div></section>
<section class="finalcta">
  <div class="finalcta__overlay"></div>
  <div class="wrap finalcta__content reveal">
    <h2>See if we are<br/><span class="grad">a fit.</span></h2>
    ${calBtn('Book a Discovery Call')}
  </div>
</section>` + calAssets });

/* ---------- Podcasts & Streams ---------- */
pages.push({ slug: 'podcasts-streams', title: 'Podcasts & Streams | Premiumfangirls', desc: 'We connect creators with podcasts and streams that get them seen, including The 305 Podcast with Fresh from Fresh N Fit.', path: '/podcasts-streams',
  body: subhero('Podcasts &amp; Streams', 'We put you', 'in the room.',
    'We connect our creators with podcasts and streams that get them seen by millions, including The 305 Podcast with Fresh from the Fresh N Fit Podcast.', btnApply) + `
<section class="section"><div class="wrap">
  <header class="section__head reveal"><p class="eyebrow">Shows &amp; Hookups</p><h2 class="section__title">Built-in <span class="grad">media reach.</span></h2></header>
  <div class="pods">
    <article class="pod reveal"><div class="pod__art has-img"><img src="/assets/podcast-305.webp?v=17" alt="The 305 Podcast" width="1100" height="495" /></div><div><h3>The 305 Podcast</h3><p class="pod__host">Hosted by Fresh of the Fresh N Fit Podcast</p><p>Our flagship show. Real conversations on culture, creators, and the business, reaching millions every episode and turning guests into names people know.</p><span class="pod__tag">Flagship</span></div></article>
    <article class="pod reveal"><div class="pod__art has-img"><img src="/assets/podcast-freshnfit.webp?v=17" alt="Fresh N Fit Podcast" width="1100" height="611" /></div><div><h3>Fresh N Fit Podcast</h3><p class="pod__host">Partner show</p><p>One of the biggest podcasts in the space. We collaborate with Fresh N Fit to put our creators in front of a huge, hyper engaged audience.</p><span class="pod__tag">Partner</span></div></article>
    <article class="pod reveal"><div class="pod__art"><span>&#127918;</span></div><div><h3>Stream Hookups</h3><p class="pod__host">Collabs with big streamers</p><p>We connect our creators with established streamers for collabs and features that put your name in front of a brand new audience.</p><span class="pod__tag">Streams</span></div></article>
    <article class="pod reveal"><div class="pod__art"><span>&#9986;&#65039;</span></div><div><h3>Clips That Travel</h3><p class="pod__host">Clipper team</p><p>Every appearance gets cut into short clips that spread across TikTok, Reels, and Shorts, so one moment becomes hundreds of touchpoints.</p><span class="pod__tag">Clipping</span></div></article>
  </div>
</div></section>` + streamCarousel + ctaBand('Want the reach?', 'We will put you on.') });

/* ---------- About ---------- */
pages.push({ slug: 'about', title: 'About | Premiumfangirls', desc: 'A Florida-based creator management and production company built to actually move the needle, not just collect a cut.', path: '/about',
  body: subhero('About Premiumfangirls', 'Real work.', 'Real results.',
    'A Florida-based creator management and production company built to actually move the needle, not just collect a cut.', btnApply) + `
<section class="section"><div class="wrap">
  <header class="section__head reveal"><p class="eyebrow">Who We Are</p><h2 class="section__title">A team that <span class="grad">actually does the work.</span></h2><p class="section__lead">Too many creators get burned by agencies that overpromise, deliver nothing, and still take half. We built Premiumfangirls to be the opposite. One team handling management, marketing, brand building, production, podcasts, streams, and monetization, with the receipts to back it up.</p></header>
</div></section>
<section class="stats" aria-label="Results"><div class="wrap stats__grid">
  <div class="stat reveal"><span class="stat__num" data-count="850" data-suffix="M+">0</span><span class="stat__label">Content views generated</span></div>
  <div class="stat reveal"><span class="stat__num" data-count="70" data-suffix="+">0</span><span class="stat__label">Creators managed</span></div>
  <div class="stat reveal"><span class="stat__num" data-count="24" data-suffix="/7">0</span><span class="stat__label">Management and chatting</span></div>
  <div class="stat reveal"><span class="stat__num" data-count="40" data-prefix="$" data-suffix="M+">0</span><span class="stat__label">Creator revenue driven</span></div>
</div></section>
<section class="section"><div class="wrap"><div class="cards">
  <article class="card reveal"><div class="card__ico">&#129309;</div><h3>Straight with you</h3><p>No empty promises and no disappearing act. We tell you what we will do, then we go do it.</p></article>
  <article class="card reveal"><div class="card__ico">&#127881;</div><h3>Fair splits</h3><p>Zero upfront and a performance based share. We only make money when you make money.</p></article>
  <article class="card reveal"><div class="card__ico">&#128293;</div><h3>Built to last</h3><p>We build careers and brands, not quick spikes. The goal is to keep you winning for years.</p></article>
</div></div></section>` + ctaBand('Like how that sounds?', 'Let us get to work.') });

/* ---------- Apply ---------- */
pages.push({ slug: 'apply', title: 'Apply | Premiumfangirls', desc: 'Tired of agencies that promise the world and deliver nothing? Apply to Premiumfangirls. Real work, real results.', path: '/apply',
  body: subhero('Work With Us', 'Real work.', 'Real results.',
    'Tired of agencies that promise the world, deliver nothing, then take half your money? That is not us. Tell us about yourself and let us talk.', '') + `
<section class="section apply"><div class="wrap apply__grid">
  <div class="apply__intro reveal">
    <p class="eyebrow">Apply</p>
    <h2 class="section__title">Tell us where <span class="grad">you want to be.</span></h2>
    <p class="section__lead">Whether you want us to manage and produce your brand, or you run an agency and want to work with us, this is the door. Confidential, no pressure, real humans on the other side.</p>
    <ul class="ticks"><li>Replies within 24 hours</li><li>100% confidential</li><li>Must be 18+ to apply</li></ul>
  </div>
  ${FORM}
</div></section>` + calAssets });

for (const p of pages) {
  writeFileSync(`public/${p.slug}.html`, layout(p));
}
console.log('built', pages.length, 'pages:', pages.map(p => p.slug).join(', '));
