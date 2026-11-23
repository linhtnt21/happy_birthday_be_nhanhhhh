(() => {
  'use strict';
  const cfg = window.BIRTHDAY_CONFIG || {};
  document.documentElement.classList.toggle('theme-original', cfg.theme === 'original');
  if (cfg.theme === 'original') {
    document.querySelectorAll('.intro-rose,.reveal-rose,.letter-rose,.record-rose').forEach(img => { img.src = 'assets/rose-red.svg'; });
  }
  const scenes = [...document.querySelectorAll('.scene')];
  const dots = [...document.querySelectorAll('[data-page]')];
  const back = document.getElementById('backButton');
  const next = document.getElementById('nextButton');
  const counter = document.getElementById('pageCounter');
  const revealCounter = document.getElementById('revealPageCounter');
  const audio = document.getElementById('birthdayAudio');
  const vinyl = document.getElementById('vinyl');
  const playButton = document.getElementById('playButton');
  const playIcon = document.getElementById('playIcon');
  const playText = document.getElementById('playText');
  const soundLabel = document.getElementById('soundLabel');
  const seal = document.getElementById('envelopeOpen');
  const modal = document.getElementById('photoModal');
  let active = 0;
  let transitioning = false;
  let toastTimer;

  const fallbackPhoto = 'assets/photobooth-placeholder.svg';
  const photos = Array.from({ length: 4 }, (_, i) => cfg.photos?.[i]?.trim() || fallbackPhoto);
  const captions = Array.from({ length: 4 }, (_, i) => cfg.photoCaptions?.[i] || ['our little day','so much love','sweet memories','you and me'][i]);

  // Lời chúc, ảnh, nhạc đều lấy từ config.js.
  document.querySelectorAll('[data-text]').forEach(el => {
    const value = cfg[el.dataset.text];
    if (typeof value === 'string') el.textContent = value;
  });
  document.querySelectorAll('[data-photo]').forEach(img => {
    img.src = photos[Number(img.dataset.photo)];
    img.addEventListener('error', () => {
      if (!img.src.endsWith('photobooth-placeholder.svg')) img.src = fallbackPhoto;
    }, { once: true });
  });
  document.querySelectorAll('[data-caption]').forEach(el => {
    const caption = captions[Number(el.dataset.caption)];
    el.textContent = caption;
    // Fit longer captions in the Polaroid's paper border without hiding words in the gallery.
    const n = [...caption].length;
    el.style.setProperty('--caption-size', n > 105 ? '12px' : n > 65 ? '14px' : n > 35 ? '17px' : '24px');
    el.parentElement.title = caption;
    el.parentElement.classList.toggle('has-long-caption', n > 35);
  });
  const letterParagraphs = document.getElementById('letterParagraphs');
  (Array.isArray(cfg.letterParagraphs) ? cfg.letterParagraphs : []).forEach(paragraph => {
    const p = document.createElement('p');
    p.textContent = String(paragraph);
    letterParagraphs.append(p);
  });
  if (cfg.recipient) document.title = `For ${cfg.recipient} ♡`;
  if (cfg.music && typeof cfg.music === 'string') audio.src = cfg.music.trim();

  // Plain text is shown as a handwritten lyric sheet. Optional LRC timestamps
  // [mm:ss.xx] allow a line to be highlighted during audio playback.
  const lyricScroll = document.getElementById('lyricsScroll');
  const rawLyrics = typeof cfg.lyrics === 'string' ? cfg.lyrics.trim() : '';
  const timedLines = [];
  const lyricRows = [];
  if (rawLyrics) {
    lyricScroll.replaceChildren();
    for (const rawLine of rawLyrics.split(/\r?\n/)) {
      const timeTags = [...rawLine.matchAll(/\[(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?\]/g)];
      const words = rawLine.replace(/\[\d{1,2}:\d{2}(?:[.,]\d{1,3})?\]/g, '').trim();
      const line = document.createElement('p');
      line.className = words ? 'lyric-line' : 'lyric-line lyric-line--space';
      line.textContent = words || '\u00a0';
      lyricScroll.append(line);
      lyricRows.push(line);
      if (timeTags.length && words) {
        for (const match of timeTags) {
          const fraction = match[3] ? Number('0.' + match[3]) : 0;
          timedLines.push({ at: Number(match[1]) * 60 + Number(match[2]) + fraction, el: line });
        }
      }
    }
    timedLines.sort((a, b) => a.at - b.at);
    document.getElementById('lyricsPanel').classList.toggle('is-timed', timedLines.length > 0);
  }
  let lastHighlighted = null;
  function syncLyrics() {
    if (!timedLines.length) return;
    let current = null;
    for (const entry of timedLines) {
      if (entry.at <= audio.currentTime + .08) current = entry.el;
      else break;
    }
    if (current === lastHighlighted) return;
    if (lastHighlighted) lastHighlighted.classList.remove('is-current');
    if (current) {
      current.classList.add('is-current');
      // Scroll only the lyrics, without moving the whole page.
      const offset = current.offsetTop - lyricScroll.offsetTop - lyricScroll.clientHeight / 2 + current.offsetHeight / 2;
      lyricScroll.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
    }
    lastHighlighted = current;
  }
  audio.addEventListener('timeupdate', syncLyrics);
  audio.addEventListener('seeked', syncLyrics);

  function toast(message) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3200);
  }

  function goTo(page) {
    if (page < 0 || page >= scenes.length || transitioning || page === active) return;
    const target = Math.floor(page);
    if (active === 0 && target > 0) {
      transitioning = true;
      seal.classList.add('is-opening');
      setTimeout(() => {
        transitioning = false;
        activate(target);
      }, 760);
    } else {
      activate(target);
    }
  }
  function activate(page) {
    active = page;
    scenes.forEach((scene, i) => {
      const current = i === page;
      scene.classList.toggle('is-active', current);
      scene.setAttribute('aria-hidden', String(!current));
      scene.inert = !current;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === page);
      if (i === page) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    back.disabled = page === 0;
    next.disabled = page === scenes.length - 1;
    // Always derive numbering from the same active scene and total scene count.
    const formatPage = number => String(number).padStart(2, '0');
    const total = formatPage(scenes.length);
    counter.textContent = `${formatPage(page + 1)} / ${total}`;
    if (revealCounter) {
      const revealScene = revealCounter.closest('[data-scene]');
      revealCounter.textContent = `${formatPage(Number(revealScene.dataset.scene) + 1)} / ${total}`;
    }
    if (page !== 0) seal.classList.remove('is-opening');
  }
  activate(0);
  back.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(Number(dot.dataset.page))));

  function clickOrEnter(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); fn();
      }
    });
  }
  clickOrEnter(seal, () => goTo(1));
  document.getElementById('letterOpen').addEventListener('click', () => goTo(2));
  clickOrEnter(document.getElementById('stripOpen'), () => goTo(3));
  document.addEventListener('keydown', event => {
    if (modal.open || event.target.closest('button, input, textarea')) return;
    if (event.key === 'ArrowRight') goTo(active + 1);
    if (event.key === 'ArrowLeft') goTo(active - 1);
  });

  // Gallery: tap a photo to enlarge.
  document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
    const i = Number(button.dataset.zoom);
    document.getElementById('zoomedPhoto').src = photos[i];
    document.getElementById('zoomedCaption').textContent = captions[i];
    if (!modal.open) modal.showModal();
  }));
  document.getElementById('closePhoto').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

  // Chrome/iOS only permit playback AFTER someone taps the play button.
  function updatePlaying(playing) {
    vinyl.classList.toggle('is-playing', playing);
    playButton.setAttribute('aria-pressed', String(playing));
    playIcon.textContent = playing ? 'Ⅱ' : '▶';
    playText.textContent = playing ? 'pause our song' : 'play our song';
    soundLabel.textContent = playing ? 'music on' : 'music off';
  }
  async function toggleMusic() {
    if (!audio.src || !cfg.music?.trim()) {
      vinyl.classList.toggle('is-playing');
      toast('Thêm nhạc vào assets/ rồi điền đường dẫn trong config.js nhé ♫');
      return;
    }
    if (!audio.paused) {
      audio.pause(); updatePlaying(false); return;
    }
    try {
      await audio.play();
      updatePlaying(true);
    } catch (error) {
      updatePlaying(false);
      toast('Không mở được bài nhạc. Hãy kiểm tra tên và đường dẫn file trong config.js.');
      console.warn('[birthday] Music playback failed:', error);
    }
  }
  playButton.addEventListener('click', toggleMusic);
  document.getElementById('soundToggle').addEventListener('click', toggleMusic);
  audio.addEventListener('ended', () => { updatePlaying(false); if (lastHighlighted) lastHighlighted.classList.remove('is-current'); lastHighlighted = null; });
  audio.addEventListener('error', () => { updatePlaying(false); if (cfg.music) toast('Không tìm thấy file nhạc. Kiểm tra assets/ và config.js.'); });

  // A small shower of paper stars after a wish.
  document.getElementById('clover').addEventListener('click', () => {
    const holder = document.getElementById('sparkles');
    const colours = ['#f8f5ec','#bfdae0','#8eb2c6','#d5e3d9','#b6c9da'];
    const symbols = ['✧', '✦', '♡', '✳', '·'];
    for (let i = 0; i < 48; i++) {
      const el = document.createElement('span');
      el.className = 'spark';
      el.textContent = symbols[i % symbols.length];
      el.style.setProperty('--x', `${Math.random() * 100}%`);
      el.style.setProperty('--dx', `${Math.random() * 170 - 85}px`);
      el.style.setProperty('--duration', `${2.5 + Math.random() * 2.2}s`);
      el.style.setProperty('--size', `${12 + Math.random() * 16}px`);
      el.style.setProperty('--color', colours[i % colours.length]);
      el.addEventListener('animationend', () => el.remove(), {once: true});
      holder.append(el);
    }
    document.getElementById('wishRevealed').classList.add('is-visible');
  });
})();
