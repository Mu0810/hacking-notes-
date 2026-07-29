# Ethical Hacking · Interactive Field Notes

A single-page interactive study site built from a one-page handwritten Ethical Hacking cheat sheet.
No build step, no dependencies — plain HTML, CSS and vanilla JS.

## What's covered

| Section | Content |
| --- | --- |
| Introduction & Key Terms | Definition, goal, motto, and the 5 core terms (hacker, cracker, ethical hacker, vulnerability, exploit) |
| Phases (P.T.E.S.T) | All 6 phases with tasks, deliverable and a common pitfall each |
| Information Gathering | Passive vs active recon, incl. OSINT |
| Scanning | Host discovery → port scanning → service enumeration → OS detection → vuln scanning |
| Common Tools | 9 tools with category filters and copyable starter commands |
| Types of Attacks | 5 attack families, their variants, and the defence for each |
| Principles / CIA Triad / Tips | Interactive checklist, clickable CIA triad diagram, field tips |
| Quiz | 8 questions with explanations and scoring |

## Interactions

- Terminal-style boot sequence on first load (`esc` or *skip* to bypass; skipped on repeat visits)
- Fuzzy search palette over every item on the page — press <kbd>/</kbd>
- Clickable 6-phase rail with per-phase detail panel
- Tool category filters + one-click command copy
- Clickable CIA triad nodes
- Principles checklist persisted in `localStorage`
- 4 accent colour themes, also persisted
- Matrix rain background, scroll progress, section-aware nav, reveal-on-scroll
- Fully responsive; respects `prefers-reduced-motion`

## Run locally

Any static server works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

```
index.html    markup and section structure
styles.css    theme, layout, animations, responsive rules
data.js       all note content as structured data
script.js     rendering and interaction logic
```

All content lives in `data.js` — edit that to change the notes without touching markup.

## Disclaimer

Educational material only. Every technique referenced here must only be practised against
systems you own or have explicit written authorization to test. Unauthorized access is a
crime regardless of intent.
