# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable interaction decisions

- Keep the DeviceNavigation summary and collapse control pinned to the top of its scrolling navigation panel.
- Treat the divider between the device list and overview as a draggable splitter. Resize both panes continuously, support keyboard resizing, and preserve a usable minimum width for the overview.
- When the device-list pane reaches 30% of the viewport width, switch it from the compact `Adaptive=On` cards to the Figma `Adaptive=Off` table variant. Switch back below that threshold.
- Keep the device-list pane at least 240 px wide when it is resized with the splitter or keyboard.
- Give every device a distinct illustrative Interfaces dataset so changing the selected device visibly changes interface names, groups, statuses, types and row count.
- Load every expandable DeviceNavigation group collapsed; users open the groups they need.
- Show a disclosure chevron in the Interfaces table only when that interface has child rows.
- Keep icons in outlined interface action buttons dark enough to match the Figma controls against a white background.
- Base dashboard breakpoints on the dashboard pane width so dragging the device-list splitter triggers the same responsive reflow as resizing the browser window.
- Use the red TT logo from `public/assets/logo.svg` as the browser favicon.
- Render collapsed DeviceNavigation as the Figma `State=Off` control: a 48 × 48 px card containing only the `settings16` expand button.
- Animate DeviceNavigation between its expanded and collapsed states over 240 ms, cross-fading the two control sets and honoring `prefers-reduced-motion`.
- Animate parent navigation groups vertically when their child items expand or collapse; keep the child DOM mounted and remove closed rows from keyboard navigation.
- Keep Summary metric card dimensions, spacing, and typography fixed. Use four columns when four 190 px cards fit, two columns below 808 px, and one below 396 px.
- When the main navigation rail is collapsed, expand it as a 240 px overlay on hover and collapse it again on pointer leave without shifting the app grid.
- Keep the red main-navigation logo vertically stable during hover expansion and use its standard horizontal position beside the wordmark when expanded.
- Delay main-navigation hover expansion by 180 ms, while keeping pointer-leave collapse immediate.
- Remove the label gap in collapsed main-navigation rows so each icon is centered by itself; restore the 8 px gap on hover expansion.
- Use a 48 px collapsed main-navigation rail with 32 px square rows, and hide the expand control until the rail opens on hover.
