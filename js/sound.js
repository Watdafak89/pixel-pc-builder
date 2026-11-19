/* =========================================================
   PIXEL SOUND ENGINE — 8-BIT WEB AUDIO SYNTHESIZER
   ========================================================= */
window.PixelSound = (function () {
  let ctx = null;
  let sfxEnabled = true;
  let bgmEnabled = false;
  let bgmTimer = null;
  let bgmStep = 0;

  function ensureCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function tone(freq, duration, type = 'square', vol = 0.08, delay = 0, slideTo = null) {
    if (!sfxEnabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    const now = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    }
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  // Cozy 8-bit workshop chiptune melody loop
  const melody = [
    523.25, 0, 659.25, 587.33, 523.25, 0, 392.00, 440.00,
    523.25, 0, 659.25, 783.99, 659.25, 0, 587.33, 0,
    440.00, 0, 523.25, 587.33, 659.25, 0, 523.25, 392.00,
    440.00, 493.88, 523.25, 0, 392.00, 0, 0, 0
  ];
  const bass = [
    261.63, 261.63, 196.00, 196.00, 220.00, 220.00, 196.00, 196.00,
    174.61, 174.61, 261.63, 261.63, 196.00, 196.00, 196.00, 196.00
  ];

  function tickBgm() {
    if (!bgmEnabled) return;
    const ac = ensureCtx();
    if (!ac) return;
    const note = melody[bgmStep % melody.length];
    const bNote = bass[Math.floor(bgmStep / 2) % bass.length];
    const now = ac.currentTime;

    if (note > 0) {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(note, now);
      g.gain.setValueAtTime(0.022, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      o.connect(g);
      g.connect(ac.destination);
      o.start(now);
      o.stop(now + 0.17);
    }
    if (bgmStep % 2 === 0 && bNote > 0) {
      const o2 = ac.createOscillator();
      const g2 = ac.createGain();
      o2.type = 'triangle';
      o2.frequency.setValueAtTime(bNote / 2, now);
      g2.gain.setValueAtTime(0.032, now);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      o2.connect(g2);
      g2.connect(ac.destination);
      o2.start(now);
      o2.stop(now + 0.25);
    }
    bgmStep++;
  }

  function setBgm(enabled) {
    bgmEnabled = enabled;
    if (bgmTimer) {
      clearInterval(bgmTimer);
      bgmTimer = null;
    }
    if (bgmEnabled) {
      ensureCtx();
      bgmTimer = setInterval(tickBgm, 210);
    }
  }

  return {
    isSfxOn: () => sfxEnabled,
    isBgmOn: () => bgmEnabled,
    toggleSfx() {
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) this.click();
      return sfxEnabled;
    },
    toggleBgm() {
      setBgm(!bgmEnabled);
      return bgmEnabled;
    },
    click() {
      tone(660, 0.045, 'square', 0.055, 0, 880);
    },
    select() {
      tone(440, 0.05, 'square', 0.055, 0, 587);
    },
    install() {
      tone(330, 0.06, 'square', 0.08, 0);
      tone(523.25, 0.07, 'square', 0.08, 0.055);
      tone(783.99, 0.11, 'square', 0.08, 0.115);
    },
    paste() {
      tone(220, 0.09, 'triangle', 0.09, 0, 140);
    },
    cable() {
      tone(260, 0.05, 'sawtooth', 0.05, 0, 520);
      tone(620, 0.07, 'square', 0.06, 0.05);
    },
    switchClick() {
      tone(190, 0.04, 'square', 0.08, 0, 420);
    },
    error() {
      tone(190, 0.12, 'sawtooth', 0.09, 0, 130);
      tone(140, 0.18, 'sawtooth', 0.09, 0.11, 95);
    },
    hint() {
      tone(587.33, 0.07, 'triangle', 0.08, 0);
      tone(880, 0.11, 'triangle', 0.08, 0.07);
    },
    postBeep(pattern = 'ok') {
      if (pattern === 'ok') {
        tone(950, 0.14, 'square', 0.08, 0.08);
      } else if (pattern === 'ram') {
        // 3 short beeps = RAM fault
        tone(950, 0.11, 'square', 0.09, 0.05);
        tone(950, 0.11, 'square', 0.09, 0.24);
        tone(950, 0.11, 'square', 0.09, 0.43);
      } else if (pattern === 'gpu') {
        // 1 long, 2 short = GPU fault
        tone(850, 0.32, 'square', 0.09, 0.05);
        tone(850, 0.11, 'square', 0.09, 0.46);
        tone(850, 0.11, 'square', 0.09, 0.65);
      } else if (pattern === 'overheat') {
        // Rapid alarm beeps
        for (let i = 0; i < 4; i++) {
          tone(i % 2 === 0 ? 1100 : 750, 0.12, 'sawtooth', 0.08, i * 0.15);
        }
      }
    },
    bootSuccess() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => tone(n, 0.15, 'square', 0.075, i * 0.09));
    },
    quizCorrect() {
      tone(587.33, 0.07, 'square', 0.07, 0);
      tone(880, 0.14, 'square', 0.07, 0.07);
    },
    quizWrong() {
      tone(220, 0.12, 'sawtooth', 0.08, 0);
      tone(165, 0.2, 'sawtooth', 0.08, 0.11);
    },
    fanSpin() {
      tone(110, 0.3, 'triangle', 0.05, 0, 290);
    }
  };
})();
