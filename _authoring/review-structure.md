# Structure and UX review

Reviewer scope: page structure, manifest identity, links, quizzes, timeboxes, first-time editor steps, and day-to-day names. The nine validator warnings about banned Godot 3 names used as “do not use” notes are omitted here.

Learner assumed: codes well, has never opened Godot. Days 1–2 teach Add Child Node (`Ctrl+A`, search, Create) and that the FileSystem menu is **New** or, on some versions, **Create New**. Later days may be shorter for that same gesture. A step that names a control that is not on screen is still a problem.

## Errors

None.

Required section ids are present on every day page (`timebox`, `objectives`, `before-you-start`, `concepts`, `build-1`, `pitfalls`, `challenge`, `quiz`, `docs`, `wrap-up`) and every game page (`design`, `scope`, `architecture`, `assets`, `days`, `stretch`). `data-page` and `data-id` match the filename and `course-data.js` for days `day01`–`day30`, games `g01`–`g10`, all six reference ids, all five publishing ids, and `index.html` (`dashboard`). Manifest `file` paths exist. Relative `href`s resolve. Docs links under `https://docs.godotengine.org/en/stable/` have a matching `.rst` in `C:\prod\godot-docs`. Every quiz has 4 or 5 questions and a `data-correct` inside the option list. Every timebox total is between 180 and 240 minutes.

No later day asks for a project, scene, script, or node the previous day of that project did not create. Checked handoffs: Dodger `main.tscn` into Day 4; Cave Runner layers, actions, art, `player.tscn` at `(112, 556)`, `Hurtbox`, and `hearts_hud.tscn` across Days 5–7; Bastion `g03-bastion-defense` and the Day 8 node names into Day 9; Arena player rig into Day 11 (`AttackHitbox`, `AnimationTree`, `Health` are created on Day 11); dungeon `Head` into Day 13; Ship Kit autoloads and `ShipPauseMenu` into Days 16–28; clicker catalog of 8 generators and 6 upgrades into Day 18 (Day 18 grows the array to 9); bullet-heaven `Gems`, `Loadout`, and `LevelUp` into Day 21; deckbuilder relic hooks in Day 24 `battle.gd` into Day 26.

## Warnings

1. **warn** — `days/day06.html:14`  
   Sidebar title is “Platformer II: state machine, dash, enemies”. The page heading is “Platformer II: state machine, combat, pickups”.  
   Fix: use one title in `course-data.js` and in the `<h1>`.

2. **warn** — `days/day07.html:14`  
   Sidebar title is “Platformer III: camera, parallax, lights, rooms”. The heading is “Platformer III: rooms, light, save”.  
   Fix: use one title in the manifest and the heading.

3. **warn** — `days/day09.html:14`  
   Sidebar title is “Tower Defense II: towers, targeting, economy”. The heading is “Tower Defense II: towers, placement, victory”.  
   Fix: use one title in the manifest and the heading.

4. **warn** — `days/day12.html:14`  
   Sidebar title calls the game “Dungeon Crawler”. The heading, the browser title, and game `g05` call it “Torchlight Dungeon”.  
   Fix: name Day 12 “Torchlight Dungeon” in `course-data.js` so it matches the page and the game entry.

5. **warn** — `days/day13.html:14`  
   Sidebar title is “Dungeon Crawler II: weapons, enemies, doors, minimap”. The heading is “Torchlight Dungeon: shots, enemies, doors, minimap”.  
   Fix: use the game name Torchlight Dungeon and one feature list in both places.

6. **warn** — `days/day20.html:14`  
   Three labels for the same day: sidebar “XP, level-ups, weapons, mobile controls”, browser title “XP, level-ups, weapons, touch”, heading “XP, weapons, joystick”.  
   Fix: pick one subtitle and put it in the manifest, the `<title>`, and the `<h1>`.

7. **warn** — `days/day24.html:14`  
   Sidebar and browser title are “Deckbuilder I: cards, deck, battle loop”. The heading is “Cards, piles, and the battle loop”, so the open page does not show which game it is.  
   Fix: put “Deckbuilder I” and the same feature list in the `<h1>`.

8. **warn** — `days/day26.html:14`  
   Sidebar promises “Deckbuilder III: map, relics, saving runs, release”. The heading is “Map, relics, saving the run” and drops the release build.  
   Fix: make the heading match the sidebar, including the release build.

