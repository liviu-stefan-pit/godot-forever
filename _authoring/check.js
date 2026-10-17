#!/usr/bin/env node
/* Course page validator.
   Usage:  node _authoring/check.js <file-or-dir> [more files/dirs...]
           node _authoring/check.js --all
   Exit code 1 if any ERROR. WARN lines are advisory.
   Set GODOT_DOCS to a godot-docs clone to check that docs URLs have a matching .rst file. */
const fs = require("fs");
const path = require("path");

const COURSE = path.resolve(__dirname, "..");
const DOCS = process.env.GODOT_DOCS || "";
let skippedDocsCheck = false;

const args = process.argv.slice(2);
let files = [];
function collect(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) fs.readdirSync(p).forEach(f => collect(path.join(p, f)));
  else if (p.endsWith(".html") && !p.includes("_authoring")) files.push(p);
}
if (args.includes("--all") || args.length === 0) ["days", "games", "reference", "publishing"].forEach(d => { const p = path.join(COURSE, d); if (fs.existsSync(p)) collect(p); });
args.filter(a => a !== "--all").forEach(a => collect(path.resolve(a)));
files = [...new Set(files)].sort();

const BANNED = [
  [/\byield\s*\(/, "yield (Godot 3) -> await"],
  [/(?<!@)\bexport\s+var\b/, "export var -> @export var"],
  [/(?<!@)\bonready\s+var\b/, "onready var -> @onready var"],
  [/\bKinematicBody(2D)?\b/, "KinematicBody -> CharacterBody"],
  [/\bSpatial\b/, "Spatial -> Node3D"],
  [/\.instance\(\)/, ".instance() -> .instantiate()"],
  [/\.connect\(\s*"[^"]+"\s*,/, 'connect("sig", ...) -> signal.connect(callable)'],
  [/\brand_range\s*\(/, "rand_range -> randf_range/randi_range"],
  [/move_and_slide\(\s*[^)\s]/, "move_and_slide(args) -> move_and_slide() with velocity property"],
  [/\bTileMap\b(?!Layer)/, "TileMap node (use TileMapLayer)"],
  [/\bParallax(Background|Layer)\b/, "ParallaxBackground/Layer -> Parallax2D"],
  [/interpolate_property/, "Tween node API -> create_tween()"],
  [/OS\.get_ticks_msec/, "OS.get_ticks_msec -> Time.get_ticks_msec"],
  [/\bsetget\b/, "setget -> property setters (set(value):)"],
  [/^\s*tool\s*$/m, "tool -> @tool"],
  [/\b(Directory|File)\.new\(\)/, "Directory/File.new -> DirAccess/FileAccess"],
  [/linear_interpolate/, "linear_interpolate -> lerp"],
  [/\brect_(position|size)\b/, "rect_position/size -> position/size"],
  [/change_scene\(\s*"/, "change_scene -> change_scene_to_file"],
  [/\bget_tree\(\)\.set_pause\b/, "set_pause -> get_tree().paused ="],
  [/\.emit_signal\(\s*"/, 'emit_signal("x") works but prefer x.emit()'],
  [/\bis_network_master\b/, "is_network_master (Godot 3)"],
];

const VOID = new Set(["br", "img", "hr", "input", "meta", "link", "col", "source", "wbr"]);
const TRACK = new Set(["div", "ol", "ul", "li", "table", "tr", "td", "th", "thead", "tbody", "details", "summary", "main", "header", "h1", "h2", "h3", "h4", "pre", "code", "kbd", "strong", "em", "span", "a", "section", "nav", "figure", "figcaption", "blockquote", "small", "abbr", "b", "i", "label"]);

const DAY_IDS = ["timebox", "objectives", "before-you-start", "concepts", "pitfalls", "challenge", "quiz", "docs", "wrap-up"];
let totalErr = 0, totalWarn = 0;

function lineOf(text, idx) { return text.slice(0, idx).split("\n").length; }

files.forEach(file => {
  const text = fs.readFileSync(file, "utf8").replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, " "));
  const rel = path.relative(COURSE, file).replace(/\\/g, "/");
  const errs = [], warns = [];
  const E = (m, i) => errs.push((i !== undefined ? "L" + lineOf(text, i) + ": " : "") + m);
  const W = (m, i) => warns.push((i !== undefined ? "L" + lineOf(text, i) + ": " : "") + m);

  const folder = rel.split("/")[0];
  const base = path.basename(file, ".html");
  const bodyTag = text.match(/<body([^>]*)>/);
  if (!bodyTag) E("missing <body>");
  else {
    const get = n => (bodyTag[1].match(new RegExp(n + '="([^"]*)"')) || [])[1];
    const page = get("data-page"), id = get("data-id"), root = get("data-root");
    const expPage = { days: "day", games: "game", reference: "reference", publishing: "publishing" }[folder];
    if (page !== expPage) E(`data-page should be "${expPage}" (is "${page}")`);
    if (root !== "../") E(`data-root should be "../" (is "${root}")`);
    if (folder === "days" && id !== base) E(`data-id should be "${base}" (is "${id}")`);
    if (folder === "games" && !/^g\d\d$/.test(id || "")) E(`data-id should be gNN (is "${id}")`);
    if ((folder === "reference" || folder === "publishing") && id !== base) E(`data-id should be "${base}" (is "${id}")`);
  }
  if (!/<link[^>]+assets\/css\/course\.css/.test(text)) E("missing course.css link");
  if (!/<script src="\.\.\/assets\/js\/course-data\.js">/.test(text)) E("missing course-data.js script");
  if (!/<script src="\.\.\/assets\/js\/course\.js">/.test(text)) E("missing course.js script");
  if ((text.match(/<main[\s>]/g) || []).length !== 1) E("need exactly one <main>");
  if (/lorem ipsum|TODO|TBD|FIXME|\bXXX\b/i.test(text.replace(/<script type="text\/x-code"[\s\S]*?<\/script>/g, ""))) W("contains TODO/TBD/lorem placeholder-like text");

  // script balance
  const opens = (text.match(/<script\b/g) || []).length, closes = (text.match(/<\/script>/g) || []).length;
  if (opens !== closes) E(`unbalanced <script> tags: ${opens} opens vs ${closes} closes (a code block is probably unterminated)`);

  // extract code blocks
  const codeRe = /<script type="text\/x-code"([^>]*)>([\s\S]*?)<\/script>/g;
  let m, codeCount = 0, codeLines = 0;
  while ((m = codeRe.exec(text)) !== null) {
    codeCount++;
    const attrs = m[1], code = m[2];
    const lang = (attrs.match(/data-lang="([^"]*)"/) || [])[1] || "gdscript";
    const idx = m.index;
    codeLines += code.split("\n").length;
    if (!/data-file=/.test(attrs)) W("code block without data-file", idx);
    if (/\t/.test(code)) E("tab character in code block (use 4 spaces)", idx);
    if (lang === "gdscript") {
      BANNED.forEach(([re, msg]) => { if (re.test(code)) E("banned/Godot3 pattern in code: " + msg, idx); });
      if (/\bvar\s+\w+\s*=\s*[^=]/.test(code) && !/@warning_ignore/.test(code)) {
        // untyped var is only a warning; the contract asks for static typing
        const untyped = (code.match(/^\s*var\s+\w+\s*=\s*[^=\n]/gm) || []).length;
        if (untyped > 0) W(`${untyped} untyped 'var x = ...' in a code block (contract: static typing; use 'var x: T =' or ':=')`, idx);
      }
      // indentation consistency: lines with odd indent
      const odd = code.split("\n").filter(l => /^( +)\S/.test(l) && (l.match(/^ +/)[0].length % 4 !== 0) && !/^\s*[#)\]}]/.test(l) && !/^\s+\.\w/.test(l));
      if (odd.length > 3) W(`${odd.length} lines whose indentation isn't a multiple of 4 spaces (continuation lines are fine)`, idx);
    }
  }

  // outside-code banned mentions are advisory
  const prose = text.replace(/<script type="text\/x-code"[\s\S]*?<\/script>/g, "");
  BANNED.slice(0, 11).forEach(([re, msg]) => {
    const mm = re.exec(prose);
    if (mm) W("banned term appears in prose (ok only if telling the learner NOT to use it): " + msg, mm.index);
  });

  // tag balance outside code/comments
  const stripped = text.replace(/<!--[\s\S]*?-->/g, c => c.replace(/[^\n]/g, " ")).replace(/<script type="text\/x-code"[\s\S]*?<\/script>/g, c => c.replace(/[^\n]/g, " "));
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^<>]*?)?)(\/?)>/g;
  const stack = [];
  let tm, tagErr = 0;
  const bodyStart = stripped.indexOf("<body");
  while ((tm = tagRe.exec(stripped)) !== null && tagErr < 5) {
    if (tm.index < bodyStart) continue;
    const closing = tm[1] === "/", name = tm[2].toLowerCase();
    if (!TRACK.has(name) || VOID.has(name) || tm[4] === "/") continue;
    if (!closing) stack.push({ name, idx: tm.index });
    else {
      const top = stack.pop();
      if (!top || top.name !== name) {
        E(`mismatched </${name}>` + (top ? ` (expected </${top.name}> opened at L${lineOf(text, top.idx)})` : ""), tm.index);
        tagErr++;
        if (top && top.name !== name) { /* try to resync */ const j = stack.map(s => s.name).lastIndexOf(name); if (j >= 0) stack.length = j; else stack.push(top); }
      }
    }
  }
  if (stack.length && tagErr === 0) E(`unclosed <${stack[stack.length - 1].name}> opened at L${lineOf(text, stack[stack.length - 1].idx)}`);

  // ids
  const ids = {};
  (text.match(/\sid="([^"]+)"/g) || []).forEach(s => { const id = s.match(/id="([^"]+)"/)[1]; ids[id] = (ids[id] || 0) + 1; });
  Object.keys(ids).forEach(id => { if (ids[id] > 1) E(`duplicate id="${id}"`); });

  // links
  const hrefRe = /<a\s[^>]*href="([^"]+)"/g;
  while ((m = hrefRe.exec(text)) !== null) {
    const h = m[1];
    if (h.startsWith("#") || h.startsWith("mailto:")) continue;
    if (/^https?:\/\//.test(h)) {
      const dm = h.match(/^https:\/\/docs\.godotengine\.org\/en\/stable\/([^#?]+)\.html/);
      if (dm) {
        if (!DOCS) skippedDocsCheck = true;
        else {
          const rst = path.join(DOCS, dm[1] + ".rst");
          if (!fs.existsSync(rst)) E(`docs link has no matching .rst in repo: ${dm[1]}.rst`, m.index);
        }
      }
      continue;
    }
    const target = path.resolve(path.dirname(file), h.split("#")[0].split("?")[0]);
    if (!fs.existsSync(target)) {
      // sibling pages may not be written yet
      W(`relative link target does not exist (yet?): ${h}`, m.index);
    }
  }

  // page specific
  if (folder === "days") {
    DAY_IDS.forEach(id => { if (!ids[id]) E(`missing required section id="${id}"`); });
    if (!ids["build-1"]) E('missing at least one id="build-1" section');
    if (!/id="auto-chips"/.test(text)) E('missing <div class="chips" id="auto-chips">');
    const quizQ = (text.match(/class="q"/g) || []).length;
    if (quizQ < 3) E(`quiz needs 3-5 questions (has ${quizQ})`);
    (text.match(/<div class="q"[^>]*>/g) || []).forEach(q => { if (!/data-correct="\d+"/.test(q)) E("quiz question missing data-correct"); });
    const stepsLis = (text.match(/<ol class="steps">[\s\S]*?<\/ol>/g) || []).join("").split("<li").length - 1;
    if (stepsLis < 12) W(`only ${stepsLis} step items; a day should usually have 20+ click-by-click steps`);
    if (!/class="checkpoint"/.test(text)) E("no .checkpoint blocks");
    if (codeCount === 0 && !/Day (14)/.test(text)) W("no code blocks in a day page");
    const tot = text.match(/<tr class="total">[\s\S]*?<\/tr>/);
    if (!tot) E("timebox has no <tr class=\"total\">");
    else {
      const t = tot[0].replace(/<[^>]+>/g, " ");
      const hm = t.match(/(\d+)\s*h(?:ours?)?\s*(?:(\d+)\s*min)?/i);
      const mm2 = t.match(/(\d+)\s*min/i);
      let mins = hm ? parseInt(hm[1]) * 60 + (hm[2] ? parseInt(hm[2]) : 0) : (mm2 ? parseInt(mm2[1]) : NaN);
      if (isNaN(mins)) W("could not parse the timebox total");
      else if (mins < 170 || mins > 245) E(`timebox total ${mins} min is outside 180-240`);
    }
    const bytes = Buffer.byteLength(text);
    if (bytes < 25000) W(`page is small (${Math.round(bytes / 1024)} KB); in-depth day pages are usually 30-70 KB`);
  }
  if (folder === "games") {
    ["design", "scope", "architecture", "assets", "days", "stretch"].forEach(id => { if (!ids[id]) E(`missing required section id="${id}"`); });
    if (!/class="checklist"/.test(text)) E("game page needs a ul.checklist feature list");
  }

  const kb = Math.round(Buffer.byteLength(text) / 1024);
  const status = errs.length ? "FAIL" : (warns.length ? "warn" : "ok");
  console.log(`${status.padEnd(4)} ${rel}  (${kb} KB, ${text.split("\n").length} lines, ${codeCount} code blocks / ${codeLines} code lines)`);
  errs.forEach(e => console.log("   ERROR " + e));
  warns.slice(0, 15).forEach(w => console.log("   warn  " + w));
  if (warns.length > 15) console.log(`   warn  ... ${warns.length - 15} more warnings`);
  totalErr += errs.length; totalWarn += warns.length;
});

if (skippedDocsCheck) {
  console.log("warn  GODOT_DOCS is not set; skipped the check that docs URLs have a matching .rst file");
  totalWarn += 1;
}

console.log(`\n${files.length} file(s): ${totalErr} error(s), ${totalWarn} warning(s)`);
process.exit(totalErr ? 1 : 0);
