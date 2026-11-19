/* =========================================================
   APP CONTROLLER — NAVIGATION, SAVE PROGRESS & HERO LOOP
   ========================================================= */
window.App = (function () {
  const SAVE_KEY = 'pixel_pc_builder_academy_v1';

  const DEFAULT_PROGRESS = {
    tutorialDone: false,
    bestTimeSec: null,
    bestScore: 0,
    missionsCleared: [],
    repairsCleared: [],
    quizBest: 0,
    badges: [],
    difficulty: 'normal',
    student: { name: '', stdId: '', room: '' }
  };

  let progress = loadProgress();
  let heroTick = 0;

  function loadProgress() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Object.assign({}, DEFAULT_PROGRESS, parsed, {
          student: Object.assign({}, DEFAULT_PROGRESS.student, parsed.student || {})
        });
      }
    } catch (e) {}
    return Object.assign({}, DEFAULT_PROGRESS, {
      student: Object.assign({}, DEFAULT_PROGRESS.student)
    });
  }

  function persist() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
    } catch (e) {}
    renderHomeStats();
    if (window.Modes) Modes.refreshAll();
  }

  function getProgress() {
    return progress;
  }

  function getDifficulty() {
    return progress.difficulty || 'normal';
  }

  function setDifficulty(d) {
    if (!PCData.DIFFICULTIES[d]) return;
    progress.difficulty = d;
    persist();
    toast(`🎯 ปรับระดับความยากเป็น: ${PCData.DIFFICULTIES[d].name}`, 'gold');
  }

  function saveProgress(key, value) {
    progress[key] = value;
    persist();
  }

  function recordBestTime(sec) {
    if (progress.bestTimeSec === null || sec < progress.bestTimeSec) {
      progress.bestTimeSec = sec;
    }
    persist();
  }

  function recordBestScore(sc) {
    if (sc > (progress.bestScore || 0)) {
      progress.bestScore = sc;
    }
    persist();
  }

  function markMissionCleared(id) {
    if (!progress.missionsCleared.includes(id)) {
      progress.missionsCleared.push(id);
    }
    unlockBadge('mission_1');
    if (progress.missionsCleared.length >= PCData.MISSIONS.length) {
      unlockBadge('mission_all');
    }
    persist();
  }

  function markRepairCleared(id) {
    if (!progress.repairsCleared.includes(id)) {
      progress.repairsCleared.push(id);
    }
    unlockBadge('repair_1');
    if (progress.repairsCleared.length >= PCData.TROUBLESHOOT_CASES.length) {
      unlockBadge('repair_all');
    }
    persist();
  }

  function recordQuizScore(score) {
    if (score > progress.quizBest) progress.quizBest = score;
    if (score >= 15) unlockBadge('quiz_pass');
    if (score >= PCData.QUIZ.length) unlockBadge('quiz_perfect');
    persist();
  }

  function unlockBadge(id) {
    if (!progress.badges.includes(id)) {
      progress.badges.push(id);
      const b = PCData.ACHIEVEMENTS.find((a) => a.id === id);
      if (b) toast(`🏆 ปลดล็อกเหรียญตรา: ${b.icon} ${b.title}!`, 'gold');
      persist();
    }
  }

  function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.25s';
      setTimeout(() => el.remove(), 260);
    }, 3200);
  }

  function setActiveNav(viewKey) {
    document.querySelectorAll('.nav-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.view === viewKey);
    });
  }

  function showView(viewId) {
    document.querySelectorAll('.view').forEach((v) => {
      v.classList.toggle('active', v.id === viewId);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function navigate(dest) {
    Workbench.stopTimer();
    if (dest === 'home') {
      setActiveNav('home');
      showView('view-home');
      renderHomeStats();
    } else if (dest === 'tutorial') {
      setActiveNav('tutorial');
      showView('view-workbench');
      Workbench.start('tutorial');
    } else if (dest === 'challenge') {
      setActiveNav('challenge');
      showView('view-workbench');
      Workbench.start('challenge');
    } else if (dest === 'missions') {
      setActiveNav('missions');
      showView('view-missions');
      Modes.refreshAll();
    } else if (dest === 'troubleshoot') {
      setActiveNav('troubleshoot');
      showView('view-troubleshoot');
      Modes.refreshAll();
    } else if (dest === 'learn') {
      setActiveNav('learn');
      showView('view-learn');
    }
  }

  function openWorkbench(wbMode, payload) {
    if (wbMode === 'mission') setActiveNav('missions');
    else if (wbMode === 'troubleshoot') setActiveNav('troubleshoot');
    showView('view-workbench');
    Workbench.start(wbMode, payload);
  }

  function formatTime(s) {
    if (s === null || s === undefined) return '--:--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function computeMastery() {
    let mastery = 0;
    if (progress.tutorialDone) mastery += 20;
    if (progress.bestTimeSec !== null) mastery += 20;
    mastery += Math.round((progress.missionsCleared.length / PCData.MISSIONS.length) * 20);
    mastery += Math.round((progress.repairsCleared.length / PCData.TROUBLESHOOT_CASES.length) * 20);
    mastery += Math.round((progress.quizBest / PCData.QUIZ.length) * 20);
    return Math.min(100, mastery);
  }

  function computeReportData() {
    const mastery = computeMastery();
    const overallGrade = mastery >= 90 ? 'S' : mastery >= 75 ? 'A' : mastery >= 55 ? 'B' : mastery >= 35 ? 'C' : 'D';
    const std = progress.student || { name: '', stdId: '', room: '' };
    const diffObj = PCData.DIFFICULTIES[getDifficulty()] || PCData.DIFFICULTIES.normal;

    const rawSeed = `${std.name}|${std.stdId}|${mastery}|${progress.quizBest}|${progress.missionsCleared.length}|${progress.repairsCleared.length}|${progress.bestTimeSec || 0}`;
    let hash = 2166136261;
    for (let i = 0; i < rawSeed.length; i++) {
      hash ^= rawSeed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const verifyCode = 'PX-' + (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

    return {
      studentName: std.name,
      studentId: std.stdId,
      studentRoom: std.room,
      difficultyLabel: diffObj.badge,
      difficultyName: diffObj.name,
      mastery,
      overallGrade,
      tutorialText: progress.tutorialDone ? 'ผ่านครบ 12 ขั้นตอน ✓' : 'ยังไม่ครบ',
      tutorialShort: progress.tutorialDone ? 'ผ่าน ✓' : 'ยังไม่จบ',
      challengeText: progress.bestTimeSec !== null
        ? `สถิติ ${formatTime(progress.bestTimeSec)} (คะแนนสูงสุด ${progress.bestScore || 100}/100)`
        : 'ยังไม่มีสถิติ',
      bestTimeText: formatTime(progress.bestTimeSec),
      missionsText: `${progress.missionsCleared.length} / ${PCData.MISSIONS.length} ภารกิจ`,
      missionsShort: `${progress.missionsCleared.length}/${PCData.MISSIONS.length}`,
      repairsText: `${progress.repairsCleared.length} / ${PCData.TROUBLESHOOT_CASES.length} เคส`,
      repairsShort: `${progress.repairsCleared.length}/${PCData.TROUBLESHOOT_CASES.length}`,
      quizShort: `${progress.quizBest}/${PCData.QUIZ.length}`,
      badgesText: `${progress.badges.length} / ${PCData.ACHIEVEMENTS.length} เหรียญ`,
      verifyCode,
      dateStr
    };
  }

  function renderReportModalContent() {
    const data = computeReportData();
    const summaryBox = document.getElementById('report-summary-box');
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div class="report-metric"><small>ความก้าวหน้ารวม</small><strong>${data.mastery}% (${data.overallGrade})</strong></div>
        <div class="report-metric"><small>โหมดฝึกสอน</small><strong>${data.tutorialShort}</strong></div>
        <div class="report-metric"><small>จับเวลาดีที่สุด</small><strong>${data.bestTimeText}</strong></div>
        <div class="report-metric"><small>ภารกิจ / ซ่อม</small><strong>${data.missionsShort} • ${data.repairsShort}</strong></div>
        <div class="report-metric"><small>แบบทดสอบ</small><strong>${data.quizShort}</strong></div>
      `;
    }
    PixelArt.drawCertificate(document.getElementById('cert-canvas'), data);
  }

  function openReportModal() {
    const std = progress.student || { name: '', stdId: '', room: '' };
    document.getElementById('inp-std-name').value = std.name || '';
    document.getElementById('inp-std-id').value = std.stdId || '';
    document.getElementById('inp-std-room').value = std.room || '';
    renderReportModalContent();
    document.getElementById('report-modal').classList.remove('hidden');
  }

  function closeReportModal() {
    document.getElementById('report-modal').classList.add('hidden');
  }

  function saveStudentProfile() {
    const name = document.getElementById('inp-std-name').value.trim();
    const stdId = document.getElementById('inp-std-id').value.trim();
    const room = document.getElementById('inp-std-room').value.trim();
    progress.student = { name, stdId, room };
    if (name || stdId) unlockBadge('cert_export');
    persist();
    renderReportModalContent();
    PixelSound.install();
    toast('💾 บันทึกข้อมูลผู้เรียนเรียบร้อยแล้ว', 'success');
  }

  function exportCertificatePng() {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    renderReportModalContent();
    const std = progress.student || {};
    const slug = (std.stdId || std.name || 'Student').replace(/[^a-zA-Z0-9ก-๙_-]+/g, '_');
    const a = document.createElement('a');
    a.download = `PixelPC_Certificate_${slug}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    unlockBadge('cert_export');
    PixelSound.bootSuccess();
    toast('🖼️ ดาวน์โหลดเกียรติบัตร PNG สำเร็จ!', 'success');
  }

  function exportScoreCsv() {
    const d = computeReportData();
    const esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const headers = [
      'StudentID', 'Name', 'ClassRoom', 'Difficulty',
      'TutorialDone', 'BestChallengeTime', 'BestChallengeScore',
      'MissionsCleared', 'RepairsCleared', 'QuizBest',
      'MasteryPercent', 'OverallGrade', 'BadgesCount', 'VerifyCode', 'Date'
    ];
    const row = [
      d.studentId || '-',
      d.studentName || '-',
      d.studentRoom || '-',
      d.difficultyLabel,
      progress.tutorialDone ? 'PASS' : 'INCOMPLETE',
      d.bestTimeText,
      progress.bestScore || 0,
      d.missionsShort,
      d.repairsShort,
      d.quizShort,
      d.mastery + '%',
      d.overallGrade,
      d.badgesText,
      d.verifyCode,
      d.dateStr
    ];
    const csv = headers.map(esc).join(',') + '\r\n' + row.map(esc).join(',') + '\r\n';
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = (d.studentId || d.studentName || 'Student').replace(/[^a-zA-Z0-9ก-๙_-]+/g, '_');
    a.href = url;
    a.download = `PixelPC_Score_${slug}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    unlockBadge('cert_export');
    PixelSound.install();
    toast('📊 ดาวน์โหลดไฟล์คะแนน CSV (เปิดใน Excel ได้ทันที) สำเร็จ!', 'success');
  }

  function copyScoreSummary() {
    const d = computeReportData();
    const summary = [
      '=== PIXEL PC BUILDER ACADEMY — ใบรายงานผลคะแนน ===',
      `ผู้เรียน: ${d.studentName || 'ยังไม่ระบุชื่อ'} | รหัส: ${d.studentId || '-'} | ห้อง: ${d.studentRoom || '-'}`,
      `ระดับความยาก: ${d.difficultyName}`,
      `ความก้าวหน้ารวม: ${d.mastery}% (เกรดรวม: ${d.overallGrade})`,
      `1. โหมดฝึกสอน 12 ขั้นตอน: ${d.tutorialShort}`,
      `2. โหมดทดสอบจับเวลา: ${d.bestTimeText} (คะแนนสูงสุด: ${progress.bestScore || 0}/100)`,
      `3. ภารกิจจัดสเปก: ${d.missionsShort}`,
      `4. ศูนย์ซ่อม & BIOS: ${d.repairsShort}`,
      `5. แบบทดสอบวัดผล: ${d.quizShort}`,
      `เหรียญตรา: ${d.badgesText} | รหัสตรวจสอบ: ${d.verifyCode}`,
      `วันที่: ${d.dateStr}`
    ].join('\n');

    const onCopied = () => {
      unlockBadge('cert_export');
      PixelSound.install();
      toast('📋 คัดลอกผลคะแนนส่งครูเรียบร้อยแล้ว!', 'success');
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summary).then(onCopied).catch(() => fallbackCopy(summary, onCopied));
    } else {
      fallbackCopy(summary, onCopied);
    }
  }

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
    if (cb) cb();
  }

  function printReport() {
    renderReportModalContent();
    unlockBadge('cert_export');
    window.print();
  }

  function renderHomeStats() {
    const mastery = computeMastery();

    document.getElementById('home-mastery-text').textContent = mastery + '%';
    document.getElementById('home-mastery-bar').style.width = mastery + '%';

    document.getElementById('stat-tutorial').textContent = progress.tutorialDone ? 'ผ่านแล้ว ✓' : 'ยังไม่จบ';
    document.getElementById('stat-best-time').textContent = formatTime(progress.bestTimeSec);
    document.getElementById('stat-missions').textContent = `${progress.missionsCleared.length}/${PCData.MISSIONS.length}`;
    document.getElementById('stat-repairs').textContent = `${progress.repairsCleared.length}/${PCData.TROUBLESHOOT_CASES.length}`;
    document.getElementById('stat-quiz').textContent = `${progress.quizBest}/${PCData.QUIZ.length}`;

    // Student strip label
    const std = progress.student || {};
    const stdLabel = document.getElementById('home-student-label');
    if (stdLabel) {
      if (std.name) {
        const extra = [std.stdId ? `รหัส ${std.stdId}` : '', std.room ? `ห้อง ${std.room}` : ''].filter(Boolean).join(' • ');
        stdLabel.innerHTML = `👨‍🎓 ผู้เรียน: <strong>${std.name}</strong>${extra ? ` (${extra})` : ''}`;
      } else {
        stdLabel.innerHTML = `👨‍🎓 ผู้เรียน: <strong>ยังไม่ระบุชื่อ</strong> (กดกรอกข้อมูลเพื่อออกใบรายงานผล)`;
      }
    }

    const diffSel = document.getElementById('select-difficulty');
    if (diffSel) diffSel.value = getDifficulty();

    // Render Badges
    const grid = document.getElementById('home-badges-grid');
    grid.innerHTML = '';
    PCData.ACHIEVEMENTS.forEach((a) => {
      const unlocked = progress.badges.includes(a.id);
      const item = document.createElement('div');
      item.className = 'badge-item' + (unlocked ? ' unlocked' : '');
      item.innerHTML = `
        <span class="badge-emoji">${a.icon}</span>
        <div class="badge-meta">
          <h4>${a.title}</h4>
          <p>${a.desc}</p>
        </div>
      `;
      grid.appendChild(item);
    });
  }

  function init() {
    // Draw static sprites (logo & 5 mode icons)
    PixelArt.drawIconSprite(document.getElementById('logo-sprite'), 'logo');
    document.querySelectorAll('.mode-sprite').forEach((c) => {
      PixelArt.drawIconSprite(c, c.dataset.sprite);
    });

    // Top Nav buttons
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        PixelSound.click();
        navigate(btn.dataset.view);
      });
    });

    // Brand logo -> home
    document.getElementById('btn-home-logo').addEventListener('click', () => {
      PixelSound.click();
      navigate('home');
    });

    // Home CTA & Mode cards
    document.querySelectorAll('[data-goto]').forEach((el) => {
      el.addEventListener('click', () => {
        PixelSound.click();
        navigate(el.dataset.goto);
      });
    });

    // Difficulty selector
    const diffSel = document.getElementById('select-difficulty');
    if (diffSel) {
      diffSel.value = getDifficulty();
      diffSel.addEventListener('change', (e) => {
        PixelSound.click();
        setDifficulty(e.target.value);
      });
    }

    // Classroom Report & Export Modal triggers
    document.getElementById('btn-open-report').addEventListener('click', () => {
      PixelSound.click();
      openReportModal();
    });
    document.getElementById('btn-home-report').addEventListener('click', () => {
      PixelSound.click();
      openReportModal();
    });
    document.getElementById('btn-report-close').addEventListener('click', () => {
      PixelSound.click();
      closeReportModal();
    });
    document.getElementById('btn-save-student').addEventListener('click', saveStudentProfile);
    document.getElementById('btn-export-png').addEventListener('click', exportCertificatePng);
    document.getElementById('btn-export-csv').addEventListener('click', exportScoreCsv);
    document.getElementById('btn-export-copy').addEventListener('click', copyScoreSummary);
    document.getElementById('btn-export-print').addEventListener('click', printReport);

    // Top Audio & CRT controls
    const btnSfx = document.getElementById('btn-sfx');
    btnSfx.addEventListener('click', () => {
      const on = PixelSound.toggleSfx();
      btnSfx.textContent = on ? '🔊 SFX' : '🔇 SFX';
      btnSfx.classList.toggle('off', !on);
    });

    const btnBgm = document.getElementById('btn-bgm');
    btnBgm.classList.add('off');
    btnBgm.addEventListener('click', () => {
      const on = PixelSound.toggleBgm();
      btnBgm.textContent = on ? '🎵 BGM ON' : '🎵 BGM';
      btnBgm.classList.toggle('off', !on);
    });

    const btnCrt = document.getElementById('btn-crt');
    btnCrt.classList.add('off');
    btnCrt.addEventListener('click', () => {
      PixelSound.click();
      const on = document.body.classList.toggle('crt-on');
      btnCrt.classList.toggle('off', !on);
    });

    // Reset save button
    document.getElementById('btn-reset-save').addEventListener('click', () => {
      if (confirm('ต้องการรีเซ็ตความก้าวหน้าและเหรียญตราทั้งหมดหรือไม่?')) {
        PixelSound.error();
        progress = Object.assign({}, DEFAULT_PROGRESS, {
          missionsCleared: [],
          repairsCleared: [],
          badges: [],
          student: { name: '', stdId: '', room: '' }
        });
        persist();
        toast('รีเซ็ตข้อมูลความก้าวหน้าเรียบร้อยแล้ว', 'gold');
      }
    });

    Workbench.init();
    Modes.init();
    renderHomeStats();

    // Animate Hero Pixel PC when on Home screen
    const heroCanvas = document.getElementById('hero-pc-canvas');
    function heroLoop() {
      heroTick++;
      if (document.getElementById('view-home').classList.contains('active')) {
        PixelArt.drawHeroPC(heroCanvas, heroTick);
      }
      requestAnimationFrame(heroLoop);
    }
    requestAnimationFrame(heroLoop);
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    navigate,
    openWorkbench,
    toast,
    getProgress,
    getDifficulty,
    setDifficulty,
    saveProgress,
    recordBestTime,
    recordBestScore,
    markMissionCleared,
    markRepairCleared,
    recordQuizScore,
    unlockBadge
  };
})();
