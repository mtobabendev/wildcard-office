# ChatGPT regression log

## 2026-09-16 — Drawer features removed during layout cleanup

- User request: fix obstructive overlays, with mobile first, watch second, desktop third.
- Assistant mistake (commit 56eddc7): hid Lucy, Erica, and Penny's entrance videos with CSS while leaving playback calls active; replaced the rotating tool carousel with a grid; disabled the flying message sequence and moved it into a disclosure outside the drawer.
- Visible result: missing characters, messages absent from the Tony Stark scene, and overlapping tool cards because carousel margins remained on the replacement grid.
- Verification failure: width and open/close checks passed, but those checks did not verify preservation of the requested characters and animations or inspect the tool cards visually.
- User report: supplied mobile and desktop screenshots, then explicitly requested restoration of the tool spinner, Lucy, Erica, and flying messages across all screen sizes.
- Correction: restored the 3D tool carousel, moved Lucy/Erica/Penny into a visible responsive cast row, and restored all 15 flying messages in a bounded area attached to the Tony Stark panel. Drawer videos now play on open and pause on close.
- Validation: browser checks at 200, 390, 418, and 1440px verified character dimensions and playback, actual changes in carousel/message transforms over time, no horizontal drawer overflow, video pause on close, and reduced-motion fallback. Mobile screenshots were inspected. External YouTube playback was not verified in the isolated local test.

This entry records the assistant's implementation and verification errors. It is a repository record available for reuse by the main site's future log; it does not claim that the main-site log integration already exists.
