/* IaC course - shared lesson behaviour.
   - IAC.store: safe localStorage wrapper (pages still work when storage is empty or blocked)
   - IAC.xp: awards XP once per id, updates the header meter
   - copy buttons on <pre data-copy>
   - run strip: <div class="runstrip" data-waves='[["A"],["B","C"],["D"]]'>
   - checklist: <input type="checkbox" data-xp="15" id="...">
   - bet box: <textarea class="bet" id="..."> keeps what you typed
   - fill: guess-then-reveal blanks in a YAML block (rules: TASK-DESIGN.md)
   - lost here: <input type="checkbox" data-lost="d2-s1"> per lab, summary in <div class="lost-summary"></div> */
(function () {
  /* Storage key: <html data-page> locally. Published copies have no <html> of their own, so they fall back to
     the page address. Keep it that way, or saved XP and bets on published pages are lost. */
  var PAGE = document.documentElement.getAttribute("data-page") || location.pathname;

  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(PAGE + ":" + k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem(PAGE + ":" + k, JSON.stringify(v)); } catch (e) {} }
  };

  var xp = {
    awarded: store.get("xp", {}),
    total: function () { var t = 0; for (var k in this.awarded) t += this.awarded[k]; return t; },
    add: function (id, pts) { if (this.awarded[id]) return; this.awarded[id] = pts; store.set("xp", this.awarded); render(); },
    remove: function (id) { if (!this.awarded[id]) return; delete this.awarded[id]; store.set("xp", this.awarded); render(); }
  };

  function render() {
    var el = document.querySelector(".xp");
    if (!el) return;
    var max = +el.getAttribute("data-max") || 100, t = xp.total();
    el.querySelector(".xp-text").textContent = t + " of " + max + " XP";
    el.querySelector(".xp-fill").style.width = Math.min(100, (t / max) * 100) + "%";
  }

  function copyButtons() {
    document.querySelectorAll("pre[data-copy]").forEach(function (pre) {
      var b = document.createElement("button");
      b.className = "copy"; b.type = "button"; b.textContent = "Copy";
      b.addEventListener("click", function () {
        var text = pre.querySelector("code").innerText;
        var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1400); };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { b.textContent = "Select and copy"; });
        else b.textContent = "Select and copy";
      });
      pre.appendChild(b);
    });
  }

  function runStrips() {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll(".runstrip").forEach(function (box) {
      var waves = JSON.parse(box.getAttribute("data-waves"));
      var lanes = document.createElement("div"); lanes.className = "runstrip-lanes";
      waves.forEach(function (w, i) {
        var col = document.createElement("div"); col.className = "wave" + (w.length > 1 ? " multi" : "");
        var lab = document.createElement("div"); lab.className = "wave-label";
        lab.textContent = "moment " + (i + 1) + (w.length > 1 ? ", together" : "");
        col.appendChild(lab);
        w.forEach(function (n) { var p = document.createElement("span"); p.className = "pill"; p.textContent = n; col.appendChild(p); });
        lanes.appendChild(col);
      });
      var btn = document.createElement("button"); btn.type = "button"; btn.textContent = "Run it";
      btn.addEventListener("click", function () {
        var cols = lanes.querySelectorAll(".wave");
        lanes.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("on"); });
        cols.forEach(function (c, i) {
          setTimeout(function () { c.querySelectorAll(".pill").forEach(function (p) { p.classList.add("on"); }); }, reduce ? 0 : i * 650);
        });
        btn.textContent = "Run again";
      });
      box.appendChild(btn); box.appendChild(lanes);
    });
  }

  function checklist() {
    document.querySelectorAll("input[type=checkbox][data-xp]").forEach(function (cb) {
      var id = "check-" + cb.id;
      cb.checked = !!xp.awarded[id];
      cb.addEventListener("change", function () { cb.checked ? xp.add(id, +cb.getAttribute("data-xp")) : xp.remove(id); });
    });
  }

  function bets() {
    document.querySelectorAll("textarea.bet").forEach(function (t) {
      t.value = store.get("bet-" + t.id, "");
      t.addEventListener("input", function () { store.set("bet-" + t.id, t.value); });
    });
  }


  /* Fill: guess first, then reveal. Rules for the teacher: TASK-DESIGN.md.
     <div class="fill" id="fill-0005-a1" data-xp="20">          (data-xp is optional)
       <pre data-copy><code>apiVersion: <b class="blank" data-b="api"></b> ...</code></pre>
       <ol class="fill-list">
         <li data-b="api" data-label="apiVersion" data-kind="idea|lookup|given"
             data-accept="value|other value"  (or data-pattern="^regex$")  data-show="the value">
           <div class="fill-hint">where to find it (a command, a doc, a requirement line)</div>
           <div class="fill-why">why this value</div>
         </li>
       </ol>
     </div>
     Hint and Show unlock only after the first Check. A guess of "?" counts as a guess.
     When every blank is right or shown, it prints one line for the learning record:
     IaC fill | <page> <id> | <date> | first guess <n>/<total> | with help: <ids> | shown: <ids> */
  var KIND = { idea: "idea", lookup: "look-up", given: "given" };
  function today() {
    var d = new Date(), pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function copyText(btn, text, node) {
    var fallback = function () {
      var r = document.createRange(); r.selectNodeContents(node);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      btn.textContent = "Selected - press Cmd+C";
    };
    try {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { btn.textContent = "Copied"; }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e;
  }
  function norm(s) { return String(s).trim().replace(/^["']|["']$/g, "").replace(/\s+/g, " "); }

  function fills() {
    document.querySelectorAll(".fill").forEach(function (box) {
      var items = [].slice.call(box.querySelectorAll(".fill-list > li"));
      var state = store.get("fill-" + box.id, {});
      var resets = [];
      var done = el("div", "fill-done"); done.setAttribute("aria-live", "polite"); box.appendChild(done);
      var save = function () { store.set("fill-" + box.id, state); };

      function finish() {
        var all = items.every(function (li) { var s = state[li.getAttribute("data-b")]; return s && (s.ok || s.shown); });
        done.innerHTML = "";
        if (!all) return;
        var first = [], help = [], shown = [];
        items.forEach(function (li) {
          var b = li.getAttribute("data-b"), s = state[b];
          if (s.shown) shown.push(b); else if (s.tries === 1 && !s.hint) first.push(b); else help.push(b);
        });
        var tag = document.querySelector("[data-page]"), page = (tag && tag.getAttribute("data-page")) || "page";
        var line = "IaC fill | " + page + " " + box.id + " | " + today() + " | first guess " + first.length + "/" + items.length +
          " | with help: " + (help.length ? help.join(", ") : "none") + " | shown: " + (shown.length ? shown.join(", ") : "none");
        done.appendChild(el("p", "small", "All blanks filled. Copy the YAML above into your file. Paste this line in the chat - it goes into your learning record."));
        var code = el("code", "q-line", line); done.appendChild(code);
        var row = el("div", "fill-row");
        var copy = el("button", "btn", "Copy result line"); copy.type = "button";
        copy.addEventListener("click", function () { copyText(copy, line, code); });
        var again = el("button", "btn ghost", "Start over"); again.type = "button";
        again.addEventListener("click", function () { state = {}; save(); resets.forEach(function (r) { r(); }); finish(); });
        row.appendChild(copy); row.appendChild(again); done.appendChild(row);
        var pts = +box.getAttribute("data-xp"); if (pts) xp.add("fill-" + box.id, pts);
      }

      items.forEach(function (li, i) {
        var b = li.getAttribute("data-b"), kind = li.getAttribute("data-kind") || "idea";
        var hint = li.querySelector(".fill-hint"), why = li.querySelector(".fill-why");
        var slot = box.querySelector('.blank[data-b="' + b + '"]');
        var fresh = function () { return { v: "", tries: 0, hint: false, shown: false, ok: false }; };
        if (!state[b]) state[b] = fresh();

        var head = el("div", "fill-head");
        head.appendChild(el("span", "fill-n", String(i + 1)));
        head.appendChild(el("code", null, li.getAttribute("data-label") || b));
        head.appendChild(el("span", "chip chip-" + kind, KIND[kind] || kind));
        var row = el("div", "fill-row");
        var input = el("input", "fill-input"); input.type = "text"; input.id = box.id + "-" + b;
        input.autocomplete = "off"; input.spellcheck = false; input.setAttribute("autocapitalize", "off");
        input.placeholder = "your best guess, or ?"; input.setAttribute("aria-label", "Guess for " + (li.getAttribute("data-label") || b));
        var check = el("button", "btn", "Check"); check.type = "button";
        var hintBtn = el("button", "btn ghost", "Hint"); hintBtn.type = "button";
        var showBtn = el("button", "btn ghost", "Show value"); showBtn.type = "button";
        var msg = el("span", "fill-msg"); msg.setAttribute("aria-live", "polite");
        [input, check, hintBtn, showBtn, msg].forEach(function (n) { row.appendChild(n); });
        li.insertBefore(row, li.firstChild); li.insertBefore(head, row);
        if (why && !why.querySelector(".fill-value")) {
          var val = el("p", "fill-value"); val.appendChild(document.createTextNode("Value: "));
          val.appendChild(el("code", null, li.getAttribute("data-show") || "")); why.insertBefore(val, why.firstChild);
        }

        function paint() {
          var s = state[b];
          input.value = s.v;
          var locked = s.ok || s.shown;
          input.readOnly = locked; check.hidden = locked;
          hintBtn.hidden = !(s.tries > 0) || s.hint || locked;
          showBtn.hidden = !(s.tries > 0) || locked;
          if (hint) hint.hidden = !s.hint;
          if (why) why.hidden = !locked;
          li.className = s.ok ? "is-ok" : s.shown ? "is-shown" : "";
          if (s.ok) msg.textContent = (s.tries === 1 && !s.hint) ? "Right on the first guess." : "Right.";
          else if (s.shown) msg.textContent = "Shown. It comes back in a warm-up.";
          if (slot) {
            slot.textContent = s.v || "____";
            slot.setAttribute("data-n", i + 1);
            slot.className = "blank" + (s.v ? "" : " is-empty") + (s.ok ? " is-ok" : s.shown ? " is-shown" : "");
          }
        }
        function test(v) {
          var p = li.getAttribute("data-pattern");
          if (p) return new RegExp(p).test(v);
          return (li.getAttribute("data-accept") || "").split("|").some(function (a) { return norm(a) === v; });
        }
        function sameButCase(v) {
          var p = li.getAttribute("data-pattern");
          if (p) return new RegExp(p, "i").test(v);
          return (li.getAttribute("data-accept") || "").split("|").some(function (a) { return norm(a).toLowerCase() === v.toLowerCase(); });
        }
        input.addEventListener("input", function () { state[b].v = input.value; save(); paint(); msg.textContent = ""; });
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); check.click(); } });
        check.addEventListener("click", function () {
          var s = state[b], v = norm(input.value);
          if (!v) { msg.textContent = "Write a guess first. A ? is fine."; return; }
          s.tries++;
          if (test(v)) { s.ok = true; s.v = v; }
          else if (sameButCase(v)) {
            msg.textContent = "Close. Check upper and lower case - YAML values are case-sensitive.";
          }
          else msg.textContent = v === "?" ? "OK. Use Hint to find it, or Show value." : "Not this one. Try again, or use Hint.";
          save(); paint();
          if (s.ok) finish();
        });
        hintBtn.addEventListener("click", function () { state[b].hint = true; save(); paint(); });
        showBtn.addEventListener("click", function () {
          var s = state[b]; s.shown = true; s.v = li.getAttribute("data-show") || ""; save(); paint(); finish();
        });
        resets.push(function () { state[b] = fresh(); msg.textContent = ""; paint(); });
        paint();
      });
      save(); finish();
    });
  }

  /* Lost here: Alex ticks a box on a lab that makes no sense to him.
     The summary prints one line for the chat, like the quiz result line:
     IaC lost | <page> | <date> | lost: <ids> */
  function lost() {
    var boxes = [].slice.call(document.querySelectorAll("input[type=checkbox][data-lost]"));
    var out = document.querySelector(".lost-summary");
    if (!boxes.length) return;
    var saved = store.get("lost", {});
    function paint() {
      if (!out) return;
      var ids = boxes.map(function (cb) { return cb.getAttribute("data-lost"); }).filter(function (id) { return saved[id]; });
      var tag = document.querySelector("[data-page]"), page = (tag && tag.getAttribute("data-page")) || "page";
      var line = "IaC lost | " + page + " | " + today() + " | lost: " + (ids.length ? ids.join(", ") : "none");
      out.innerHTML = "";
      out.appendChild(el("p", "small", ids.length ?
        "You marked " + ids.length + " part(s) as lost. Paste this line in the chat - those parts get a new explanation before the next lesson." :
        "Nothing marked as lost. If a lab made no sense, tick its \"Lost here\" box. Paste this line in the chat either way."));
      var code = el("code", "q-line", line); out.appendChild(code);
      var copy = el("button", "btn", "Copy lost line"); copy.type = "button";
      copy.addEventListener("click", function () { copyText(copy, line, code); });
      out.appendChild(copy);
    }
    boxes.forEach(function (cb) {
      var id = cb.getAttribute("data-lost");
      cb.checked = !!saved[id];
      cb.addEventListener("change", function () { saved[id] = cb.checked; store.set("lost", saved); paint(); });
    });
    paint();
  }

  window.IAC = { store: store, xp: xp };
  document.addEventListener("DOMContentLoaded", function () { fills(); copyButtons(); runStrips(); checklist(); bets(); lost(); render(); });
})();

