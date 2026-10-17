# Security

This repository is a static course. Pages are HTML, CSS, and JavaScript that run in the visitor's browser. There is no account system, no server API, and no database.

Progress is stored in the visitor's browser under the `localStorage` key `godotcourse.v1`. Nothing is sent to a backend.

## Report a problem

If you find a script-injection bug, a malicious link that was introduced in a page, or anything else that could harm a reader, report it privately to the maintainer through GitHub at <https://github.com/liviu-stefan-pit>. Please include the page path and a short description of what a browser would do.

Do not open a public issue for a problem that is not yet fixed if following the issue would itself put readers at risk.

## Out of scope

- Godot Engine, GodotSteam, Steamworks, Google Play, and ad networks. Report those to the projects that publish them.
- The official documentation at https://docs.godotengine.org.
- A missing `GODOT_DOCS` clone on your own machine. That only affects the local page checker.
