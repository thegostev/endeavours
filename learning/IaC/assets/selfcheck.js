/* IaC course - self-check widget: a short yes/no test with a verdict line.
   Markup: <div class="selfcheck" data-pass="text when all yes" data-fail="text before the list of no's">
             <label><input type="checkbox" data-q="short name"> <span>question</span></label> ...
             <p class="verdict" aria-live="polite"></p>
           </div>
   Answers are kept per page (IAC.store), so the verdict is still there next visit. */
(function () {
  document.querySelectorAll(".selfcheck").forEach(function (box, n) {
    var boxes = box.querySelectorAll("input[type=checkbox]");
    var out = box.querySelector(".verdict");
    var key = "selfcheck-" + (box.id || n);
    var saved = window.IAC ? IAC.store.get(key, {}) : {};
    boxes.forEach(function (b, i) { if (saved[i]) b.checked = true; });
    function render() {
      var miss = [], state = {};
      boxes.forEach(function (b, i) { state[i] = b.checked; if (!b.checked) miss.push(b.getAttribute("data-q")); });
      if (window.IAC) IAC.store.set(key, state);
      out.textContent = miss.length ? box.getAttribute("data-fail") + " " + miss.join(", ") + "." : box.getAttribute("data-pass");
    }
    boxes.forEach(function (b) { b.addEventListener("change", render); });
    render();
  });
})();
