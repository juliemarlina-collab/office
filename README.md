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


## v4.1 — three styles, one section list, real export
- **Three design styles**, matching the Web Wizard PoliPD studio: Minimal profesional, Tajuk besar dan kontras (Bold), Mesra dan berwarna (Friendly). They replace the previous six. The old six are still defined in `script.js` and are swapped out by `site-template.js`.
- **New file `site-template.js`** generates the website. It must load after `interface-i18n.js` and before `studio-v4.js` (already linked in `index.html`).
- **Section editor fixed.** Editing, hiding, reordering, adding or removing a section now changes the real page and its menu. Sections no longer repeat below the footer.
- **Website name and hero image** fields added under Content. The image is resized in the browser and exported as `assets/hero.jpg`.
- **One export.** "Muat turun ZIP" gives `index.html`, `style.css`, `script.js`, `assets/` (when an image is added) and `README.txt` with GitHub Pages steps. The separate "Export HTML" button is hidden.
- **Full BM / EN workspace.** Toolbar, section editor, action buttons and status messages follow the language switch. Switching language no longer clears the user's edited text.
- **Numbered steps 1 to 6** on the toolbar, and a "what to do next" note after download that links to the PoliPD publishing guide.
- Version label is V4.2 everywhere.
- Projects saved by v4.0 still open; their old style falls back to Minimal and their sections reset.
- `studio-fix.js` is not loaded by `index.html` and can be deleted.
- **Sample website images** from the Web Wizard PoliPD gallery (`assets/samples/`, 12 images) appear on the welcome page (three style cards) and on the three style buttons in step 2, matched to the chosen website type. They are style examples, not an exact preview of the generated site.
- **3D toolbar icons** for steps 1 to 6 (`assets/icons/tool-*.webp`). The halo around the supplied PNGs was removed and each was resized to 192 px.
- **Moving sample ring** on the welcome page: all 12 PoliPD sample websites in a curved carousel under the hero. It moves on its own, can be swiped, has a Jeda / Main button, and falls back to a plain scrolling row when the device asks for reduced motion. Tapping a sample opens Studio with that type and style.
- **Interactive process flow** (five steps: Jenis, Gaya, Kandungan, Muat turun, Terbit). The launch rocket travels to the chosen step; steps can be tapped or stepped through with Sebelumnya / Seterusnya, and the flow plays once by itself when scrolled into view.
- **BM wording pass (Malaysian usage).** Labels that were still in English in BM mode are now translated (hero caption, type carousel, icon ribbon, colour-sample upload, screen-reader labels). "Blueprint & Token" is now "Ringkasan reka bentuk", "Imej hero" is "Imej utama", and the icon prompt now asks for icons, not photographs.


## V4.2: AI fill from a CV
A new card above the toolbar (⚡ *Ada CV atau maklumat?*). Participants copy one prompt, paste it into ChatGPT, Claude or Gemini with their CV, then paste the JSON answer back. Studio fills the site name, headline, introduction, button and 3, 5 or 7 sections in one click.

## V4.2: four website types (same as Web Wizard PoliPD)
`polipd-types.js` keeps only the four types taught in the workshop, in the Kenali order and with the same names:
Laman PdP · Laman pengurusan kerja · Acara · Portfolio. Each type has five sections that match its "must have" list.
Old saved projects that used a removed type open as Laman PdP.
