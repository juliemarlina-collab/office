Web Wizard Studio v4.0 — Complete Deployable Package

Upload all files and assets from this folder to the ROOT of your GitHub repository, replacing existing files. Do not delete the assets folder. GitHub Pages should serve index.html.

Features: icon toolbar, one-at-a-time settings, responsive canvas, editable custom sections, local autosave, project JSON import/export, ZIP export (self-contained index.html), readiness checks, gallery icons.

Note: The exported ZIP intentionally contains a self-contained index.html and README.txt, not separated CSS/JS files. Project saves are local to the same browser/device. Publishing checklist is basic, not a full accessibility audit. Test before replacing the live branch.

## v4.0.1 icon correction
- Toolbar uses semantic SVG icons: Type (grid), Style (palette), Content (text), Colours (colour wheel), More (sliders), Sections (page layout).
- Gallery icons use an explicit category-to-WebP map instead of their array position.
- Existing hero and all original WebP assets remain unchanged.
- Upload all extracted files to the root of your repository, replacing matching files.

## v4.0.2 — supplied 3D icon integration
The uploaded transparent icons are resized and converted to WebP. Check Website uses a checklist and Export ZIP uses a download icon. The gallery uses books for Education, a growth chart for Dashboard, a trophy for Events, and a target for Landing/Campaign. All 12 gallery IDs now match the actual CATALOG keys (including office, conference, landing, games). Six main editor controls retain readable semantic SVG icons. Other uploaded assets are packaged for later use.


## v4.0.3 Animated storytelling
- Welcome hero retains Muslimah Wizard and adds **FROM IDEA TO LIVE** caption.
- Animated website-type carousel: 12 types; tap any type to open its Studio template. Hover/focus pauses motion.
- Four-step process timeline reveals as users scroll; progress indicator fills in sequence.
- Reduced-motion accessibility supported.
- New files: `motion-v4.css` and `motion-v4.js`; both are already linked in `index.html`.
- Upload **all** extracted contents, preserving `assets/icons/`.


## v4.0.4 — Stability repairs
- Corrected gallery category icon mapping, including after language switches.
- Fixed custom sections appearing after the footer; now inserted into the main document.
- Project JSON stores and restores the language, and resets clear section changes.
- Fixed active editor panel refresh after opening a project.
- Improved touch sizing, mobile action buttons and editor panel scrolling.
- Unlinked legacy studio-fix.js archived as studio-fix.unused.txt.
- No new website types or template families added.
- Browser smoke test recommended before publishing: BM/EN, each tool, sections, save/open, reset, mobile, ZIP.
