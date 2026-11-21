/* IaC course - sorter widget (retrieval practice: put each event in its bucket).
   Markup: <div class="sort" id="sort-NNNN"></div> plus a JSON script tag with data-sort-for="<that id>":
     {"buckets":["Build","Deploy","Release","Infrastructure change"],
      "items":[{"id":"s1","text":"...","answer":0,"why":"..."}], "xp":5}
   Items are shuffled on each load. The first pick counts. At the end: a board with every item in its
   right bucket, and one result line with a Copy button that Alex pastes in chat:
   IaC sort | <page> <id> | <date> | <right>/<total> (<pct>%) | missed: <ids> | attempt <n>
   (No closing script tag in this comment: it would end an inline script when the page is built.) */
(function () {
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  function build(box, data) {
    var items = shuffle(data.items.slice()), n = 0, right = 0, missed = [];
    box.innerHTML = "";
    var count = document.createElement("p"); count.className = "sort-count";
    var item = document.createElement("p"); item.className = "sort-item"; item.setAttribute("aria-live", "polite");
    var btns = document.createElement("div"); btns.className = "sort-btns"; btns.setAttribute("role", "group");
    var why = document.createElement("div"); why.className = "sort-why"; why.hidden = true;
    var next = document.createElement("button"); next.type = "button"; next.className = "sort-next"; next.hidden = true; next.textContent = "Next event";
    box.append(count, item, btns, why, next);

    function show() {
      var it = items[n];
      count.textContent = "Event " + (n + 1) + " of " + items.length;
      item.textContent = it.text;
      why.hidden = true; next.hidden = true; btns.innerHTML = "";
      data.buckets.forEach(function (b, i) {
        var x = document.createElement("button"); x.type = "button"; x.className = "sort-btn"; x.textContent = b;
        x.addEventListener("click", function () {
          btns.querySelectorAll("button").forEach(function (y) { y.disabled = true; });
          var ok = i === it.answer;
          x.classList.add(ok ? "right" : "wrong");
          if (!ok) btns.children[it.answer].classList.add("right");
          if (ok) { right++; if (window.IAC) IAC.xp.add("sort-" + box.id + "-" + it.id, data.xp || 5); } else missed.push(it.id);
          why.innerHTML = "<strong>" + (ok ? "Right." : "Not this one.") + "</strong> " + it.why;
          why.hidden = false;
          next.textContent = n + 1 < items.length ? "Next event" : "See the board";
          next.hidden = false; next.focus();
        });
        btns.appendChild(x);
      });
    }

    next.addEventListener("click", function () { n++; if (n < items.length) show(); else finish(); });

    function finish() {
      box.innerHTML = "";
      var board = document.createElement("div"); board.className = "sort-board";
      data.buckets.forEach(function (b, i) {
        var col = document.createElement("div"); col.className = "sort-col";
        col.innerHTML = "<h4>" + b + "</h4>";
        var ul = document.createElement("ul");
        data.items.forEach(function (it) { if (it.answer === i) { var li = document.createElement("li"); li.textContent = it.text; ul.appendChild(li); } });
        col.appendChild(ul); board.appendChild(col);
      });
      var attempt = (window.IAC ? IAC.store.get("attempts-" + box.id, 0) : 0) + 1;
      if (window.IAC) IAC.store.set("attempts-" + box.id, attempt);
      var page = document.documentElement.getAttribute("data-page") || "page";
      var line = "IaC sort | " + page + " " + box.id + " | " + today() + " | " + right + "/" + items.length +
        " (" + Math.round(right / items.length * 100) + "%) | missed: " + (missed.length ? missed.join(", ") : "none") + " | attempt " + attempt;
      var res = document.createElement("div"); res.className = "q-result";
      var code = document.createElement("code"); code.textContent = line;
      var copy = document.createElement("button"); copy.type = "button"; copy.className = "copy"; copy.textContent = "Copy";
      copy.addEventListener("click", function () { if (navigator.clipboard) navigator.clipboard.writeText(line).then(function () { copy.textContent = "Copied"; }); });
      var again = document.createElement("button"); again.type = "button"; again.className = "sort-next"; again.textContent = "Try again (new order)";
      again.addEventListener("click", function () { build(box, data); });
      res.append(code, copy);
      var p = document.createElement("p"); p.innerHTML = "<strong>" + right + " of " + items.length + " right.</strong> Each event in its right bucket:";
      box.append(p, board, res, again);
    }
    show();
  }

  document.querySelectorAll(".sort").forEach(function (box) {
    var src = document.querySelector('script[data-sort-for="' + box.id + '"]');
    if (src) build(box, JSON.parse(src.textContent));
  });
})();
