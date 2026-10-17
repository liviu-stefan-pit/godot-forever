# Technical review, part 1

Slice: `days/day01.html`–`days/day14.html`, `games/g01-arcade-dodger.html`–`games/g05-dungeon-crawler-3d.html`, `reference/*.html`. Checked against `C:\prod\godot-docs` class pages. Learner scripts in this slice do not use the banned Godot 3 patterns (`export var`, `move_and_slide(velocity)`, a `TileMap` node, `ParallaxBackground`, `OS.get_ticks_msec`, `yield`, string `connect`). Names that were confirmed, not assumed: Dodger `HighScore` is `class_name` in `high_score.gd` (not an autoload); Cave Runner autoload is `GameState`; tower defense autoload is `Game`; Arena and Torchlight have no autoloads. Input actions and layer bits in the scripts match the contract (`world` = 1, `player` = 2, `enemies` = 4, `player_attacks` = 8, `enemy_attacks` = 16, `pickups` = 32, `triggers` = 64).

## Errors

1. **error** — `days/day11.html` line 463. The bake step says mesh-instance parsing would bake nothing because the arena is CSG with `use_collision`, not a `MeshInstance3D`, and tells the learner to set Parsed Geometry Type to Static Colliders. `classes/class_navigationmesh.rst` (`PARSED_GEOMETRY_MESH_INSTANCES`) says that mode parses `MeshInstance3D`, `CSGShape3D`, and `GridMap`. `PARSED_GEOMETRY_STATIC_COLLIDERS` parses `StaticBody3D` nodes, which this arena does not have. Leave Parsed Geometry Type on Mesh Instances (the default), which is the mode documented to include `CSGShape3D`.

2. **error** — `reference/node-cheatsheet.html` line 100. `Polygon2D` is given a property `invert`. `classes/class_polygon2d.rst` has `invert_enabled` and `invert_border`, not `invert`. Replace `invert` with `invert_enabled`.

3. **error** — `reference/troubleshooting.html` line 243. The `JSON.parse_string` row says the docs pattern prints `JSON.get_error_message()` and `get_error_line()` after a failed parse. `classes/class_json.rst` says `parse_string` does not handle errors, and `get_error_message` / `get_error_line` are instance methods used after `JSON.new().parse()`. Diagnose a bad save with `var json := JSON.new()` and `json.parse(text)`, then `json.get_error_message()` and `json.get_error_line()`.

4. **error** — `reference/troubleshooting.html` line 245. The same row lists a trailing comma as a reason `parse_string` returns null. `classes/class_json.rst` says trailing commas in arrays or objects are ignored, not a parse error. Drop the trailing-comma cause.

## Warnings

1. **warn** — `days/day12.html` lines 210–211 and `days/day13.html` lines 166–167. First-person look uses `InputEventMouseMotion.relative` while the mouse is captured. `classes/class_inputeventmousemotion.rst` says `relative` is scaled by the content scale factor and that captured aiming should use `screen_relative`. Days 10 and 11 already do. Switch both dungeon scripts to `motion.screen_relative`.

2. **warn** — `reference/node-cheatsheet.html` line 142. `RayCast3D` is described as the dungeon hitscan weapon. Day 13 fires with `PhysicsDirectSpaceState3D.intersect_ray` (`classes/class_physicsdirectspacestate3d.rst`) and uses the `RayCast3D` node only for the interact beam. Say the interact ray is the `RayCast3D`, and the gun is `intersect_ray`.

3. **warn** — `reference/node-cheatsheet.html` line 52. The collision table header is "Bit" and the rows are 1 through 7. Those are layer numbers. The bitmask for layer 3 (`enemies`) is 4, which the next paragraph states correctly (`classes/class_collisionobject2d.rst` layer/mask description, and the course's own Day 9 note that inspector button 4 is value 8). Rename the column to "Layer" so nobody writes `collision_layer = 3` for enemies.

4. **warn** — `days/day08.html` line 284. Visible Paths is described as a control in the running game's Debug menu. `tutorials/scripting/debug/overview_of_debugging_tools.rst` puts Visible Paths on the editor Debug menu, which affects the game you launched from the editor. Say Editor menu bar, Debug, Visible Paths.

5. **warn** — `days/day11.html` line 508 (`chaser.gd` and the same pattern in `spitter.gd`). `target_position` is written on the first `_physics_process` with no wait. `tutorials/navigation/navigation_introduction_3d.rst` waits `await get_tree().physics_frame` before the first target, and Day 11's own concept paragraph says to copy that. Day 13's enemy does. Await one physics frame before the first `target_position`; keep calling `get_next_path_position()` every physics frame after that (`classes/class_navigationagent3d.rst`).

## Counts

Errors: 4

Warnings: 5
