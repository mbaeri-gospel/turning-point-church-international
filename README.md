HEAD
# Turning Point Church International (TPCI) Website

A responsive static website built with HTML, CSS and vanilla JavaScript.

## Files
- `index.html` — page structure and labelled sections
- `styles.css` — responsive styling and layout
- `script.js` — mobile navigation, gallery lightbox and copyright year
- `assets/images/` — optimized WebP photographs used by the site

## Image placement
- `founder-1.webp` and `founder-2.webp`: Founder biography section
- `hero-blend.webp`: seamless, feather-blended composition of Hero 1, Hero 2 and Hero 3
- `gallery-*.webp`: all 83 images from the “other remainig pictures” archive plus Hero 4 (84 gallery images total)

Some gallery photographs are also reused as supporting images in the location and ministry/service sections.

## Run locally
Open `index.html` in a browser, or use a local static server.

## Deploy on Render
1. Create a new **Static Site** in Render and connect the GitHub repository.
2. Build command: leave blank.
3. Publish directory: `.`
4. Deploy.

## Details to add later
The founder's official name and biography, confirmed church history/vision/mission, branch addresses, service schedules, contact details, and official logo can be inserted when supplied.

All image assets are included in the project. The website uses Google Fonts from an external CDN.


## Official church branding
The supplied official Turning Point Church International emblem is stored at
`assets/images/tpci-official-logo.png` and is used in the website header and footer.
The browser favicon is provided as `favicon.png` and `favicon.ico`.
The founder section identifies **Pastor Silas Okechukwu**. His full biography
remains a placeholder until the approved biography text is supplied.


## LightRays hero animation
The home-page hero includes a restrained warm-white WebGL LightRays effect, adapted
from the supplied OGL component for this static HTML/CSS/JavaScript project.
It is layered between the existing blended hero photograph and its dark readability
overlay. Original section copy and image assets are preserved. OGL is loaded as an
ES module from esm.sh at runtime; no build step is required. The effect pauses when
the hero is off-screen and is disabled when the visitor requests reduced motion.
If WebGL or the OGL CDN is unavailable, the original hero remains visible.


## Typography and text animations
All non-hero content sections now use responsive, tightly tracked heading sizing
and smooth color transitions. Section headings, paragraphs, labels and supporting
text reveal letter by letter with a fade-in, upward slide and progressive blur
reduction as they enter the viewport. The hero headline uses a separate vertical
clip-window animation, sliding each letter down into view in sequence. Effects
use vanilla CSS/JavaScript, preserve the original copy and photographs, and
respect the visitor's reduced-motion preference.


## Gallery showcase update
The photo gallery now uses a gallery-scoped, horizontally scrollable circular showcase with drag, touch, wheel, arrow controls and the existing click-to-enlarge viewer. It reuses the existing gallery photographs. All new styles and interaction handlers are scoped to `#gallery`; the rest of the website is unchanged.


## Hero portal animation
The scroll-reversible portal opening is scoped exclusively to the `#home` hero. It uses the existing hero photograph and text. The other page sections, including the circular gallery, are not targeted by the portal styles or script. With JavaScript disabled or reduced motion enabled, the hero falls back to its static presentation.

# turning-point-church-international
ab04b5cee9b895ff2593f588f6a1f5bbd2a8d0f5
