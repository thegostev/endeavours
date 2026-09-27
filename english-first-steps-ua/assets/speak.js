/* speak.js - UK / US listen buttons for any element with data-say.
   Usage:  <span class="en" data-say>water</span>
           <span data-say="Nice to meet you">...</span>   (text to speak in the attribute)
           add data-yg to also show YouGlish links (real people on YouTube, UK and US).
   Uses the browser's built-in speech synthesis (no internet needed for the voice itself). */
(function () {
  var S = window.speechSynthesis;
  var voices = [];
  var rate = 0.85;

  function loadVoices() { try { voices = S ? S.getVoices() : []; } catch (e) { voices = []; } }
  if (S) { loadVoices(); if ('onvoiceschanged' in S) S.onvoiceschanged = loadVoices; }

  var PREFERRED = {
    'en-GB': [/Google UK English/i, /Daniel/i, /Serena/i, /Kate/i, /Arthur/i, /Martha/i, /Libby|Sonia|Ryan/i],
    'en-US': [/Google US English/i, /Samantha/i, /Ava/i, /Allison/i, /Alex$/i, /Aria|Jenny|Guy/i]
  };

  function norm(l) { return (l || '').replace('_', '-').toLowerCase(); }

  function pick(lang) {
    if (!voices.length) loadVoices();
    var L = norm(lang);
    var list = voices.filter(function (v) { return norm(v.lang) === L; });
    var prefs = PREFERRED[lang] || [];
    for (var i = 0; i < prefs.length; i++) {
      for (var j = 0; j < list.length; j++) { if (prefs[i].test(list[j].name)) return list[j]; }
    }
    return list[0] || null;
  }

  function has(lang) { return !!pick(lang); }

  function say(text, lang, btn) {
    if (!S) { alertNoVoice(); return; }
    try { S.cancel(); } catch (e) {}
    var u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    var v = pick(lang);
    if (v) u.voice = v;
    u.rate = rate;
    if (btn) {
      btn.classList.add('playing');
      u.onend = u.onerror = function () { btn.classList.remove('playing'); };
    }
    S.speak(u);
  }

  function alertNoVoice() {
    var w = document.getElementById('no-voice');
    if (w) w.style.display = 'block';
  }

  function makeBtn(label, cls, text, lang) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.title = (lang === 'en-GB' ? 'Британська вимова' : 'Американська вимова') + ': ' + text;
    b.innerHTML = '<span>&#9654; ' + label + '</span>';
    b.addEventListener('click', function () { say(text, lang, b); });
    return b;
  }

  function enhance(root) {
    (root || document).querySelectorAll('[data-say]').forEach(function (el) {
      if (el.dataset.sayDone) return;
      el.dataset.sayDone = '1';
      var text = el.getAttribute('data-say') || el.textContent.trim();
      var wrap = document.createElement('span');
      wrap.className = 'say';
      wrap.appendChild(makeBtn('UK', 'b-uk', text, 'en-GB'));
      wrap.appendChild(makeBtn('US', 'b-us', text, 'en-US'));
      if (el.hasAttribute('data-yg')) {
        var q = encodeURIComponent(text.toLowerCase());
        ['uk', 'us'].forEach(function (acc) {
          var a = document.createElement('a');
          a.href = 'https://youglish.com/pronounce/' + q + '/english/' + acc;
          a.target = '_blank'; a.rel = 'noopener';
          a.textContent = 'відео ' + acc.toUpperCase();
          a.title = 'Живі люди на YouTube вимовляють це слово';
          wrap.appendChild(a);
        });
      }
      el.insertAdjacentElement('afterend', wrap);
    });
  }

  function toolbar() {
    var slot = document.getElementById('toolbar');
    if (!slot) return;
    slot.className = 'toolbar';
    slot.innerHTML =
      '<span>Озвучення:</span>' +
      '<label><input type="radio" name="rate" value="0.65"> повільно</label>' +
      '<label><input type="radio" name="rate" value="0.85" checked> нормально</label>' +
      '<span class="muted">Голос - синтезатор твого браузера. Живу вимову дають кнопки «відео UK / US».</span>' +
      '<div id="no-voice" class="warn" style="display:none">Браузер не має англійських голосів. Відкрий урок у Chrome або Safari, або встанови англійський голос у налаштуваннях системи (Мова та мовлення / Speech).</div>';
    slot.querySelectorAll('input[name=rate]').forEach(function (r) {
      r.addEventListener('change', function () { rate = parseFloat(r.value); });
    });
    setTimeout(function () {
      loadVoices();
      if (!S || (!has('en-GB') && !has('en-US'))) alertNoVoice();
    }, 1200);
  }

  window.Speak = { say: say, has: has, enhance: enhance };
  document.addEventListener('DOMContentLoaded', function () { toolbar(); enhance(); });
})();
