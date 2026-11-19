/* =========================================================
   MODES 3, 4, 5 — MISSIONS, TROUBLESHOOTING, ENCYCLOPEDIA & QUIZ
   ========================================================= */
window.Modes = (function () {
  // ==================== MODE 3: BUDGET & COMPATIBILITY MISSIONS ====================
  let currentMissionIdx = 0;
  let missionConfig = null;

  const CAT_META = [
    { key: 'mb',     label: '1. เมนบอร์ด (Motherboard)' },
    { key: 'cpu',    label: '2. ซีพียู (CPU)' },
    { key: 'cooler', label: '3. ชุดระบายความร้อน (CPU Cooler)' },
    { key: 'ram',    label: '4. แรม (RAM Dual Channel)' },
    { key: 'ssd',    label: '5. หน่วยเก็บข้อมูล (M.2 NVMe SSD)' },
    { key: 'gpu',    label: '6. การ์ดจอ (GPU)' },
    { key: 'psu',    label: '7. พาวเวอร์ซัพพลาย (PSU)' }
  ];

  function renderMissionSelector() {
    const wrap = document.getElementById('mission-selector');
    const prog = App.getProgress();
    wrap.innerHTML = '';

    PCData.MISSIONS.forEach((m, idx) => {
      const cleared = prog.missionsCleared.includes(m.id);
      const card = document.createElement('div');
      card.className = 'mission-tab' + (idx === currentMissionIdx ? ' active' : '') + (cleared ? ' cleared' : '');
      card.innerHTML = `
        <div class="m-top">
          <span>${m.num}</span>
          <span>${cleared ? '✓ ผ่านแล้ว' : `งบ ฿${m.budget.toLocaleString()}`}</span>
        </div>
        <h4>${m.title}</h4>
        <small>${m.clientName}</small>
      `;
      card.addEventListener('click', () => {
        PixelSound.click();
        selectMission(idx);
      });
      wrap.appendChild(card);
    });
  }

  function selectMission(idx) {
    currentMissionIdx = idx;
    const m = PCData.MISSIONS[idx];
    missionConfig = Object.assign({}, m.defaultConfig);
    renderMissionSelector();
    renderMissionDetails();
    renderPartPickers();
    evaluateMissionBuild();
  }

  function renderMissionDetails() {
    const m = PCData.MISSIONS[currentMissionIdx];
    document.getElementById('mission-diff-badge').textContent = `${m.num} • งบ ฿${m.budget.toLocaleString()}`;
    document.getElementById('mission-name').textContent = `${m.title} (${m.clientName})`;
    document.getElementById('mission-story').textContent = `"${m.story}"`;
    PixelArt.drawClientAvatar(document.getElementById('client-avatar-canvas'), m.avatarType);

    const reqWrap = document.getElementById('mission-reqs');
    reqWrap.innerHTML = m.reqLabels.map((r) => `<span class="req-pill">🎯 ${r}</span>`).join('');
  }

  function renderPartPickers() {
    const wrap = document.getElementById('mission-part-pickers');
    wrap.innerHTML = '';

    CAT_META.forEach((cm) => {
      const list = PCData.CATALOG[cm.key];
      const group = document.createElement('div');
      group.className = 'picker-group';
      const chosen = PCData.getPartById(missionConfig[cm.key]);
      group.innerHTML = `
        <div class="picker-label">
          <span>${cm.label}</span>
          <span class="accent-gold">${chosen ? chosen.short : '-'}</span>
        </div>
        <div class="picker-options"></div>
      `;
      const optBox = group.querySelector('.picker-options');

      list.forEach((part) => {
        const btn = document.createElement('button');
        btn.className = 'pick-opt' + (missionConfig[cm.key] === part.id ? ' selected' : '');
        let tag = '';
        if (part.socket) tag = part.socket + (part.ramType ? '/' + part.ramType : '');
        else if (part.ramType) tag = `${part.ramType} ${part.capacity}GB`;
        else if (part.coolingCap) tag = `TDP ${part.coolingCap}W`;
        else if (part.capacityGB) tag = `${part.capacityGB >= 1000 ? part.capacityGB / 1000 + 'TB' : part.capacityGB + 'GB'}`;
        else if (part.capacity) tag = `${part.capacity}W`;
        else if (part.watt) tag = `${part.watt}W`;

        btn.innerHTML = `
          <span class="po-name">${part.name}</span>
          <div class="po-meta">
            <span>${tag}</span>
            <span class="po-price">฿${part.price.toLocaleString()}</span>
          </div>
        `;
        btn.addEventListener('click', () => {
          PixelSound.select();
          missionConfig[cm.key] = part.id;
          renderPartPickers();
          evaluateMissionBuild();
        });
        optBox.appendChild(btn);
      });
      wrap.appendChild(group);
    });
  }

  function evaluateMissionBuild() {
    const m = PCData.MISSIONS[currentMissionIdx];
    const p = {
      mb: PCData.getPartById(missionConfig.mb),
      cpu: PCData.getPartById(missionConfig.cpu),
      cooler: PCData.getPartById(missionConfig.cooler),
      ram: PCData.getPartById(missionConfig.ram),
      ssd: PCData.getPartById(missionConfig.ssd),
      gpu: PCData.getPartById(missionConfig.gpu),
      psu: PCData.getPartById(missionConfig.psu)
    };

    const totalCost = p.mb.price + p.cpu.price + p.cooler.price + p.ram.price + p.ssd.price + p.gpu.price + p.psu.price;
    const rawWatt = p.mb.watt + p.cpu.watt + p.cooler.watt + p.ram.watt + p.ssd.watt + p.gpu.watt + 18;
    const recWatt = Math.ceil(rawWatt * 1.25);

    // Weighted performance scores (0..100)
    const officeScore = Math.round(p.cpu.office * 0.5 + p.ram.office * 0.3 + p.gpu.office * 0.2);
    const gamingScore = Math.round(p.gpu.gaming * 0.55 + p.cpu.gaming * 0.3 + p.ram.gaming * 0.15);
    const workScore = Math.round(p.cpu.work * 0.45 + p.gpu.work * 0.35 + p.ram.work * 0.2);

    // Update budget meter
    const bPct = Math.min(100, Math.round((totalCost / m.budget) * 100));
    const bBar = document.getElementById('cfg-budget-bar');
    bBar.style.width = bPct + '%';
    bBar.className = 'px-progress-fill' + (totalCost > m.budget ? ' danger' : '');
    document.getElementById('cfg-budget-text').textContent = `฿${totalCost.toLocaleString()} / ฿${m.budget.toLocaleString()}`;

    // Update wattage meter
    const wPct = Math.min(100, Math.round((recWatt / p.psu.capacity) * 100));
    const wBar = document.getElementById('cfg-watt-bar');
    wBar.style.width = wPct + '%';
    wBar.className = 'px-progress-fill ' + (recWatt > p.psu.capacity ? 'danger' : 'cyan');
    document.getElementById('cfg-watt-text').textContent = `แนะนำ ${recWatt}W / PSU ${p.psu.capacity}W`;

    // Update perf bars
    document.getElementById('perf-office').style.width = officeScore + '%';
    document.getElementById('perf-office-val').textContent = officeScore;
    document.getElementById('perf-gaming').style.width = gamingScore + '%';
    document.getElementById('perf-gaming-val').textContent = gamingScore;
    document.getElementById('perf-work').style.width = workScore + '%';
    document.getElementById('perf-work-val').textContent = workScore;

    // Compatibility & Requirement Checks
    const checks = [];
    let allOk = true;

    const pushCheck = (ok, okText, errText) => {
      if (!ok) allOk = false;
      checks.push({ ok, text: ok ? '✅ ' + okText : '❌ ' + errText });
    };

    // 1. Socket Match
    pushCheck(
      p.mb.socket === p.cpu.socket,
      `CPU Socket ตรงกัน (${p.cpu.socket})`,
      `ซ็อกเก็ตไม่ตรงกัน! เมนบอร์ดเป็น ${p.mb.socket} แต่ CPU เป็น ${p.cpu.socket}`
    );

    // 2. RAM Type Match
    pushCheck(
      p.mb.ramType === p.ram.ramType,
      `ประเภทแรมตรงกับเมนบอร์ด (${p.ram.ramType})`,
      `แรมไม่รองรับ! เมนบอร์ดใช้ ${p.mb.ramType} แต่เลือกแรม ${p.ram.ramType}`
    );

    // 3. Cooler TDP Match
    pushCheck(
      p.cooler.coolingCap >= p.cpu.tdp,
      `ชุดระบายความร้อนเอา CPU อยู่ (${p.cooler.coolingCap}W ≥ ${p.cpu.tdp}W TDP)`,
      `Cooler ระบายความร้อนไม่พอ! CPU กินไฟ ${p.cpu.tdp}W แต่ Cooler รับได้แค่ ${p.cooler.coolingCap}W`
    );

    // 4. PSU Wattage Match
    pushCheck(
      p.psu.capacity >= recWatt,
      `พาวเวอร์ซัพพลายจ่ายไฟเพียงพอ (${p.psu.capacity}W ≥ ${recWatt}W)`,
      `PSU วัตต์ไม่พอ! ระบบเผื่อโหลดต้องการ ${recWatt}W แต่ PSU จ่ายได้ ${p.psu.capacity}W`
    );

    // 5. Budget
    pushCheck(
      totalCost <= m.budget,
      `อยู่ในงบประมาณ (เหลือ ฿${(m.budget - totalCost).toLocaleString()})`,
      `เกินงบประมาณไป ฿${(totalCost - m.budget).toLocaleString()}!`
    );

    // 6. Mission Performance Targets
    const r = m.reqs;
    if (r.office > 0) {
      pushCheck(officeScore >= r.office, `คะแนนงานเอกสารผ่านเกณฑ์ (${officeScore} ≥ ${r.office})`, `คะแนนงานเอกสารยังไม่ถึง (${officeScore} / ${r.office})`);
    }
    if (r.gaming > 0) {
      pushCheck(gamingScore >= r.gaming, `คะแนนเกมมิ่งผ่านเกณฑ์ (${gamingScore} ≥ ${r.gaming})`, `คะแนนเกมมิ่งยังไม่ถึง (${gamingScore} / ${r.gaming}) ลองอัปเกรด GPU/CPU`);
    }
    if (r.work > 0) {
      pushCheck(workScore >= r.work, `คะแนนตัดต่อ/3D/AI ผ่านเกณฑ์ (${workScore} ≥ ${r.work})`, `คะแนนงานตัดต่อ/AI ยังไม่ถึง (${workScore} / ${r.work})`);
    }
    if (r.minRam) {
      pushCheck(p.ram.capacity >= r.minRam, `ความจุแรมครบตามโจทย์ (${p.ram.capacity}GB)`, `โจทย์ต้องการแรมอย่างน้อย ${r.minRam}GB`);
    }
    if (r.minSsd) {
      pushCheck(p.ssd.capacityGB >= r.minSsd, `ความจุ SSD ครบตามโจทย์ (${p.ssd.capacityGB}GB)`, `โจทย์ต้องการ SSD อย่างน้อย ${r.minSsd >= 1000 ? r.minSsd / 1000 + 'TB' : r.minSsd + 'GB'}`);
    }
    if (r.requireDdr5) {
      pushCheck(p.ram.ramType === 'DDR5', `ใช้เทคโนโลยีแรม DDR5 ตามโจทย์`, `โจทย์นี้ลูกค้าเจาะจงต้องการระบบแรม DDR5`);
    }
    if (r.requireSocket) {
      pushCheck(
        p.mb.socket === r.requireSocket && p.cpu.socket === r.requireSocket,
        `ใช้แพลตฟอร์มซ็อกเก็ต ${r.requireSocket} ตามโจทย์`,
        `โจทย์นี้กำหนดให้ใช้ซ็อกเก็ต ${r.requireSocket} เท่านั้น`
      );
    }

    const listEl = document.getElementById('compat-checks-list');
    listEl.innerHTML = checks.map((c) => `<div class="compat-row ${c.ok ? 'ok' : 'err'}">${c.text}</div>`).join('');

    const launchBtn = document.getElementById('btn-launch-mission-build');
    launchBtn.disabled = !allOk;
    launchBtn.textContent = allOk
      ? '🔧 สเปกผ่าน 100%! นำไปประกอบเครื่องจริง ➔'
      : '⚠️ แก้ไขจุดสีแดงด้านบนก่อนนำไปประกอบ';
  }

  // ==================== MODE 4: TROUBLESHOOTING LAB ====================
  function renderTroubleshootLab() {
    const grid = document.getElementById('troubleshoot-grid');
    const prog = App.getProgress();
    grid.innerHTML = '';

    PCData.TROUBLESHOOT_CASES.forEach((tc) => {
      const solved = prog.repairsCleared.includes(tc.id);
      const card = document.createElement('article');
      card.className = 'case-card px-box' + (solved ? ' solved' : '');
      card.innerHTML = `
        <div class="case-card-top">
          <span class="badge-pill">${tc.num} • ${tc.difficulty}</span>
          <span class="${solved ? 'accent-green' : 'accent-gold'}" style="font-weight:700;font-size:13px;">
            ${solved ? '✅ ซ่อมสำเร็จแล้ว' : '🔧 รอการซ่อม'}
          </span>
        </div>
        <h3>${tc.title}</h3>
        <div class="case-symptom"><strong>อาการที่พบ:</strong> ${tc.symptom}</div>
        <p class="case-clue">💡 แนวทาง: ${tc.clue}</p>
        <button class="px-btn ${solved ? '' : 'px-btn-primary'} full-width">
          ${solved ? '🔄 ลองซ่อมเคสนี้อีกครั้ง' : '🛠️ รับเครื่องเข้าโต๊ะซ่อม ➔'}
        </button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        PixelSound.click();
        App.openWorkbench('troubleshoot', tc);
      });
      grid.appendChild(card);
    });
  }

  // ==================== MODE 5: ENCYCLOPEDIA & QUIZ ====================
  function renderEncyclopedia() {
    const grid = document.getElementById('encyc-grid');
    grid.innerHTML = '';
    PCData.ENCYCLOPEDIA.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'encyc-card px-box';
      card.innerHTML = `
        <div class="encyc-head">
          <canvas class="pixel-canvas encyc-sprite" width="48" height="48"></canvas>
          <div>
            <h3>${item.title}</h3>
            <div class="encyc-role">${item.role}</div>
          </div>
        </div>
        <p class="encyc-body">${item.body}</p>
        <div class="encyc-box"><strong>✨ เกร็ดความรู้:</strong> ${item.fact}</div>
        <div class="info-tip">⚠️ <strong>ข้อควรระวัง:</strong> ${item.caution}</div>
      `;
      PixelArt.drawIconSprite(card.querySelector('canvas'), item.sprite);
      grid.appendChild(card);
    });
  }

  // Quiz State
  let quizIdx = 0;
  let quizScore = 0;
  let quizAnswered = false;

  function startQuiz() {
    quizIdx = 0;
    quizScore = 0;
    quizAnswered = false;
    renderQuiz();
  }

  function renderQuiz() {
    const box = document.getElementById('quiz-box');
    const total = PCData.QUIZ.length;

    if (quizIdx >= total) {
      App.recordQuizScore(quizScore);
      const pct = Math.round((quizScore / total) * 100);
      const msg = quizScore === total
        ? 'อัจฉริยะฮาร์ดแวร์! ตอบถูกครบทุกข้อ 100%!'
        : quizScore >= 15
        ? 'ยอดเยี่ยมมาก! คุณมีความเข้าใจเรื่องการประกอบคอมพิวเตอร์ระดับดีเยี่ยม'
        : `ดีมาก! ลองอ่านทบทวนในสารานุกรมแล้วมาทำสถิติใหม่ให้ได้เต็ม ${total} ข้อนะ`;

      box.innerHTML = `
        <div style="text-align:center;">
          <div class="badge-pill">📝 QUIZ COMPLETE</div>
          <h2>สรุปผลแบบทดสอบวัดความเข้าใจ</h2>
          <div class="grade-big">${quizScore}/${total}</div>
          <p style="font-size:18px;margin-bottom:10px;" class="accent-cyan">ความถูกต้อง ${pct}%</p>
          <p style="color:var(--text-dim);margin-bottom:18px;">${msg}</p>
          <button class="px-btn px-btn-primary px-btn-lg" id="btn-quiz-retry">🔄 ทำแบบทดสอบใหม่อีกครั้ง</button>
        </div>
      `;
      document.getElementById('btn-quiz-retry').addEventListener('click', () => {
        PixelSound.click();
        startQuiz();
      });
      return;
    }

    const q = PCData.QUIZ[quizIdx];
    const pct = Math.round((quizIdx / total) * 100);

    box.innerHTML = `
      <div class="quiz-top">
        <span class="badge-pill">ข้อที่ ${quizIdx + 1} / ${total}</span>
        <span class="accent-gold">คะแนนปัจจุบัน: ${quizScore}</span>
      </div>
      <div class="px-progress-track"><div class="px-progress-fill cyan" style="width:${pct}%"></div></div>
      <h3 class="quiz-q">${q.q}</h3>
      <div class="quiz-options" id="quiz-options"></div>
      <div id="quiz-explain" class="quiz-explain hidden"></div>
      <div style="text-align:right;">
        <button class="px-btn px-btn-gold hidden" id="btn-quiz-next">
          ${quizIdx === total - 1 ? '🏁 ดูสรุปคะแนน' : 'ข้อถัดไป ➔'}
        </button>
      </div>
    `;

    const optsWrap = document.getElementById('quiz-options');
    const labels = ['ก.', 'ข.', 'ค.', 'ง.'];

    q.opts.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.className = 'px-btn quiz-opt';
      btn.textContent = `${labels[i]} ${optText}`;
      btn.addEventListener('click', () => {
        if (quizAnswered) return;
        quizAnswered = true;
        const allBtns = optsWrap.querySelectorAll('button');
        allBtns.forEach((b, bi) => {
          b.disabled = true;
          if (bi === q.ans) b.classList.add('correct');
        });
        const expEl = document.getElementById('quiz-explain');
        expEl.classList.remove('hidden');
        if (i === q.ans) {
          quizScore++;
          PixelSound.quizCorrect();
          expEl.innerHTML = `<strong class="accent-green">✅ ถูกต้อง!</strong> ${q.exp}`;
        } else {
          btn.classList.add('wrong');
          PixelSound.quizWrong();
          expEl.innerHTML = `<strong class="accent-red">❌ ยังไม่ถูกนะ!</strong> เฉลย: ${labels[q.ans]} ${q.opts[q.ans]} — ${q.exp}`;
        }
        document.getElementById('btn-quiz-next').classList.remove('hidden');
      });
      optsWrap.appendChild(btn);
    });

    document.getElementById('btn-quiz-next').addEventListener('click', () => {
      PixelSound.click();
      quizIdx++;
      quizAnswered = false;
      renderQuiz();
    });
  }

  function init() {
    // Launch mission build button
    document.getElementById('btn-launch-mission-build').addEventListener('click', () => {
      PixelSound.install();
      App.openWorkbench('mission', {
        mission: PCData.MISSIONS[currentMissionIdx],
        config: Object.assign({}, missionConfig)
      });
    });

    // Learn sub-tabs (Encyclopedia vs Quiz)
    document.querySelectorAll('.learn-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        PixelSound.click();
        const target = btn.dataset.ltab;
        document.querySelectorAll('.learn-tab').forEach((b) => {
          b.classList.toggle('active', b === btn);
          b.classList.toggle('px-btn-primary', b === btn);
        });
        document.querySelectorAll('.ltab-content').forEach((c) => {
          c.classList.toggle('active', c.id === 'ltab-' + target);
        });
        if (target === 'quiz') startQuiz();
      });
    });

    selectMission(0);
    renderTroubleshootLab();
    renderEncyclopedia();
    startQuiz();
  }

  function refreshAll() {
    renderMissionSelector();
    renderTroubleshootLab();
  }

  return { init, refreshAll, selectMission };
})();
