# AUTHORING CONTRACT - Godot 4: Zero to Published

Every writer agent MUST follow this file. Read it fully, then read `template-day.html` and `template-game.html`
in this folder (they are working pages that demonstrate every component), then write your pages.

## 0. The learner (write for THIS person)

- Experienced programmer. Does NOT need code explained line by line. DOES need every *Godot editor* action explained
  as click-by-click steps. **Has never opened Godot.** Never assume they know where a button, dock, menu or setting is.
- Windows 11 user. Use Windows paths (`C:\GodotProjects\...`), PowerShell for shell commands. Mention macOS/Linux shortcuts only when it matters.
- 3-4 hours per day, 30 days. Each day page must realistically fit **180-240 minutes** (reading + doing + break + quiz).
- Learning style: build real things, short concept notes, checkpoints that confirm progress, no giant theory dumps.

## 1. Project facts

- **Engine:** latest Godot **4.x stable, standard (non-.NET) build**. GDScript only. Never mention or show C#.
  Prefer APIs that exist since Godot 4.3. If something needs a newer minor version (e.g. 4.5+), put a
  `<div class="callout version">` saying which version and what to do on older ones. The docs repo is the `master` branch,
  so it may describe features newer than the user's stable release: verify, and flag.
- **Renderer:** Forward+ for Part 1 3D games; **Mobile** or **Compatibility** is discussed for Part 2/Android
  (see `tutorials/rendering/renderers.rst`). Part 2 (2D) games use **Mobile** renderer unless you have a reason; say why.
- **Source of truth:** the Godot docs in `C:\prod\godot-docs` (`.rst`). Before using any API, class, property, signal, project setting or
  editor menu name, check it in `C:\prod\godot-docs\classes\class_<name>.rst` or the relevant tutorial. Do not rely on memory for names.
  Wrong API names make the course useless. When uncertain, grep the docs; if still uncertain, say "verify in the class reference" in a callout rather than guessing.
- **Docs links:** map `tutorials/physics/using_character_body_2d.rst` -> `https://docs.godotengine.org/en/stable/tutorials/physics/using_character_body_2d.html`.
  Class pages: `classes/class_tween.rst` -> `https://docs.godotengine.org/en/stable/classes/class_tween.html`.
  Only link a page after you confirmed the `.rst` exists in the repo. All external links: `target="_blank" rel="noopener"`.
