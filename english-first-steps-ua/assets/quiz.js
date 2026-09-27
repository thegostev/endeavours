/* quiz.js - quizzes with instant feedback.
   Markup:
     <div class="quiz" data-lesson="0001">   (data-lesson is optional: saves the result for the review plan)
       <script type="application/json">[ ...questions... ]</script>
     </div>
   Question types:
     {"type":"choice", "q":"...", "options":["a","b"], "answer":0, "why":"..."}
     {"type":"listen", "say":"think", "lang":"any|en-GB|en-US", "q":"...", "options":["think","sink"], "answer":0, "why":"..."}
     {"type":"accent", "say":"water", "q":"...", "why":"..."}        -> random UK or US voice, learner guesses which
     {"type":"type",   "q":"...", "say":"P. A. R. I. S.", "answer":["paris"], "why":"..."}   ("say" optional)
   Needs speak.js for audio. */
(function () {
  var STORE = 'englishFromZero.v1';

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function norm(s) {
    return (s || '').toLowerCase().replace(/[‘’ʼ`]/g, "'").replace(/[.!?,;:]+$/g, '').replace(/\s+/g, ' ').trim();
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

  function save(lesson, pct) {
    if (!lesson) return;
    try {
      var data = JSON.parse(localStorage.getItem(STORE) || '{}');
      data.lessons = data.lessons || {};
      var r = data.lessons[lesson] || { first: today(), runs: 0, best: 0 };
      r.last = today(); r.runs += 1; r.best = Math.max(r.best, pct);
      data.lessons[lesson] = r;
      localStorage.setItem(STORE, JSON.stringify(data));
    } catch (e) { /* storage not available: the quiz still works */ }
  }

  function pickLang(lang) {
    if (lang === 'en-GB' || lang === 'en-US') return lang;
    var both = ['en-GB', 'en-US'];
    if (window.Speak) {
      var avail = both.filter(function (l) { return Speak.has(l); });
      if (avail.length) both = avail;
    }
    return both[Math.floor(Math.random() * both.length)];
  }

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function build(box) {
    var src = box.querySelector('script[type="application/json"]');
    if (!src) return;
    var questions;
    try { questions = JSON.parse(src.textContent); } catch (e) { box.appendChild(el('p', 'warn', 'Помилка в даних тесту.')); return; }
    var lesson = box.getAttribute('data-lesson');
    render(box, questions, lesson, src);
  }

  function render(box, questions, lesson, src) {
    Array.from(box.children).forEach(function (c) { if (c !== src) c.remove(); });
    var total = questions.length, answered = 0, right = 0, wrongList = [];
    var score = el('div', 'score');

    function update() {
      score.textContent = 'Відповіді: ' + answered + ' з ' + total + ' · правильно: ' + right;
      if (answered === total) {
        var pct = Math.round(100 * right / total);
        score.textContent += ' · ' + pct + '%' + (pct === 100 ? ' - чудово!' : pct >= 70 ? ' - добре, повтори помилки.' : ' - повтори урок ще раз завтра.');
        save(lesson, pct);
        again.style.display = 'inline-block';
        if (wrongList.length) redo.style.display = 'inline-block';
      }
    }

    function done(q, ok, card, fbText) {
      answered += 1; if (ok) right += 1; else wrongList.push(q);
      var fb = card.querySelector('.fb');
      fb.className = 'fb show ' + (ok ? 'ok' : 'no');
      fb.innerHTML = (ok ? 'Так! ' : 'Ні. ') + (fbText || '') + (q.why ? ' ' + q.why : '');
      update();
    }

    questions.forEach(function (q, i) {
      var card = el('div', 'q');
      var lang = null;
      card.appendChild(el('p', 'qtext', '<b>' + (i + 1) + '.</b> ' + q.q));

      if (q.type === 'listen' || q.type === 'accent' || (q.type === 'type' && q.say)) {
        lang = q.type === 'type' ? pickLang(q.lang || 'any') : pickLang(q.lang || 'any');
        var play = el('button', 'play', '&#9654; Слухати');
        play.type = 'button';
        play.addEventListener('click', function () { if (window.Speak) Speak.say(q.say, lang, play); });
        card.appendChild(play);
      }

      if (q.type === 'type') {
        var row = el('div', 'opts');
        var inp = el('input'); inp.type = 'text'; inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('autocapitalize', 'off');
        var chk = el('button', 'check', 'Перевірити'); chk.type = 'button';
        function check() {
          if (card.dataset.done) return; card.dataset.done = '1';
          var ok = q.answer.some(function (a) { return norm(a) === norm(inp.value); });
          inp.disabled = true; chk.disabled = true;
          done(q, ok, card, ok ? '' : 'Правильно: <b>' + q.answer[0] + '</b>.');
        }
        chk.addEventListener('click', check);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
        row.appendChild(inp); row.appendChild(chk); card.appendChild(row);
      } else {
        var opts, correctText;
        if (q.type === 'accent') { opts = ['UK', 'US']; correctText = lang === 'en-GB' ? 'UK' : 'US'; }
        else { opts = shuffle(q.options); correctText = q.options[q.answer]; }
        var row2 = el('div', 'opts');
        opts.forEach(function (o) {
          var b = el('button', null, o); b.type = 'button';
          b.addEventListener('click', function () {
            if (card.dataset.done) return; card.dataset.done = '1';
            var ok = o === correctText;
            row2.querySelectorAll('button').forEach(function (x) {
              x.disabled = true;
              if (x.textContent === correctText) x.classList.add('right');
            });
            if (!ok) b.classList.add('wrong');
            var extra = q.type === 'accent' ? 'Це був голос ' + correctText + '.' : (ok ? '' : 'Правильно: <b>' + correctText + '</b>.');
            done(q, ok, card, extra);
          });
          row2.appendChild(b);
        });
        card.appendChild(row2);
      }
      card.appendChild(el('div', 'fb'));
      box.appendChild(card);
    });

    var again = el('button', 'again', 'Пройти ще раз'); again.type = 'button'; again.style.display = 'none';
    again.addEventListener('click', function () { render(box, shuffle(questions), lesson, src); });
    var redo = el('button', 'again', 'Тільки помилки'); redo.type = 'button'; redo.style.display = 'none';
    redo.addEventListener('click', function () { render(box, wrongList.slice(), null, src); });
    box.appendChild(score); box.appendChild(again); box.appendChild(document.createTextNode(' ')); box.appendChild(redo);
    update();
  }

  window.Quiz = { STORE: STORE };
  document.addEventListener('DOMContentLoaded', function () { document.querySelectorAll('.quiz').forEach(build); });
})();