9. **warn** — `days/day27.html:6` and `:14`  
   Sidebar says “Extraction Miner I”. The browser title says “Procedural digger”. The heading says “Deep Digger”, which is the `g10` title.  
   Fix: call the day Deep Digger in the manifest, the `<title>`, and the `<h1>`.

10. **warn** — `days/day28.html:6` and `:14`  
    Sidebar says “Extraction Miner II: shop, hazards, depth, release”. The heading says “Deep Digger: shop, hazards, and a build”.  
    Fix: use Deep Digger and one feature list in the manifest and the heading.

11. **warn** — `games/g01-arcade-dodger.html:13`  
    Manifest title is “Dodger”. The page heading is “Arcade Dodger”, so the sidebar chip and the page name differ.  
    Fix: use one display name in `course-data.js` and the `<h1>`.

12. **warn** — `games/g06-idle-clicker.html:13`  
    Manifest title, sidebar, and browser title say “Idle Clicker”. The heading says “Crumb Foundry”. Days 17–18 use both names.  
    Fix: put both names in one place (heading “Crumb Foundry” with the sidebar still able to say Idle Clicker, or the reverse) and use that pair everywhere.

13. **warn** — `games/g08-physics-merge.html:13`  
    Manifest title is “Physics Merge”. The heading is “Fruit Jar”. Days 22–23 and the export exe use Fruit Jar.  
    Fix: show both the course name and the product name in the heading and the manifest title.

14. **warn** — `days/day14.html:14`, `day15.html:14`, `day16.html:14`, `day19.html:14`, `day21.html:14`, `day25.html:14`, `day30.html:14`, `publishing/ship-kit.html:13`, `publishing/steam.html:13`, `publishing/google-play.html:13`  
    The heading paraphrases the manifest title the sidebar shows (for example sidebar “Steam guide” / heading “Steam”, sidebar “Ship Kit: API and layout” / heading “Ship Kit API”, Day 19 sidebar “enemies” / heading “swarm”). The topic is the same.  
    Fix: copy the manifest title into each `<h1>`, or update the manifest to the heading.

15. **warn** — `days/day13.html:76`  
    The step says right-click the folder and choose `Create Script`. Day 1 established the item as **New > Script…** or **Create New > Script**. There is no item named Create Script.  
    Fix: write the same menu path Day 1 uses, then set Path to `res://components/health.gd` and click Create.

16. **warn** — `days/day13.html:108`  
    The step tells the learner to look in the Inspector for Attach Script, then to drag `health.gd` onto the Health node. Attach Script is a right-click command on the node in the Scene dock, not an Inspector row. “Add a child Node” also never says Scene dock or `Ctrl+A`.  
    Fix: say “Scene dock, select Player, `Ctrl+A`, search Node, Create, rename Health, then drag `health.gd` onto that node”.

17. **warn** — `days/day18.html:490`  
    “Create New > Resource → UpgradeDef” reads as a third menu entry. UpgradeDef is a type in the Create New Resource search box, which Day 17 spelled out and this step does not.  
    Fix: say right-click `data`, Create New > Resource, type `UpgradeDef` in the search box, click Create, then save each file from the table.

18. **warn** — `days/day06.html:106`  
    This is a build day. None of the four checkpoints (lines 106, 453, 525, 638) say press `F5` or `F6` and what should appear. The run steps at 450, 514, and 627 do name the key, so a learner who reads in order can still run the scene. The checkpoint boxes themselves do not.  
    Fix: start each play checkpoint with “Press F6” or “Press F5” and the scene that should be open.

19. **warn** — `days/day06.html:111`  
    “Press `Ctrl+A`, add an Area2D” skips the dialog. The previous block on the same page (line 81) says search and click Create. A first-time reader of this step does not know a dialog opened.  
    Fix: repeat “search Area2D, click Create, press F2, rename Hurtbox”.

20. **warn** — `days/day05.html:195`  
    `Debug > Visible Collision Shapes` is the menu bar, marked `kbd.ui` instead of `kbd.menu`. The sentence does say “Menu bar”, so the place is named.  
    Fix: mark that path `kbd.menu`.

21. **warn** — `days/day30.html:212`  
    `h2#build-7` sits after `h2#docs` and before `h2#wrap-up`. Every required id exists. The table of contents shows a build section after the docs list, which is the one day that breaks the template order.  
    Fix: move that section up with the other build sections, or give it a non-build id if it is only a reference list.

## Counts

- Errors: 0
- Warnings listed: 21
- Warnings omitted by the cap: 0
