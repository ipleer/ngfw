# Design QA — TT NGFW device overview

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
- Only the selected overview screen is implemented. Neighboring sections have summary dialogs, not full configuration pages.
- Tests do not cover every browser, screen-reader combination or intermediate responsive width.
