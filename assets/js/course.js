/* ==========================================================================
   Godot 30-Day Course - shared behaviour (no dependencies, works from file://)
   Expects window.COURSE (course-data.js) to be loaded first.
   <body data-page="day|game|reference|publishing|dashboard" data-id="day03" data-root="../">
   ========================================================================== */
(function () {
  "use strict";

  var C = window.COURSE;
  var body = document.body;
  var ROOT = body.getAttribute("data-root") || "";
  var PAGE = body.getAttribute("data-page") || "reference";
  var ID = body.getAttribute("data-id") || "";
  var STORE_KEY = "godotcourse.v1";
  var IN_APP = /GodotCourseApp/.test(navigator.userAgent || "");

  /* ------------------------------------------------------------------ */
  /* Storage                                                             */
  /* ------------------------------------------------------------------ */
  var memory = { days: {}, steps: {}, checks: {}, quiz: {}, last: "", start: "" };
  function load() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) { var o = JSON.parse(raw); for (var k in memory) { if (o[k] !== undefined) memory[k] = o[k]; } }
    } catch (e) { /* storage blocked: stay in memory */ }
  }
  function save() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(memory)); } catch (e) { /* ignore */ }
  }
  load();

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayId(n) { return "day" + pad(n); }
  function dayFile(n) { return "days/" + dayId(n) + ".html"; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
  function doneCount() { var c = 0; for (var k in memory.days) if (memory.days[k]) c++; return c; }
  function progressHtml() {
    return "<b>" + doneCount() + "</b><span class=\"progress-of\">/" + C.days.length + "</span><span class=\"progress-label\"> days done</span>";
  }
  function savedWhere() { return IN_APP ? "on this phone" : "in this browser"; }
  function totalHours() { var h = 0; (C.days || []).forEach(function (d) { h += d.hours || 0; }); return h; }
  function gameById(id) { for (var i = 0; i < C.games.length; i++) if (C.games[i].id === id) return C.games[i]; return null; }

  /* ------------------------------------------------------------------ */
  /* Syntax highlighting                                                 */
  /* ------------------------------------------------------------------ */
  var GD_KW = ("if elif else for while match break continue pass return class class_name extends is in as and or not " +
    "signal func static const enum var await assert breakpoint preload yield super void when " +
    "true false null self PI TAU INF NAN").split(" ");
  var GD_KWSET = {}; GD_KW.forEach(function (w) { GD_KWSET[w] = 1; });
  var GD_TYPES = ("int float bool String StringName NodePath Vector2 Vector2i Vector3 Vector3i Vector4 Rect2 Rect2i Transform2D Transform3D " +
    "Basis Quaternion Color Array Dictionary Callable Signal RID Object Variant PackedScene Resource Node Node2D Node3D Control").split(" ");
  var GD_TYPESET = {}; GD_TYPES.forEach(function (w) { GD_TYPESET[w] = 1; });

  var GD_RE = new RegExp([
    "(#[^\\n]*)",                                                              // 1 comment
    "(\"\"\"[\\s\\S]*?\"\"\"|[&^]?\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')", // 2 string
    "(@[A-Za-z_]\\w*)",                                                        // 3 annotation
    "(\\$\"[^\"]*\"|\\$[A-Za-z_][\\w/]*|(?<=[\\s(=,\\[])%[A-Z][\\w]*)",       // 4 node path
    "(\\b0x[0-9a-fA-F_]+\\b|\\b\\d[\\d_]*(?:\\.\\d[\\d_]*)?(?:e[+-]?\\d+)?\\b)", // 5 number
    "(\\b[A-Za-z_]\\w*\\b)"                                                    // 6 word
  ].join("|"), "g");

  function hlGd(src) {
    var out = "", last = 0, m;
    GD_RE.lastIndex = 0;
    while ((m = GD_RE.exec(src)) !== null) {
      out += esc(src.slice(last, m.index));
      var t = m[0], cls = "";
      if (m[1]) cls = "tok-com";
      else if (m[2]) cls = "tok-str";
      else if (m[3]) cls = "tok-ann";
      else if (m[4]) cls = "tok-node";
      else if (m[5]) cls = "tok-num";
      else if (m[6]) {
        var next = src.charAt(m.index + t.length);
        if (GD_KWSET[t]) cls = "tok-kw";
        else if (GD_TYPESET[t]) cls = "tok-type";
        else if (/^[A-Z][A-Z0-9_]+$/.test(t)) cls = "tok-const";
        else if (/^[A-Z]/.test(t)) cls = "tok-type";
        else if (next === "(") cls = "tok-fn";
      }
      out += cls ? '<span class="' + cls + '">' + esc(t) + "</span>" : esc(t);
      last = m.index + t.length;
    }
    return out + esc(src.slice(last));
  }

  function hlGeneric(src, lang) {
    // strings, # or ; or // comments, numbers, simple keywords. Used for json/cfg/shell/csv/etc.
    var comment = (lang === "cfg" || lang === "ini") ? "(;[^\\n]*|#[^\\n]*)" :
      (lang === "json" || lang === "csv" || lang === "text") ? "(\\u0000)" : "(#[^\\n]*)";
    var re = new RegExp(comment + "|(\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b(?:true|false|null)\\b)|(^\\[[^\\]\\n]+\\])", "gm");
    var out = "", last = 0, m;
    while ((m = re.exec(src)) !== null) {
      out += esc(src.slice(last, m.index));
      var cls = m[1] ? "tok-com" : m[2] ? "tok-str" : m[3] ? "tok-num" : m[4] ? "tok-kw" : "tok-type";
      out += '<span class="' + cls + '">' + esc(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + esc(src.slice(last));
  }

  function highlight(src, lang) {
    lang = (lang || "gdscript").toLowerCase();
    if (lang === "gd" || lang === "gdscript") return hlGd(src);
    if (lang === "none") return esc(src);
    return hlGeneric(src, lang);
  }

  function dedent(text) {
    text = text.replace(/\r\n/g, "\n").replace(/^\n+/, "").replace(/\s+$/, "");
    var lines = text.split("\n"), min = null;
    lines.forEach(function (l) {
      if (!l.trim()) return;
      var ind = l.match(/^[ ]*/)[0].length;
      if (min === null || ind < min) min = ind;
    });
    if (min) lines = lines.map(function (l) { return l.slice(Math.min(min, l.match(/^[ ]*/)[0].length)); });
    return lines.join("\n");
  }

  function copyText(text, btn) {
    function ok() { var old = btn.textContent; btn.textContent = "Copied!"; setTimeout(function () { btn.textContent = old; }, 1200); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) { btn.textContent = "Press Ctrl+C"; }
      document.body.removeChild(ta);
    }
  }

  function buildCodeBlock(raw, lang, file) {
    var text = dedent(raw);
    var wrap = el("div", "codeblock");
    var head = el("div", "code-head");
    if (file) head.appendChild(el("span", "file", esc(file)));
    head.appendChild(el("span", "lang", esc(lang || "gdscript")));
    var btn = el("button", "", "Copy");
    btn.type = "button";
    btn.addEventListener("click", function () { copyText(text, btn); });
    head.appendChild(btn);
    var pre = el("pre"); var code = el("code");
    code.innerHTML = highlight(text, lang);
    pre.appendChild(code);
    wrap.appendChild(head); wrap.appendChild(pre);
    return wrap;
  }

  function processCode(root) {
    // Preferred: <script type="text/x-code" data-lang="gdscript" data-file="player.gd"> raw code, no escaping </script>
    var scripts = root.querySelectorAll('script[type="text/x-code"]');
    Array.prototype.forEach.call(scripts, function (s) {
      var block = buildCodeBlock(s.textContent, s.getAttribute("data-lang"), s.getAttribute("data-file"));
      s.parentNode.replaceChild(block, s);
    });
    // Also supported: <pre class="code" data-lang="" data-file=""><code>escaped code</code></pre>
    var pres = root.querySelectorAll("pre.code");
    Array.prototype.forEach.call(pres, function (p) {
      var block = buildCodeBlock(p.textContent, p.getAttribute("data-lang"), p.getAttribute("data-file"));
      p.parentNode.replaceChild(block, p);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Interactive widgets: steps, checklists, quizzes                     */
  /* ------------------------------------------------------------------ */
  function processSteps(root) {
    var lists = root.querySelectorAll("ol.steps");
    var listIndex = 0;
    Array.prototype.forEach.call(lists, function (ol) {
      var li = ol.children, li_i = 0;
      Array.prototype.forEach.call(li, function (item) {
        if (item.tagName !== "LI") return;
        var key = ID + ":s" + listIndex + "." + li_i;
        if (memory.steps[key]) item.classList.add("done");
        var b = el("button", "step-toggle", item.classList.contains("done") ? "Undo" : "Mark done");
        b.type = "button";
        b.addEventListener("click", function () {
          var d = item.classList.toggle("done");
          memory.steps[key] = d ? 1 : 0; if (!d) delete memory.steps[key];
          b.textContent = d ? "Undo" : "Mark done"; save();
        });
        item.appendChild(b);
        li_i++;
      });
      listIndex++;
    });
  }

  function processChecklists(root) {
    var lists = root.querySelectorAll("ul.checklist");
    Array.prototype.forEach.call(lists, function (ul, ui) {
      Array.prototype.forEach.call(ul.children, function (item, i) {
        var key = ID + ":c" + ui + "." + i;
        if (memory.checks[key]) item.classList.add("checked");
        item.addEventListener("click", function (e) {
          if (e.target.tagName === "A") return;
          var on = item.classList.toggle("checked");
          if (on) memory.checks[key] = 1; else delete memory.checks[key];
          save();
        });
      });
    });
  }

  function processQuizzes(root) {
    var qs = root.querySelectorAll(".quiz .q");
    Array.prototype.forEach.call(qs, function (q, qi) {
      var correct = parseInt(q.getAttribute("data-correct") || "0", 10);
      var list = q.querySelector("ul, ol");
      if (!list) return;
      var opts = el("div", "opts");
      var name = "q-" + ID + "-" + qi;
      Array.prototype.forEach.call(list.children, function (li, oi) {
        var label = el("label");
        var input = el("input"); input.type = "radio"; input.name = name; input.value = oi;
        label.appendChild(input);
        var span = el("span", "", li.innerHTML);
        label.appendChild(span);
        opts.appendChild(label);
        input.addEventListener("change", function () { answer(oi); });
      });
      list.parentNode.replaceChild(opts, list);
      function answer(oi) {
        q.classList.add("answered");
        Array.prototype.forEach.call(opts.children, function (lab, i) {
          lab.classList.remove("correct", "wrong");
          if (i === correct) lab.classList.add("correct");
          else if (i === oi) lab.classList.add("wrong");
        });
        memory.quiz[ID + ":" + qi] = oi; save();
      }
      var saved = memory.quiz[ID + ":" + qi];
      if (saved !== undefined) {
        opts.children[saved].querySelector("input").checked = true;
        answer(saved);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Chrome: top bar, sidebar, TOC                                       */
  /* ------------------------------------------------------------------ */
  function currentFileKey() {
    if (PAGE === "day") return "days/" + ID + ".html";
    return null;
  }

  function buildSidebar() {
    var sb = el("aside", "sidebar");
    function item(href, num, text, id, isDay) {
      var a = el("a", "nav-item");
      a.href = ROOT + href;
      a.innerHTML = '<span class="num">' + num + '</span><span>' + esc(text) + '</span><span class="tick">✓</span>';
      if (id && ID === id) a.classList.add("current");
      if (isDay && memory.days[id]) a.classList.add("done");
      return a;
    }
    var home = item("index.html", "⌂", "Dashboard", PAGE === "dashboard" ? ID : "__none");
    if (PAGE === "dashboard") home.classList.add("current");
    sb.appendChild(home);

    (C.parts || []).forEach(function (p) {
      sb.appendChild(el("h4", "", esc(p.title)));
      C.days.filter(function (d) { return d.part === p.id; }).forEach(function (d) {
        sb.appendChild(item(dayFile(d.n), pad(d.n), d.title, dayId(d.n), true));
      });
    });

    sb.appendChild(el("h4", "", "Games"));
    C.games.forEach(function (g) { sb.appendChild(item(g.file, g.num, g.title, g.id, false)); });
    sb.appendChild(el("h4", "", "Reference"));
    C.references.forEach(function (r) { sb.appendChild(item(r.file, "•", r.title, r.id, false)); });
    sb.appendChild(el("h4", "", "Publishing"));
    C.publishing.forEach(function (r) { sb.appendChild(item(r.file, "•", r.title, r.id, false)); });
    return sb;
  }

  function buildSearch() {
    var wrap = el("div", "search-wrap");
    var input = el("input", "search"); input.type = "search"; input.placeholder = "Search the course…  ( / )";
    var results = el("div", "search-results");
    wrap.appendChild(input); wrap.appendChild(results);

    var index = [];
    C.days.forEach(function (d) {
      index.push({ type: "Day " + d.n, title: d.title, sub: d.summary, href: dayFile(d.n), hay: (d.title + " " + d.summary + " " + (d.topics || []).join(" ")).toLowerCase() });
    });
    C.games.forEach(function (g) {
      index.push({ type: "Game", title: g.title, sub: g.pitch, href: g.file, hay: (g.title + " " + g.genre + " " + g.pitch + " " + (g.skills || []).join(" ")).toLowerCase() });
    });
    C.references.concat(C.publishing).forEach(function (r) {
      index.push({ type: r.file.indexOf("publishing") === 0 ? "Publishing" : "Reference", title: r.title, sub: r.desc, href: r.file, hay: (r.title + " " + r.desc + " " + (r.keywords || "")).toLowerCase() });
    });

    function run() {
      var q = input.value.trim().toLowerCase();
      if (!q) { results.classList.remove("open"); return; }
      var words = q.split(/\s+/);
      var scored = [];
      index.forEach(function (it) {
        var s = 0;
        for (var i = 0; i < words.length; i++) {
          if (it.hay.indexOf(words[i]) < 0) { s = -1; break; }
          s += it.title.toLowerCase().indexOf(words[i]) >= 0 ? 3 : 1;
        }
        if (s > 0) scored.push({ it: it, s: s });
      });
      scored.sort(function (a, b) { return b.s - a.s; });
      results.innerHTML = "";
      if (!scored.length) results.innerHTML = '<a style="pointer-events:none"><span class="sr-sub">No matches</span></a>';
      scored.slice(0, 12).forEach(function (r) {
        var a = el("a"); a.href = ROOT + r.it.href;
        a.innerHTML = '<div class="sr-type">' + esc(r.it.type) + '</div><div>' + esc(r.it.title) + '</div><div class="sr-sub">' + esc(r.it.sub || "") + "</div>";
        results.appendChild(a);
      });
      results.classList.add("open");
    }
    input.addEventListener("input", run);
    input.addEventListener("focus", run);
    document.addEventListener("click", function (e) {
      if (wrap.contains(e.target)) return;
      if (e.target.closest && e.target.closest(".search-toggle")) return;
      results.classList.remove("open");
      var bar = wrap.closest(".topbar");
      if (bar) bar.classList.remove("search-open");
    });
    document.addEventListener("keydown", function (e) {
      var bar = wrap.closest(".topbar");
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (bar) bar.classList.add("search-open");
        input.focus();
      }
      if (e.key === "Escape") {
        results.classList.remove("open");
        if (bar) bar.classList.remove("search-open");
        input.blur();
      }
    });
    return wrap;
  }

  function buildTopbar(sidebar, setDrawer) {
    var tb = el("header", "topbar");
    var toggle = el("button", "menu-toggle", "☰");
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.addEventListener("click", function () {
      tb.classList.remove("search-open");
      setDrawer(!sidebar.classList.contains("open"));
    });
    tb.appendChild(toggle);
    var brand = el("a", "brand", '<span class="logo">G</span><span class="brand-full">' + esc(C.title) + '</span><span class="brand-short">Course</span>');
    brand.href = ROOT + "index.html";
    tb.appendChild(brand);
    tb.appendChild(el("div", "spacer"));
    var prog = el("div", "progress-mini", progressHtml());
    prog.id = "progress-mini";
    tb.appendChild(prog);
    var searchBtn = el("button", "search-toggle", "Search");
    searchBtn.type = "button";
    searchBtn.setAttribute("aria-label", "Search");
    searchBtn.addEventListener("click", function () {
      setDrawer(false);
      var opening = !tb.classList.contains("search-open");
      tb.classList.toggle("search-open", opening);
      var input = tb.querySelector("input.search");
      if (opening && input) input.focus();
    });
    tb.appendChild(searchBtn);
    tb.appendChild(buildSearch());
    return tb;
  }

  function buildToc(main) {
    var hs = main.querySelectorAll("h2");
    if (!hs.length || PAGE === "dashboard") return null;
    var toc = el("nav", "toc");
    toc.appendChild(el("h5", "", "On this page"));
    var links = [];
    Array.prototype.forEach.call(hs, function (h, i) {
      if (!h.id) h.id = slug(h.textContent) || ("sec-" + i);
      var a = el("a", "", esc(h.textContent)); a.href = "#" + h.id;
      toc.appendChild(a); links.push({ a: a, h: h });
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) { l.a.classList.toggle("active", l.h === en.target); });
          }
        });
      }, { rootMargin: "-70px 0px -70% 0px" });
      links.forEach(function (l) { io.observe(l.h); });
    }
    return toc;
  }

  function buildDayFooter(main) {
    var n = parseInt(ID.replace("day", ""), 10);
    var foot = el("div", "day-footer");
    var row = el("div", "done-row");
    var btn = el("button", "btn", ""); btn.type = "button";
    function refresh() {
      var d = !!memory.days[ID];
      btn.className = "btn" + (d ? " done" : "");
      btn.textContent = d ? "✓ Day " + n + " completed (click to undo)" : "Mark Day " + n + " as complete";
      var link = document.querySelector('.sidebar a.nav-item.current');
      if (link) link.classList.toggle("done", d);
      var pm = document.getElementById("progress-mini");
      if (pm) pm.innerHTML = progressHtml();
    }
    btn.addEventListener("click", function () {
      if (memory.days[ID]) delete memory.days[ID]; else memory.days[ID] = 1;
      save(); refresh();
    });
    row.appendChild(btn);
    row.appendChild(el("span", "muted", "Your progress is stored " + savedWhere() + " only."));
    foot.appendChild(row);

    var pager = el("div", "pager");
    var prev = C.days.filter(function (d) { return d.n === n - 1; })[0];
    var next = C.days.filter(function (d) { return d.n === n + 1; })[0];
    if (prev) { var a = el("a", "prev", "<small>← Previous</small>Day " + prev.n + ": " + esc(prev.title)); a.href = ROOT + dayFile(prev.n); pager.appendChild(a); }
    if (next) { var b = el("a", "next", "<small>Next →</small>Day " + next.n + ": " + esc(next.title)); b.href = ROOT + dayFile(next.n); pager.appendChild(b); }
    foot.appendChild(pager);
    main.appendChild(foot);
    refresh();
    memory.last = ID; save();
  }

  function buildReaderBar() {
    if (PAGE !== "day") return;
    var n = parseInt(ID.replace("day", ""), 10);
    var prev = C.days.filter(function (d) { return d.n === n - 1; })[0];
    var next = C.days.filter(function (d) { return d.n === n + 1; })[0];
    var bar = el("nav", "reader-bar");
    bar.setAttribute("aria-label", "Lesson pager");
    function slot(cls, day, label) {
      if (!day) { bar.appendChild(el("span", cls + " is-empty")); return; }
      var a = el("a", cls, "<small>" + label + "</small><span>Day " + day.n + "</span>");
      a.href = ROOT + dayFile(day.n);
      bar.appendChild(a);
    }
    slot("prev", prev, "← Previous");
    slot("next", next, "Next →");
    body.appendChild(bar);
  }

  function makeTablesScroll(root) {
    Array.prototype.forEach.call(root.querySelectorAll("table"), function (table) {
      if (table.parentNode && table.parentNode.classList && table.parentNode.classList.contains("table-scroll")) return;
      var wrap = el("div", "table-scroll");
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Day header chips (auto from manifest if page has <div id="auto-chips">) */
  /* ------------------------------------------------------------------ */
  function autoChips(root) {
    var box = root.querySelector("#auto-chips");
    if (!box || PAGE !== "day") return;
    var n = parseInt(ID.replace("day", ""), 10);
    var d = C.days.filter(function (x) { return x.n === n; })[0];
    if (!d) return;
    var html = '<span class="chip blue">Day ' + d.n + " of " + C.days.length + "</span>" +
      '<span class="chip green">⏱ ~' + d.hours + " h</span>";
    if (d.game) {
      var g = gameById(d.game);
      if (g) html += '<a class="chip amber" href="' + ROOT + g.file + '">🎮 ' + esc(g.title) + "</a>";
    }
    box.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Dashboard                                                           */
  /* ------------------------------------------------------------------ */
  function daysSinceStart() {
    if (!memory.start) return null;
    var s = new Date(memory.start + "T00:00:00");
    if (isNaN(s.getTime())) return null;
    var now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((now - s) / 86400000) + 1;
  }

  function renderDashboard(main) {
    var done = doneCount();
    var pct = Math.round(done / C.days.length * 100);
    var hoursDone = 0;
    C.days.forEach(function (d) { if (memory.days[dayId(d.n)]) hoursDone += d.hours; });
    var nextDay = null;
    for (var i = 0; i < C.days.length; i++) { if (!memory.days[dayId(C.days[i].n)]) { nextDay = C.days[i]; break; } }
    var cur = daysSinceStart();

    var html = '<div class="hero"><div class="eyebrow chip blue" style="display:inline-block">Godot 4 · GDScript · Zero to Published</div>' +
      "<h1>" + esc(C.title) + "</h1><p>" + esc(C.subtitle) + "</p>" +
      '<div class="stats">' +
      '<div class="stat"><div class="v">' + done + " / " + C.days.length + '</div><div class="l">Days complete</div></div>' +
      '<div class="stat"><div class="v">' + hoursDone.toFixed(1).replace(/\.0$/, "") + " / " + totalHours().toFixed(0) + '</div><div class="l">Study hours</div></div>' +
      '<div class="stat"><div class="v">' + C.games.length + '</div><div class="l">Games to build</div></div>' +
      '<div class="stat"><div class="v">' + (cur ? (cur < 1 ? "Starts soon" : cur > C.days.length ? "Finished!" : "Day " + cur) : "—") + '</div><div class="l">Calendar day</div></div>' +
      "</div>" +
      '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="hero-actions">' +
      (nextDay ? '<a class="btn" href="' + dayFile(nextDay.n) + '"><span>' + (done ? "Continue" : "Start") + " · Day " + nextDay.n + "</span><span>" + esc(nextDay.title) + "</span></a>" : '<span class="btn done">All 30 days complete</span>') +
      '<a class="btn secondary" href="reference/editor-tour.html">Editor tour</a>' +
      '<a class="btn secondary" href="publishing/launch-checklist.html">Launch checklist</a>' +
      '<label class="muted" style="align-self:center;font-size:14px">Course start date: <input type="date" id="start-date" value="' + esc(memory.start) + '" style="background:var(--bg-2);color:var(--text);border:1px solid var(--line);border-radius:6px;padding:4px 8px"></label>' +
      "</div></div>";

    (C.parts || []).forEach(function (p) {
      html += '<div class="part-title"><h2>' + esc(p.title) + "</h2><span>" + esc(p.blurb || "") + "</span></div>";
      html += '<div class="day-grid">';
      C.days.filter(function (d) { return d.part === p.id; }).forEach(function (d) {
        var g = d.game ? gameById(d.game) : null;
        var cls = "day-card" + (memory.days[dayId(d.n)] ? " done" : "") + (cur === d.n ? " today" : "") + (d.type === "buffer" ? " buffer" : "");
        html += '<a class="' + cls + '" href="' + dayFile(d.n) + '"><span class="dcheck">✓</span>' +
          '<div class="dn">Day ' + d.n + " · ~" + d.hours + 'h</div><div class="dt">' + esc(d.title) + '</div><div class="ds">' + esc(d.summary) + "</div>" +
          (g ? '<div class="dg">🎮 ' + esc(g.title) + "</div>" : "") + "</a>";
      });
      html += "</div>";
    });

    html += '<div class="part-title"><h2>Game portfolio</h2><span>10 games: 5 to learn with, 5 to ship</span></div><div class="game-grid">';
    C.games.forEach(function (g) {
      html += '<a class="game-card ' + (g.kind === "pub" ? "pub" : "train") + '" href="' + g.file + '">' +
        '<div class="gg">' + (g.kind === "pub" ? "PUBLISHABLE" : "TRAINING") + " · " + esc(g.dim) + " · " + esc(g.genre) + "</div>" +
        '<div class="gt">' + esc(g.num) + ". " + esc(g.title) + '</div><div class="gd">' + esc(g.pitch) + "</div>" +
        '<div class="gm"><span class="chip">Days ' + g.days[0] + "–" + g.days[1] + "</span>" +
        (g.skills || []).slice(0, 3).map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + "</div></a>";
    });
    html += "</div>";

    html += '<div class="part-title"><h2>Reference &amp; publishing</h2><span>Keep these open in a second tab</span></div><div class="ref-grid">';
    C.references.concat(C.publishing).forEach(function (r) {
      html += '<a class="ref-card" href="' + r.file + '"><b>' + esc(r.title) + "</b><span>" + esc(r.desc) + "</span></a>";
    });
    html += "</div>";

    html += '<hr><p class="muted">Tip: press <kbd>/</kbd> to search. Progress is saved ' + savedWhere() + '. ' +
      '<a href="#" id="reset-progress">Reset all progress</a></p>';
    main.innerHTML = html;

    var sd = main.querySelector("#start-date");
    sd.addEventListener("change", function () { memory.start = sd.value; save(); renderDashboard(main); });
    main.querySelector("#reset-progress").addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("Reset ALL course progress " + savedWhere() + "?")) {
        memory = { days: {}, steps: {}, checks: {}, quiz: {}, last: "", start: "" }; save(); location.reload();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  function boot() {
    var vp = document.querySelector('meta[name="viewport"]');
    if (vp) {
      var vpContent = vp.getAttribute("content") || "";
      if (vpContent.indexOf("viewport-fit") < 0) vp.setAttribute("content", vpContent + ", viewport-fit=cover");
    }
    if (IN_APP) body.classList.add("in-app");

    var main = document.querySelector("main");
    if (!main) { main = el("main", "lesson"); while (body.firstChild) main.appendChild(body.firstChild); }
    if (PAGE === "dashboard") { main.classList.add("lesson", "wide"); renderDashboard(main); }
    else { main.classList.add("lesson"); }

    processCode(main);
    processSteps(main);
    processChecklists(main);
    processQuizzes(main);
    autoChips(main);
    makeTablesScroll(main);

    var sidebar = buildSidebar();
    var backdrop = el("div", "nav-backdrop");
    function setDrawer(open) {
      sidebar.classList.toggle("open", !!open);
      backdrop.classList.toggle("open", !!open);
      body.classList.toggle("drawer-open", !!open);
    }
    sidebar.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest("a")) setDrawer(false);
    });
    backdrop.addEventListener("click", function () { setDrawer(false); });

    var topbar = buildTopbar(sidebar, setDrawer);
    var layout = el("div", "layout");
    var content = el("div", "content");
    main.parentNode.insertBefore(layout, main);
    content.appendChild(main);
    layout.appendChild(sidebar);
    layout.appendChild(content);
    if (PAGE === "day") buildDayFooter(main);
    var toc = buildToc(main);
    if (toc) {
      layout.appendChild(toc);
      var tocBtn = el("button", "toc-toggle", "Contents");
      tocBtn.type = "button";
      tocBtn.setAttribute("aria-label", "On this page");
      tocBtn.addEventListener("click", function () {
        setDrawer(false);
        topbar.classList.remove("search-open");
        toc.classList.toggle("open");
      });
      var searchBtn = topbar.querySelector(".search-toggle");
      topbar.insertBefore(tocBtn, searchBtn);
      toc.addEventListener("click", function (e) {
        if (e.target && e.target.closest && e.target.closest("a")) toc.classList.remove("open");
      });
    }
    body.insertBefore(topbar, layout);
    body.appendChild(backdrop);
    if (PAGE === "day") buildReaderBar();

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      setDrawer(false);
      if (toc) toc.classList.remove("open");
    });

    // keep current sidebar item visible
    var cur = sidebar.querySelector(".current");
    if (cur && cur.scrollIntoView) { try { sidebar.scrollTop = Math.max(0, cur.offsetTop - 120); } catch (e) { /* ignore */ } }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  window.CourseUI = { highlight: highlight };
})();
