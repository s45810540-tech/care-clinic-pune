# Real clinic photographs

Drop the clinic's photos into **this folder** with these exact file names, then
rebuild (`npm run build`) — they appear automatically on the Gallery, About,
Contact and Home pages, replacing the generated placeholder artwork:

| File name         | Photo                                                            |
| ----------------- | ---------------------------------------------------------------- |
| `storefront.jpg`  | The entrance with the team standing outside                      |
| `signboard.jpg`   | The “केअर क्लिनिक” board above the door                          |
| `interior.jpg`    | The consultation room / office interior                          |
| `team.jpg`        | The group photo of the clinic staff indoors                      |

`.jpg`, `.jpeg`, `.png`, `.webp` and `.avif` are all accepted (the first match
per name wins).

**Before adding, please compress each photo:**

- Max width ~1600 px, target **≤ 250 kB per file** (WebP preferred).
- iPhone photos are usually 3–6 MB — resize them first (any free tool:
  `squoosh.app`, `tinyjpg.com`, or `npx sharp-cli`).
- Keep faces and the signboard readable; crop out blurry edges.

Until a file exists the site keeps showing the placeholder SVG art — nothing
breaks and no 404s are logged. The Gallery page's “[PLACEHOLDER]” note hides
itself as soon as at least one real photo is present.
