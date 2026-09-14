# Design QA — TT NGFW device overview and Interfaces

final result: passed

## Evidence

- Source: Figma node `40013110:221259`; `docs/qa/figma-reference.png` (1920 × 1200).
- Browser implementation: `docs/qa/implementation-2.jpg` (1363 × 936 capture).
- Reference comparison: same initial NGFW-02 state, default light theme, full 1920 × 1200 CSS canvas rendered at 2/3 zoom into 1280 × 800 pixels. The source was downsampled to the same size. Remaining browser margins were cropped for comparison.
- Combined full-view evidence: `docs/qa/comparison-1.png` and `docs/qa/comparison-2.png`.
- Focused header, metrics and navigation comparison: `docs/qa/detail-2.png`.
- Ordinary responsive desktop: `docs/qa/desktop.jpg`, 1363 × 936 browser viewport.
- Mobile: `docs/qa/mobile.jpg`, 390 × 844 iframe viewport, captured inside the browser. The surrounding gray host is a QA fixture, not the application. Filter popover is visible in the final mobile capture.

## Findings and comparison history

1. P2 — Main workspace was shifted 8 CSS px to the right. Corrected the application column gap from 16 to 8 px. Comparison 2 confirms the panel, navigation and card grid align with the source.
2. P2 — Compact desktop bars crowded one another and navigation labels wrapped. Changed responsive bar sizing, reduced compact navigation type size and adjusted chart labels. Reference maximum bar width remains 28 px.
3. P2 — Mobile metric values crowded the percentage change. Stacked values and percentages at mobile width and increased card height. The final mobile capture confirms separation.

No remaining actionable P0/P1/P2 findings in the reviewed states.

## Required fidelity surfaces

- Typography: local Inter 400/600; 24 px headings/metrics, 14 px body, 12 px annotations at reference width. Correct labels and hierarchy. Minor rasterization/number spacing differences remain P3.
- Spacing: original 240 px sidebars, 24 px chart padding, 16 px grid gaps, 20 px corner radii and 1920 × 1200 composition retained. Compact layouts intentionally adapt to smaller windows.
- Colors: original neutral surfaces, blue/lavender cards, selected device fill and chart palette retained.
- Images: all icons, logo, avatar, initial line artwork and rings exported from Figma. No expired resource URLs or missing image requests in the verified state.
- Content: default device, counts, chart titles, metric values, device list and visible navigation match the supplied screen. Added form/empty/tooltip states use explicit prototype data.

## Browser interactions checked

- Search for NGFW-04 narrows the list; selecting it changes the heading and metrics.
- Unmatched search displays the empty state; reset restores the list.
- Cluster filtering returns Cluster-2-1 only; reset clears the filter.
- Routing collapses and expands; child items disappear and return.
- Total Projects changes the selected tab and rendered chart.
- Expand overview / Restore overview toggles the panel.
- Empty device name shows validation; NGFW-07 is added and selected.
- Reload restores the initial in-memory data as intended.
- Mobile filter controls are visible and operable.
- Responsive document width equals viewport width (1363 px desktop / 390 px mobile).
- No broken images after loading.
- No application-origin console errors were observed; browser-extension metadata errors were excluded.
- Production build completed successfully.

## Scope and follow-up

- Prototype only: no real device connections, authentication, API or persistence.
- Data in alternate states and tooltips is illustrative, as the Figma file provides visual examples rather than datasets.
- P3: small font rasterization differences and minor chip/badge spacing can be tuned against a production design system.
- The Overview and Interfaces screens are implemented. Other configuration sections still use summary dialogs.
- Tests do not cover every browser, screen-reader combination or intermediate responsive width.

## Interfaces screen QA — 2026-09-13

### Evidence

- Source visual truth: Figma node `40013082:133206`; `docs/qa/figma-interfaces.png`, 1920 × 1200 at 1× density.
- Rendered implementation: `http://localhost:5173/#interfaces`, captured in the Codex in-app Browser at 1920 × 1200 and at the user's 952 × 942 viewport. The browser API exposes these captures as inline task artifacts rather than filesystem paths.
- State: light theme, NGFW-02 selected for the source comparison, Section 1 active, all interface groups expanded, device-list width 240 px.
- Full-view comparison: the 1920 × 1200 browser capture and source were inspected together. MainBar, toolbar, 240 px device list, splitter, device header, 240 px DeviceNavigation, tabs, action bar and interface table align to the same major guides.
- Focused comparison: the header transition, active Interfaces row, tabs, action buttons, table header, hierarchical rows and status badges were readable in both artifacts. Separate crops were unnecessary because the 1× full-view captures preserved readable UI text and controls.

### Findings and comparison history

- Initial P2: the action bar left only 72 px between tabs and table, placing its controls and table 4–8 px above the Figma guides. Increased the action-bar track to 80 px; the post-fix 1920 × 1200 capture aligns the button center and table start with the source.
- Initial P2: the splitter allowed the device list to shrink to 180 px. Raised pointer, keyboard and ARIA minimums to 240 px. Browser verification reports `width: 240`, `aria-valuemin: 240`, and retains the card layout at the minimum.
- No remaining actionable P0/P1/P2 findings in the reviewed Interfaces states.

### Required fidelity surfaces

- Typography: local Inter 400/600 matches the source hierarchy at 24, 14 and 12 px; labels, rows and badge weights remain readable at both reviewed widths.
- Spacing and layout: major 1920 × 1200 guides match; 16 px panel gaps, 20 px radii, 40 px tabs, 80 px action region and 40 px data rows follow the Figma component geometry. At 952 px, the action bar and table scroll horizontally inside the content pane.
- Colors and tokens: neutral surfaces, selected blue device row, selected gray Interfaces row, blue active tab, and green/yellow/red/gray statuses match the supplied palette.
- Image quality: logo, avatar and icons reuse the existing Figma-exported SVG/PNG assets; no temporary Figma asset URLs are used by the application.
- Copy and content: Figma column labels, placeholder tab/action labels, NGFW-02 row data and header subtitle are retained. Other devices use clearly distinct illustrative datasets by request.

### Browser interactions checked

- Interfaces opens from DeviceNavigation and the back control restores Summary; URL state changes between `/` and `#interfaces`.
- Section tabs change selection; search narrows the interface dataset; hierarchy controls collapse and restore child rows.
- Every device produces a distinct interface dataset. Verified row counts: NGFW-01 10, Cluster-2-1 11, NGFW-02 16, NGFW-03 9, NGFW-04 10, NGFW-05 12, NGFW-06 9. Names and statuses also change per device.
- The device-list splitter stops at 240 px. At its maximum on a 1920 px viewport, the list switches to the Figma table variant; Home restores the 240 px card variant.
- Interface table scroll width exceeds its content viewport at 952 px, keeping all columns reachable.
- No application console errors were observed. Production build and all four Sites tests passed.

final result: passed
