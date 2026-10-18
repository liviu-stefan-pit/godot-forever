# Godot 4: Zero to Published

A free, offline-style Godot 4 course: 30 days and 10 games. Open `index.html` and the browser loads `assets/js/course-data.js` and `assets/js/course.js`. Nested pages use relative URLs (`../assets/...`). There is no bundler, no framework, and no install step for readers.

The course is dedicated to the public domain under [CC0 1.0 Universal](LICENSE). Read it, copy it, change it, teach it, or ship a game you built from it. There is no price, no paid tier, and no donation ask. You do not need permission and you do not owe the author anything. See [NOTICE](NOTICE) for trademarks and third-party projects this dedication does not cover.

Community documents:

- [LICENSE](LICENSE) — CC0 1.0, the legal text
- [NOTICE](NOTICE) — what is covered, and what belongs to other projects
- [CONTRIBUTING](CONTRIBUTING.md) — how to propose a fix
- [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) — how people treat each other here
- [SECURITY](SECURITY.md) — how to report a problem that could harm a reader

## Local preview

Node is only for this preview and for the page checker. The browser site has no server code.

On Windows, double-click `preview.cmd` in this folder. It starts the preview and opens http://localhost:8765/. Close that window to stop it.

```bash
node _authoring/serve.js 8765
```

Then open http://localhost:8765/.

Check the pages:

```bash
node _authoring/check.js --all
```

Expect 0 errors. Warnings about Godot 3 names ("do not use TileMap / ParallaxBackground / KinematicBody") are intentional.

## Vercel

Import this repository. Use the framework preset **Other**, leave the build command empty, and set the output directory to `.` (or leave it blank, which serves the repository root). `vercel.json` already records that.

`cleanUrls` stays false. Pages link to real files such as `days/day01.html`. Stripping `.html` would break those links.

Production should load `/` as the dashboard and `/days/day01.html` as Day 1.

## Docs clone

Visitors do not need a clone of the Godot documentation. Lesson links already point at https://docs.godotengine.org/en/stable/.

The page checker can optionally confirm that those URLs have a matching `.rst` file. That check is off unless you point it at a clone:

```bash
git clone --depth 1 https://github.com/godotengine/godot-docs.git
```

```bash
GODOT_DOCS=/path/to/godot-docs node _authoring/check.js --all
```

On Windows PowerShell, set `$env:GODOT_DOCS` to the clone path instead. Do not run the clone as part of the site build, and do not commit it. If `GODOT_DOCS` is unset, the checker prints one skip warning. That warning is acceptable.

## Files the learner downloads

These are not website dependencies. They are links the course tells the reader to fetch while following a lesson. They are not stored in this repository.

- Godot 4 standard editor (not the .NET build): https://godotengine.org/download
- Docs the lessons link to: https://docs.godotengine.org/en/stable/
- Docs source, only for the validator: https://github.com/godotengine/godot-docs
- Official project starters (release `latest-4.x`): https://github.com/godotengine/godot-docs-project-starters/releases/tag/latest-4.x
  - Dodger art: https://github.com/godotengine/godot-docs-project-starters/releases/download/latest-4.x/dodge_the_creeps_2d_assets.zip
  - 3D brawler models (`player.glb`, `mob.glb`): https://github.com/godotengine/godot-docs-project-starters/releases/download/latest-4.x/3d_squash_the_creeps_starter.zip
  - Instancing starter: https://github.com/godotengine/godot-docs-project-starters/releases/download/latest-4.x/instancing_starter.zip
- Optional CC0 art, chosen by looking at the files: https://kenney.nl/assets

Steamworks, GodotSteam, Google Play Console, and ads are external. The course already marks those sections. This repository has no API keys, no GodotSteam checkout, and no billing plugin.

## Progress

Progress is stored in the visitor's `localStorage` under the key `godotcourse.v1`. Nothing is sent to a backend.
