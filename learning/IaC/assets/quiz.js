/* IaC course - quiz widget.
   Markup: a div with class "quiz" and an id, plus a JSON script tag with data-quiz-for="<that id>"
           holding [{id, stem, options[], answer, why, xp}]. (No closing script tag in this comment:
           it would end the inline script when the page is built.)
   Options are shuffled on each load so position never gives the answer away.
   One click per question: the first answer counts (that is the retrieval practice).
   At the end it shows one result line with a Copy button. Alex pastes that line in chat,
   and it becomes evidence for a learning record. Format:
   IaC result | <page> <quiz> | <date> | <right>/<total> (<pct>%) | missed: <ids> | attempt <n> */
(function () {
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function build(box, data) {
    box.innerHTML = "";
    var answered = 0, right = 0, missed = [];
    var score = document.createElement("div"); score.className = "q-score"; score.hidden = true;

    data.forEach(function (q) {
      var wrap = document.createElement("div"); wrap.className = "q";
      var stem = document.createElement("div"); stem.className = "q-stem"; stem.innerHTML = q.stem;
      var opts = document.createElement("div"); opts.className = "q-opts"; opts.setAttribute("role", "group");
      var why = document.createElement("div"); why.className = "q-why"; why.hidden = true; why.setAttribute("aria-live", "polite");
      var order = shuffle(q.options.map(function (_, i) { return i; }));

      order.forEach(function (i) {
        var b = document.createElement("button"); b.type = "button"; b.className = "q-opt"; b.textContent = q.options[i];
        b.addEventListener("click", function () {
          opts.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
          var ok = i === q.answer;
          b.classList.add(ok ? "right" : "wrong");
          if (!ok) opts.children[order.indexOf(q.answer)].classList.add("right");
          why.innerHTML = "<strong>" + (ok ? "Right." : "Not this one.") + "</strong> " + q.why;
          why.hidden = false;
          answered++; if (!ok) missed.push(q.id); if (ok) { right++; if (window.IAC) IAC.xp.add("quiz-" + q.id, q.xp || 10); }
          if (answered === data.length) finish();
        });
        opts.appendChild(b);
      });
      wrap.appendChild(stem); wrap.appendChild(opts); wrap.appendChild(why); box.appendChild(wrap);
    });

    function finish() {
      var best = window.IAC ? IAC.store.get("best-" + box.id, 0) : 0;
      if (right > best && window.IAC) IAC.store.set("best-" + box.id, right);
      var attempt = (window.IAC ? IAC.store.get("attempts-" + box.id, 0) : 0) + 1;
      if (window.IAC) IAC.store.set("attempts-" + box.id, attempt);
      var pct = Math.round((right / data.length) * 100);
      score.innerHTML = "You got " + right + " of " + data.length + " (" + pct + "%). " +
        (pct >= 80 ? "That is above your 80% target. " : "Your target is 80%. Read the notes for the ones you missed, then try again tomorrow, not now. ") +
        "Best so far: " + Math.max(best, right) + ". ";

      var d = new Date(), pad = function (n) { return (n < 10 ? "0" : "") + n; };
      var tag = document.querySelector("[data-page]"), page = (tag && tag.getAttribute("data-page")) || "page";
      var line = "IaC result | " + page + " " + box.id + " | " +
        d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " | " +
        right + "/" + data.length + " (" + pct + "%) | missed: " + (missed.length ? missed.join(", ") : "none") +
        " | attempt " + attempt;
      var row = document.createElement("div"); row.className = "q-result";
      var lab = document.createElement("p"); lab.className = "small"; lab.textContent = "Paste this line in the chat. It goes into your learning record.";
      var code = document.createElement("code"); code.className = "q-line"; code.textContent = line;
      var copy = document.createElement("button"); copy.type = "button"; copy.className = "btn"; copy.textContent = "Copy result line";
      copy.addEventListener("click", function () {
        var fallback = function () {
          var r = document.createRange(); r.selectNodeContents(code);
          var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
          copy.textContent = "Selected - press Cmd+C";
        };
        try {
          if (navigator.clipboard) navigator.clipboard.writeText(line).then(function () { copy.textContent = "Copied"; }, fallback);
          else fallback();
        } catch (e) { fallback(); }
      });
      row.appendChild(lab); row.appendChild(code); row.appendChild(copy);
      score.appendChild(row);

      var again = document.createElement("button"); again.type = "button"; again.className = "btn ghost"; again.textContent = "Shuffle and try again";
      again.addEventListener("click", function () { build(box, data); box.scrollIntoView({ behavior: "smooth", block: "start" }); });
      score.appendChild(again); score.hidden = false;
    }
    box.appendChild(score);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("script[data-quiz-for]").forEach(function (s) {
      var box = document.getElementById(s.getAttribute("data-quiz-for"));
      if (box) build(box, JSON.parse(s.textContent));
    });
  });
})();