- **External topics** (Steam, GodotSteam, Google Play policies, Kenney, SteamCMD, ads...) are NOT in the docs repo. Use WebSearch/WebFetch if you have them,
  otherwise write from solid knowledge. ALWAYS wrap in `<div class="callout external">` ("External resource: verify on the official page, steps change").
  Never invent URLs: link only to well-known root pages (https://partner.steamgames.com, https://play.google.com/console, https://kenney.nl/assets).
  If unsure of an exact URL, give the site root and the search phrase to use.
- **Free assets:** use only CC0 or similarly free sources (Kenney https://kenney.nl/assets, Godot's official starter zips, built-in shapes). Never ask the user to buy anything.
  Official starter zips (verified in the docs):
  - 2D: `https://github.com/godotengine/godot-docs-project-starters/releases/download/latest-4.x/dodge_the_creeps_2d_assets.zip`
  - 3D: `https://github.com/godotengine/godot-docs-project-starters/releases/download/latest-4.x/3d_squash_the_creeps_starter.zip` (contains `player.glb`, `mob.glb` and more)
  - Instancing: `.../instancing_starter.zip`
  Be **asset-light**: prefer built-in nodes (`ColorRect`, `Polygon2D`, `Sprite2D` with `icon.svg`, `PlaceholderTexture2D`, `GradientTexture2D`, `CSGBox3D`, `MeshInstance3D` with primitive meshes) so a learner is never blocked by file hunting.
  When a Kenney pack is genuinely needed, name the pack, link `https://kenney.nl/assets`, and tell the learner to pick the specific file by *description* ("the tilemap sheet in the Tilemap folder")
  and add a version callout that exact filenames can differ. Never invent exact filenames you can't verify.
- **No screenshots exist.** Don't reference images. Convey layout with text: dock names + position, ASCII scene trees, tables. (Editor-tour page may use an inline SVG diagram.)

## 2. Default editor layout vocabulary (use these exact words everywhere)

| Term | Where it is / what it is |
|---|---|
| **Menu bar** | very top-left: Scene, Project, Debug, Editor, Help |
| **Workspace buttons** | top center: 2D, 3D, Script, Game, AssetLib |
| **Play buttons** | top right: Run Project (F5), Pause, Stop (F8), Run Current Scene (F6), Run Specific Scene |
| **Scene dock** | top-left: the node tree of the open scene. `+` adds a node (Ctrl+A), chain icon instantiates a scene file |
| **FileSystem dock** | bottom-left: files of `res://` |
| **Viewport** | center: 2D/3D canvas with a toolbar on top |
| **Inspector** | right side: properties of the selected node |
| **Node tab** | next to Inspector: has **Signals** and **Groups** sub-tabs (the official docs call these "Signals dock"/"Groups dock") |
| **Bottom panel** | bottom strip: Output, Debugger, Audio, Animation, Shader Editor, SpriteFrames, TileSet, TileMap |
| **Script editor** | the Script workspace: file list left, code center, docs/outline |
| **Output panel** | bottom panel tab where `print()` text and errors appear |

Formatting of UI references in prose:
- Menu paths: `<kbd class="menu">Project &gt; Project Settings &gt; Input Map</kbd>`
- Buttons, tabs, fields, dock names, dialog labels: `<kbd class="ui">Create</kbd>`
- Keys: `<kbd>F6</kbd>`, `<kbd>Ctrl</kbd>+<kbd>S</kbd>`
- Code identifiers, node names, property names, paths: `<code>...</code>`
- Say WHERE: "In the **Scene** dock (top-left), click ..." never just "click Add Node".
- One action per step, or a tightly related pair. Include the result when it's not obvious ("The node appears in the Scene dock").
- Name Inspector properties exactly as the Inspector shows them (Title Case with spaces, e.g. `Collision > Layer`, `Gravity Scale`). The script name is `gravity_scale`. Show both when first used.
- After every ~5-10 steps add a `<div class="checkpoint">` stating exactly what the learner should SEE/DO to verify (press F6, expected visible result, expected Output text).
- Editor indentation: Day 1 sets **Spaces, size 4** (`Editor > Editor Settings > Text Editor > Behavior > Indent > Type`). **All code listings use 4 spaces for indentation, never tabs.** When creating a script via Attach Script, always instruct: select all (`Ctrl+A`) in the script editor and replace the whole file with the listing.

## 3. Page types and required structure

All pages are static HTML. No CDN, no external fonts/scripts, no frameworks. `course.css` + `course.js` + `course-data.js` provide everything.
Day pages: copy `template-day.html`. Game pages: copy `template-game.html`.
Reference / publishing pages: same shell as the game template but `data-page="reference"` or `data-page="publishing"`, `data-id` = the id in `course-data.js`.

| Page | File | `data-page` | `data-id` | `data-root` |
|---|---|---|---|---|
| Day N | `days/dayNN.html` (two digits) | `day` | `dayNN` | `../` |
| Game | `games/<file in manifest>` | `game` | `g01`..`g10` | `../` |
| Reference | `reference/<id>.html` | `reference` | id from manifest | `../` |
| Publishing | `publishing/<id>.html` | `publishing` | id from manifest | `../` |

Required `<head>`: charset, viewport, `<title>`, `<link rel="stylesheet" href="../assets/css/course.css">`.
Required end of `<body>`: `<script src="../assets/js/course-data.js"></script><script src="../assets/js/course.js"></script>`.
Content goes inside ONE `<main>...</main>`. The shell (sidebar, search, TOC, progress, prev/next, "mark day complete" button) is added automatically: do NOT write them.

### Day page section order (all required)
1. `header.lesson-head` (eyebrow, h1, `.lead`, empty `<div class="chips" id="auto-chips">`)
2. `h2#timebox` + `table.timebox` (blocks sum to 180-240 min, include a break, last row `tr.total`)
3. `h2#objectives` + `ul.objectives` (3-6 measurable items)
4. `h2#before-you-start` + `ul.checklist` (prerequisites, downloads) - for Day 1 this is installs
5. `h2#concepts` (short; analogies to other engines/languages the learner likely knows)
6. One or more `h2#build-N` sections: `ol.steps` click-by-click, code via the code mechanism below, `pre.scene-tree`, `.checkpoint`, callouts
7. `h2#pitfalls`
8. `h2#challenge` (`.challenge`, optional 20-30 min stretch task with hints, not full solutions)
9. `h2#quiz` (`.quiz` with 3-5 `.q`; `data-correct` = 0-based index; each has an `.explain`)
10. `h2#docs` (`ul.docs-links`, 3-8 links that really exist in the repo)
11. `h2#wrap-up` (`ul.checklist` of 3-6 end-of-day verifications + one-line "Tomorrow" preview)

### Components (CSS classes that exist)
- Callouts: `.callout` + `note` (default) | `tip` | `warn` | `danger` | `docs` | `external` | `version`; first child `<span class="callout-title">`.
- `ol.steps > li` (auto numbered + "Mark done" button). Put `<script type="text/x-code">` or paragraphs inside the `li`.
- `.checkpoint`, `.challenge`, `ul.objectives`, `ul.checklist` (clickable, persisted), `ul.docs-links`, `table.timebox`, `details/summary` for hints/solutions/long listings, `.two-col` for side-by-side, `.chips`/`.chip`.
- `pre.scene-tree`: ASCII tree using `├──`, `└──`, `│`; annotate with `[script.gd]`, type in parentheses.
- `pre.plain`: raw text (file trees, config, shell output). Must HTML-escape `<`, `>`, `&`.

### CODE: always use the raw-script mechanism (no HTML escaping needed)
```html
<script type="text/x-code" data-lang="gdscript" data-file="player.gd">
extends CharacterBody2D
...
</script>
```
- `data-lang`: `gdscript` | `json` | `cfg` | `csv` | `shell` | `text`. `data-file`: the file name/path shown in the header (e.g. `res://player/player.gd`, `translations.csv`, `PowerShell`).
- The text is taken literally (so `<`, `&`, `->` are fine) and auto-dedented. NEVER write `</script>` inside code.
- Every GDScript listing a learner must type is **complete** (whole file, all `extends`, all functions) unless you explicitly say "add these lines under X" and show exact anchor lines. Prefer whole files; for long files use `<details>` only if >120 lines and still show it fully.
- Scene/node/property setups that aren't code are given as steps + `pre.scene-tree`, never as `.tscn` text (error prone).

## 4. GDScript rules (Godot 4 only)

- Statically typed: `var speed: float = 300.0`, `func take_damage(amount: int) -> void:`, typed arrays `Array[Enemy]`, `:=` only when the type is obvious and not Variant.
- Style: snake_case vars/functions/files, PascalCase classes/nodes, SCREAMING_CASE constants, `_private` prefix, private signal handlers `_on_<node>_<signal>`, order: `extends`, `class_name`, signals, enums, constants, `@export`, public vars, private vars, `@onready`, lifecycle (`_ready`...), public methods, private methods.
- Unused parameters prefixed `_` (e.g. `_delta`) to avoid warnings. Use `@warning_ignore("unused_signal")` for signals declared on autoloads that are emitted elsewhere.
- Connect signals with the Callable form: `button.pressed.connect(_on_button_pressed)`; emit with `my_signal.emit(args)`.
- Use `@onready var label: Label = $HUD/ScoreLabel` or scene unique names `%ScoreLabel`. Prefer unique names for UI nodes and explain how to enable them (Right-click node > Access as Unique Name) the first time.
- Physics code in `_physics_process`, visuals/UI in `_process`; `move_and_slide()` has no args; `velocity` is a property.
- Randomness: `randf()`, `randi()`, `randf_range()`, `randi_range()`, `RandomNumberGenerator` for seeded; `Array.pick_random()`, `Array.shuffle()`.
- Tweens: `var tween := create_tween()` then `tween.tween_property(...)`. Waiting: `await get_tree().create_timer(0.5).timeout`.
- Scenes: `preload("res://x.tscn")` / `@export var scene: PackedScene` -> `.instantiate()` -> `add_child()`. `queue_free()` to delete.
- Collision changes during physics callbacks: `set_deferred("disabled", true)`.
- Tiles: **`TileMapLayer`** only. Painting: `set_cell(coords: Vector2i, source_id: int, atlas_coords: Vector2i, alternative_tile: int)`; `local_to_map()` / `map_to_local()`. The old `TileMap` node is deprecated: never teach it.
- Parallax: `Parallax2D`, not `ParallaxBackground/ParallaxLayer` (mention old names only to say "do not use").
- Saving: `FileAccess.open(path, FileAccess.WRITE)`, `JSON.stringify()`, `JSON.parse_string()`. **JSON turns every number into float**: always `int(...)` when loading counters. Vector2/Color are not JSON types: store as arrays/hex strings.
- Global singletons: autoloads (Project Settings > Globals > Autoload). Use sparingly (see the Best Practices docs).

### BANNED (Godot 3 or deprecated; reviewers grep for these)
`yield`, `export var`, `onready var`, `KinematicBody2D`/`KinematicBody`, `Spatial`, `instance()`, `connect("sig", self, "method")`,
`rand_range`, `move_and_slide(velocity)`, `move_and_slide(vel, Vector2.UP)`, `TileMap` node usage (other than "deprecated, use TileMapLayer"),
`ParallaxBackground`/`ParallaxLayer`, `Tween` as a node / `tween.interpolate_property`, `OS.get_ticks_msec()` (use `Time.get_ticks_msec()`),
`get_node("..").connect(`, `setget`, `tool` keyword (use `@tool`), `Directory.new()`/`File.new()` (use `DirAccess`/`FileAccess`), `Vector2.linear_interpolate` (use `lerp`), `is_network_master`, `puppet`/`master` keywords, `.rect_position` / `rect_size` (use `position`/`size`), `get_tree().change_scene("..")` (use `change_scene_to_file`).

## 5. Pedagogy rules

1. **Explain WHY in one line** when introducing a node or setting, then move on.
2. **Never leave a gap**: if a step needs a node, an Input Map action, a collision layer, a signal connection, a group or a project setting, it is a numbered step. Nodes created in the editor must be named exactly as the code expects (`$Timer`, `%ScoreLabel`).
3. **Signals**: for the first 3 signal connections in the course explain both ways (Node tab > Signals double-click vs code). After that give the shortest working way.
4. **Checkpoints** make failure visible early. Add a "If you see X instead, check Y" line to the checkpoint when likely.
5. **Pitfalls** section: real Godot gotchas (e.g. forgot to save scene before F6, node renamed so `$Path` breaks, collision layer not set, script attached to wrong node).
6. **Time realism**: do not stuff a day with 8 hours of content. If content doesn't fit, move optional parts to the Challenge. Day N+1 starts from the end state of Day N (state this in "Before you start" and give a "bring-up" fallback: what to create if the learner skipped).
7. **Cumulative end-state**: each day ends with a runnable project (F5 works). Each multi-day game's final day ends with the game's feature checklist from its game page, fully ticked.
8. **Keep consistent names** across days of the same game (scene and script names, node names, Input actions, layer names). Define them once (Day 1 of the game) and reuse. List a "File map" table at the end of the final day of each game.
9. Tone: direct, friendly, concrete. No filler, no emojis in running text (the CSS adds its own icons), no marketing language.
10. Don't show screenshots; don't say "as you can see in the picture".

## 6. Game folder and project conventions

- Training games (1-5): each is its own Godot project in `C:\GodotProjects\<project-name>\`:
  `g01-dodger`, `g02-cave-runner`, `g03-bastion-defense`, `g04-arena-brawler-3d`, `g05-torchlight-dungeon`.
  Day 1 creates `C:\GodotProjects\g00-sandbox` for experiments.
- Publishable games (6-10): each is its own project created by **copying the Ship Kit template folder** (Day 15) to
  `C:\GodotProjects\idle-clicker`, `bullet-heaven`, `physics-merge`, `deckbuilder`, `deep-digger`. Package names: `com.yourname.idleclicker`, `com.yourname.bulletheaven`, `com.yourname.physicsmerge`, `com.yourname.deckbuilder`, `com.yourname.deepdigger` (learner replaces `yourname`).
- Viewport: Part 1 2D games 1152x648 landscape (Dodger: 480x720 portrait like the docs), stretch `canvas_items` + aspect `keep`. Publishable games: idle clicker and physics merge are **portrait 720x1280**; bullet heaven, deckbuilder and deep digger are **landscape 1280x720**. All use stretch mode `canvas_items`; aspect `expand` (so wide/tall phones get extra room and UI anchors/containers handle it) unless a game page says otherwise.
- Standard Input Map action names: `move_left`, `move_right`, `move_up`, `move_down`, `jump`, `dash`, `attack`, `interact`, `pause`, `confirm`, `cancel`.
- Physics layer names (2D games set them in Project Settings > Layer Names > 2D Physics): 1 `world`, 2 `player`, 3 `enemies`, 4 `player_attacks`, 5 `enemy_attacks`, 6 `pickups`, 7 `triggers`. 3D games same names under 3D Physics.
- Group names: `enemies`, `player`, `pickups`, `projectiles`, `persist`.

## 7. SHIP KIT API (Part 2) - authoritative; Day 15-16 implements EXACTLY this; Days 17-28 use EXACTLY this

Template layout (`res://`):

```
autoload/    events.gd  settings.gd  save_manager.gd  audio.gd  scene_router.gd
ui/          main_menu.tscn/.gd  settings_menu.tscn/.gd  pause_menu.tscn/.gd  credits.tscn/.gd  toast.tscn/.gd  theme/game_theme.tres
i18n/        translations.csv  (+ imported .translation files)
licenses/    GODOT_LICENSE.txt  GODOT_COPYRIGHT.txt  THIRD_PARTY.txt
game/        game.tscn + everything specific to the game
data/        Resource scripts and .tres data
assets/      art/ audio/ fonts/
default_bus_layout.tres     (buses: Master, Music, SFX)
```
Autoload order and names (Project Settings > Globals > Autoload): `Events`, `Settings`, `SaveManager`, `Audio`, `SceneRouter`.

```gdscript
# events.gd  (extends Node)  - global signal bus
signal game_started
signal game_paused(is_paused: bool)
signal game_over(score: int)
signal score_changed(score: int)
signal achievement_unlocked(id: StringName)
signal settings_changed
signal toast_requested(text: String)

# settings.gd (extends Node) - persists to user://settings.cfg via ConfigFile
func get_volume(bus: StringName) -> float            # linear 0.0-1.0 ; bus is &"Master" | &"Music" | &"SFX"
func set_volume(bus: StringName, linear: float) -> void   # applies via AudioServer, saves, emits Events.settings_changed
func is_fullscreen() -> bool
func set_fullscreen(on: bool) -> void
func get_locale() -> String
func set_locale(locale: String) -> void              # TranslationServer.set_locale + save
func get_value(section: String, key: String, default: Variant = null) -> Variant
func set_value(section: String, key: String, value: Variant) -> void
func save_settings() -> void
func save_input_map() -> void ; func load_input_map() -> void   # remapped actions persisted

# save_manager.gd (extends Node) - JSON in user://saves/<slot>.json, atomic write (.tmp then rename), {"format": FORMAT_VERSION, "saved_at": unix, "data": {...}}
const FORMAT_VERSION: int = 1
func has_slot(slot: StringName) -> bool
func save_slot(slot: StringName, data: Dictionary) -> bool
func load_slot(slot: StringName, default: Dictionary = {}) -> Dictionary
func delete_slot(slot: StringName) -> void
func get_value(key: String, default: Variant = null) -> Variant    # small global "profile" (high scores, unlocks); debounced autosave (1 s)
func set_value(key: String, value: Variant) -> void
func flush() -> void                                               # force-write profile now; also called on window close, app pause and focus-out (Android!)

# audio.gd (extends Node)
func play_sfx(stream: AudioStream, volume_db: float = 0.0, pitch_scale: float = 1.0) -> void  # pooled players on bus "SFX"
func play_sfx_varied(stream: AudioStream, pitch_spread: float = 0.1, volume_db: float = 0.0) -> void
func play_music(stream: AudioStream, fade_time: float = 0.8) -> void   # crossfade on bus "Music"
func stop_music(fade_time: float = 0.8) -> void

# scene_router.gd (extends CanvasLayer, layer 100, has a full-screen ColorRect for fades)
const MAIN_MENU_SCENE: String = "res://ui/main_menu.tscn"
const GAME_SCENE: String = "res://game/game.tscn"
signal transition_finished
func go_to(scene_path: String, fade_time: float = 0.25) -> void    # fade out, change_scene_to_file, fade in
func reload_current(fade_time: float = 0.25) -> void
func quit_game() -> void                                           # flush SaveManager then get_tree().quit()
```

- Pause: `pause_menu.tscn` is a `CanvasLayer` with `process_mode = Always`; games instance it under their `game.tscn`; it toggles `get_tree().paused` on the `pause` action and emits `Events.game_paused`.
- Localization: `i18n/translations.csv` columns `keys,en,es,de,fr,pt_BR,ru,zh_CN` (at least `en` + two more filled); UI keys prefixed `UI_`, game keys prefixed per game (`CLICKER_`, `BH_`, `MERGE_`, `DECK_`, `DIGGER_`). Always `tr("KEY")` / Control auto-translate for labels.
- JSON gotcha (see rule above) applies to every save: **cast ints on load**. Idle-clicker big numbers are stored as strings or floats, never ints beyond 2^53.
- Games add their data via `SaveManager.save_slot(&"run", {...})` and small flags via `SaveManager.set_value("best_score", n)`.

## 8. Quality bar (reviewers will check)

- Every Godot API name used exists in the docs repo and is Godot 4. No banned patterns.
- Every step is executable by someone who never opened Godot. Every script is complete and consistent with node names in the steps.
- Day fits 3-4 h. No empty sections. No "TODO", no lorem ipsum, no placeholder text, no "left as an exercise" for required features.
- HTML is well-formed: all tags closed, `id`s unique within a page, links resolve (relative paths exist), every `<script type="text/x-code">` closed.
- Publishable-game pages define "store-ready" as a concrete checklist (see template-game.html) and the final day of each game ends with: Android debug build installed on a phone (or emulator) AND a Windows release export, each with exact steps or a link back to the Ship Kit export steps.
- Part 1 depth: enough for a beginner to finish a *small but complete* game each. Part 2 depth: enough to ship; list balance numbers, exact formulas and data tables, not "tune to taste".

## 9. File ownership and reporting

Only write the files you were assigned. Do not edit `assets/`, `index.html`, `_authoring/`, or other agents' pages.
If you need a manifest change (title, topic), tell the coordinator in your final message instead of editing `course-data.js`.
Final message format (<= 25 lines): files written (with line counts), any API/behaviour you were unsure about (verify list), any deviations from this contract, any facts other pages must stay consistent with (node names, action names, class_name names, file names).
