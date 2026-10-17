# Contributing

This course is free and dedicated to the public domain under [CC0 1.0](LICENSE). There is nothing to buy, and contributions are not paid.

By submitting a contribution, you agree to dedicate that contribution to the public domain under CC0, to the same extent as the rest of this repository. You do not need to sign a separate agreement. If you are not allowed to do that (for example, because an employer owns the work), do not submit it.

## What helps

- A wrong step, a broken link, a Godot 3 name that slipped into a code sample, or a page that does not match current Godot 4.
- A clearer sentence in a lesson, when the current sentence is actually misleading.
- Fixes to the preview server or the page checker in `_authoring/`.

## What to leave alone

- Do not rewrite a day, a game page, or the Ship Kit for style.
- Do not vendor Godot, the documentation tree, export templates, or the starter zip files.
- Do not add API keys, a GodotSteam checkout, a billing plugin, analytics, or a payment link.
- Do not turn the site into a framework. It is static HTML. Pages link to real files such as `days/day01.html`.
- Do not enable Vercel clean URLs or a trailing-slash redirect.

## Preview

Node is only for the local preview and the checker. The site itself has no server code.

```bash
node _authoring/serve.js 8765
```

Open http://localhost:8765/ and the page you changed.

## Check

```bash
node _authoring/check.js --all
```

The command must finish with 0 errors. Warnings about Godot 3 names ("do not use TileMap / ParallaxBackground / KinematicBody") are intentional.

The optional docs check needs a separate clone. Do not commit that clone.

```bash
git clone --depth 1 https://github.com/godotengine/godot-docs.git
```

```bash
GODOT_DOCS=/path/to/godot-docs node _authoring/check.js --all
```

On Windows PowerShell:

```powershell
$env:GODOT_DOCS = "C:\path\to\godot-docs"
node _authoring/check.js --all
```

If `GODOT_DOCS` is unset, the checker skips the ".rst file exists" test and prints one warning. That warning is acceptable. Errors are not.

## Pull requests

Open an issue or a pull request on GitHub. A useful report names the page, what you expected, and what you saw. A useful patch stays small enough to review.

Read the [Code of Conduct](CODE_OF_CONDUCT.md) before you participate.
