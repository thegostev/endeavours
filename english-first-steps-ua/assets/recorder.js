/* recorder.js - record your own voice and compare with the UK / US model.
   Markup:  <div class="recorder" data-say="I think three things.">optional text shown to read</div>
   The recording stays in the browser. Nothing is uploaded. */
(function () {
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function build(box) {
    var text = box.getAttribute('data-say') || box.textContent.trim();
    box.innerHTML = '';
    box.appendChild(el('div', 'script', '&laquo;' + text + '&raquo;'));
    var row = el('div', 'row');
    var uk = el('button', null, '&#9654; Еталон UK');
    var us = el('button', null, '&#9654; Еталон US');
    var rec = el('button', 'rec', '&#9679; Запис');
    var play = el('button', null, '&#9654; Мій запис');
    play.disabled = true;
    [uk, us, rec, play].forEach(function (b) { b.type = 'button'; row.appendChild(b); });
    var note = el('div', 'muted', '');
    box.appendChild(row); box.appendChild(note);

    uk.addEventListener('click', function () { window.Speak && Speak.say(text, 'en-GB', uk); });
    us.addEventListener('click', function () { window.Speak && Speak.say(text, 'en-US', us); });

    var mr = null, chunks = [], url = null, audio = null;
    rec.addEventListener('click', function () {
      if (mr && mr.state === 'recording') { mr.stop(); return; }
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        note.textContent = 'Цей браузер не записує звук. Запиши себе диктофоном на телефоні і порівняй.';
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        chunks = [];
        mr = new MediaRecorder(stream);
        mr.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
        mr.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          if (url) URL.revokeObjectURL(url);
          url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || 'audio/webm' }));
          audio = new Audio(url);
          play.disabled = false;
          rec.classList.remove('on'); rec.innerHTML = '&#9679; Запис';
          note.textContent = 'Послухай себе, потім еталон. Що звучить інакше?';
        };
        mr.start();
        rec.classList.add('on'); rec.innerHTML = '&#9632; Стоп';
        note.textContent = 'Говори... Натисни «Стоп», коли закінчиш.';
      }).catch(function () {
        note.textContent = 'Немає доступу до мікрофона. Дозволь мікрофон у браузері або запиши себе на телефон.';
      });
    });
    play.addEventListener('click', function () { if (audio) { audio.currentTime = 0; audio.play(); } });
  }

  document.addEventListener('DOMContentLoaded', function () { document.querySelectorAll('.recorder').forEach(build); });
})();
