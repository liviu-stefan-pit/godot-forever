# Technical review — Part 2

Scope: `days/day15.html`–`days/day30.html`, `games/g06-idle-clicker.html`–`games/g10-extraction-miner.html`, `publishing/*.html`. Source of truth: `C:\prod\godot-docs` class pages and `C:\prod\godot-course\_authoring\CONTRACT.md` section 7 (Ship Kit). `days/day15.html` and `publishing/ship-kit.html` contain the same five autoload scripts. They agree with each other and with section 7 on every public signature, including `load_slot` returning the inner `data` dictionary.

Games 6–10 call `Events`, `Settings`, `SaveManager`, `Audio`, and `SceneRouter`. None of them ships a replacement `events.gd`, `settings.gd`, `save_manager.gd`, `audio.gd`, or `scene_router.gd`.

## Errors

### 1. `load_slot` is documented and coded as sometimes returning the file envelope

Section 7 and the kit both say `load_slot(slot: StringName, default: Dictionary = {}) -> Dictionary` returns the dictionary passed to `save_slot` (a duplicate of the inner `data` object). The on-disk `{format, saved_at, data}` envelope stays inside `SaveManager`. See `publishing/ship-kit.html` line 86 and `func load_slot` at `days/day15.html:353` / `publishing/ship-kit.html:362` (`classes` are not involved; this is CONTRACT.md §7).

These pages also accept that envelope as a legal return value. Days 22–23 never call `load_slot` (profile `get_value` only). Days 24–25 and day 27 do not load a slot. Day 15’s own boot check (`days/day15.html:673`) reads the inner dictionary and does not unwrap.

- **error** — `days/day17.html:495` and the callout at `:503`. `_unwrap` returns `raw["data"]` when the dictionary has both `format` and `data`. The callout says a kit that returns the whole file still loads. **Fix:** delete `_unwrap` and use the dictionary from `load_slot` directly.
- **error** — `days/day18.html:469`. Same `_unwrap` as day 17 (`:470`). **Fix:** delete `_unwrap` and assign `SaveManager.load_slot` straight into the run dictionary.
- **error** — `days/day26.html:47` and `:911`. Prose says the loader accepts the envelope when `data` is present and `hp` is not; `_load_run` implements that branch. **Fix:** drop the `raw.has("data")` branch and read `hp`, `gold`, and the rest from the dictionary `load_slot` returned.
- **error** — `days/day28.html:485` and the checkpoint at `:899`. `_unwrap` uses the inner `data` key when `seed` is missing, and the checkpoint tells the learner the kit may be returning the file wrapper. **Fix:** delete `_unwrap` and pass `SaveManager.load_slot(SLOT, {})` to the field loads.
- **error** — `games/g06-idle-clicker.html:90`. Says that if `load_slot` returns the kit envelope, `_unwrap` reads `data`. **Fix:** state that `load_slot` returns the run dictionary (`crumbs`, `lifetime`, and the rest), not the file envelope.
- **error** — `games/g09-roguelike-deckbuilder.html:93`. Says that if the autoload returns the on-disk envelope, the loader steps into `data` when `hp` is missing. **Fix:** describe `load_slot` as returning the run dictionary only.

`Settings.get_value(section, key, default)` and `SaveManager.get_value(key, default)` are not mixed up in this slice. Settings call sites pass a section (`days/day16.html:179`, `:285`, `:374`, `:493`). SaveManager call sites pass a key and a default (`days/day15.html:668`, days 17–18, 21–23, 26, 28).

### 2. Physics Merge renames contract layers 2 and 3

- **error** — `days/day22.html:80`. Layer Names > 2D Physics is set to layer 1 `world`, layer 2 `fruit`, layer 3 `sensor`, and the step says to leave layers 4–7 “as the kit named them.” CONTRACT.md §6 requires `1 world`, `2 player`, `3 enemies`, `4 player_attacks`, `5 enemy_attacks`, `6 pickups`, `7 triggers`. Day 15, day 16, and `publishing/ship-kit.html` never assign those names, so 4–7 are not already the contract names. `days/day23.html` and `games/g08-physics-merge.html` do not repeat the rename and do not restore the contract names; they continue the day 22 project. **Fix:** keep layer 1 as `world`, and name layers 2–7 with the contract names (put fruits on a contract layer such as `pickups`, or document a project-local layer only after the seven contract names exist).

`fruit.gd` `collision_layer = 2` and `collision_mask = 3` (`days/day22.html:241`) match the renamed bits (fruit on layer 2; mask value 3 = world + fruit). That bitmask is not a second bug. The defect is the layer names.

## Warnings

- **warn** — `days/day27.html:103`. `Image.create(width, height, use_mipmaps, format)` is deprecated. Checked `classes/class_image.rst` (`Image.create` is marked deprecated; `Image.create_empty` has the same arguments). **Fix:** call `Image.create_empty(colors.size() * tile, tile, false, Image.FORMAT_RGBA8)`.

## Verified, no defect

- **RenderingServer (day 21).** `canvas_item_create`, `canvas_item_set_parent`, `canvas_item_set_z_index`, `canvas_item_add_circle(item, pos, radius, color, antialiased)`, `canvas_item_set_visible`, `canvas_item_reset_physics_interpolation`, `canvas_item_set_transform`, `canvas_item_set_modulate`, `canvas_item_clear`, and `free_rid` match `classes/class_renderingserver.rst`. Parenting to `get_canvas_item()` matches `tutorials/performance/using_servers.rst`.
- **Control drag (day 25).** `_get_drag_data(at_position: Vector2) -> Variant`, `set_drag_preview(control)`, `_can_drop_data(at_position, data) -> bool`, and `_drop_data(at_position, data) -> void` match `classes/class_control.rst`.
- **FastNoiseLite and TileMapLayer (days 27–28, g10).** `TYPE_SIMPLEX_SMOOTH`, `FRACTAL_FBM`, `frequency`, `fractal_octaves`, `seed`, and `Noise.get_noise_2d` match `classes/class_fastnoiselite.rst` and `classes/class_noise.rst`. `set_cell(coords, source_id, atlas_coords, alternative_tile)`, `erase_cell`, and `local_to_map` match `classes/class_tilemaplayer.rst`. The pages extend `TileMapLayer`. They do not teach a `TileMap` node (`classes/class_tilemap.rst` marks that node deprecated).
- **VirtualJoystick.** The node exists: `classes/class_virtualjoystick.rst`. Day 20’s Inspector names match `action_left` / `action_right` / `action_up` / `action_down`, `JOYSTICK_FOLLOWING`, `VISIBILITY_WHEN_TOUCHED`, `deadzone_ratio`, `joystick_size`, and `tip_size`. Not a missing-node error. The page already has a version callout and a fallback `Control`.
- **GodotSteam.** `Steam.steamInit`, `Steam.setAchievement`, and `Steam.storeStats` on `days/day29.html:132` and `publishing/steam.html:53` are inside `callout external` and are labeled as addon sketches, not engine API. Not flagged.
- **Banned Godot 3 names** in code blocks of this slice: none. Hits on `ConfigFile.new`, `@export` / `@onready`, `TileMapLayer`, and the Master bus are not the banned forms.

## Counts

- Errors: 7
- Warnings: 1 (cap 30; 1 listed)
