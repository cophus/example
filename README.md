# Opportunities for 4D-STEM

A MyST Markdown website version of the lecture "Opportunities for 4D-STEM" (Colin Ophus), with figures, movies, and interactive widgets. Deployed to GitHub Pages at https://cophus.github.io/example/.

## Setup

MyST runs from a uv virtual environment (the PyPI `mystmd` package wraps the node build and needs node 18 or newer on the path).

```bash
uv venv .venv --python 3.12
uv pip install --python .venv/bin/python mystmd
```

## Build

```bash
source .venv/bin/activate
myst build && python3 scripts/patch_theme.py && myst start   # local site, hot reload
```

`scripts/patch_theme.py` replaces the theme's pop-up dialog search with a flat search input in the top bar, and makes the search hits link correctly when the site is served under a path prefix (GitHub Pages project sites). It patches the downloaded theme in `_build/templates`, so run it once after the first build and again whenever `_build` is cleared. The deploy workflow in `.github/workflows/deploy.yml` runs the same sequence with `BASE_URL` set to the repository name.

Stale-widget or stale-template symptoms: `rm -rf _build` and rebuild, then re-run the patch.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`. In the repository settings, set Pages > Source to "GitHub Actions" once.

## Layout

- `index.md`, `resources.md`: landing and resource pages.
- `modules/<topic>/*.md`: one folder per section of the lecture.
- `images/slides/slide-NNN.jpg`: slide renders (title bar cropped), numbered by slide in `Opportunities_4DSTEM_Ophus_v04.pptx`. Slides 7, 22, 37, and 92 come from the CCEM school export because the Keynote render of v04 dropped some graphics.
- `videos/*.mp4`: movies from the lecture, re-encoded to H.264 (at most 960 px wide, no audio). The theme renders them with autoplay and loop; the runtime in `patch_theme.py` mutes them so browsers allow autoplay.
- `widgets/*.js`: anywidget ES modules embedded with `:::{anywidget} ../../widgets/NAME.js`. Preview them without MyST by serving the repository root and opening `test-widgets.html`.
- `references.bib`: every reference, with DOIs checked against Crossref. Cite with `[@key]` (parenthetical) or `@key` (narrative); MyST adds a References list to each page.
- `plugins/answer.mjs`: the `{answer}` directive from the template, available for worked problems.

## Conventions

Writing follows `Dropbox/Apps/colin_voice.md`: clarity and brevity, no em dashes, no rhetorical questions, citations next to the claims they support. Links are red (the `--msc-accent` color in `style.css`), not the theme's blue.
