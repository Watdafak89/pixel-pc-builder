/* =========================================================
   INTERACTIVE PC WORKBENCH ENGINE (MODES 1, 2, 3, 4)
   ========================================================= */
window.Workbench = (function () {
  let mode = 'tutorial'; // 'tutorial' | 'challenge' | 'mission' | 'troubleshoot'
  let activeMission = null;
  let activeMissionConfig = null;
  let activeTrouble = null;

  let state = null;
  let selectedItem = null; // e.g., 'mb', 'cpu', 'tool_paste', 'cable_24', ...
  let activeTab = 'parts';
  let timerSec = 0;
  let timerHandle = null;
  let animTick = 0;
  let particles = [];
  let mentorMood = 'guide';
  let hintUsedOnStep = false;
  let lastBuildFinished = false;

  const els = {};

  function cacheDom() {
    els.modeBadge = document.getElementById('wb-mode-badge');
    els.title = document.getElementById('wb-title');
    els.hudStepWrap = document.getElementById('hud-step-wrap');
    els.hudStep = document.getElementById('hud-step');
    els.hudTimer = document.getElementById('hud-timer');
    els.hudScore = document.getElementById('hud-score');
    els.hudErrors = document.getElementById('hud-errors');
    els.hintCount = document.getElementById('hint-count');
    els.partsList = document.getElementById('wb-parts-list');
    els.canvas = document.getElementById('wb-canvas');
    els.canvasWrap = document.getElementById('wb-canvas-wrap');
    els.stageSelected = document.getElementById('stage-selected-label');
    els.stageWatt = document.getElementById('stage-watt-label');
    els.psuSwitchState = document.getElementById('psu-switch-state');
    els.mentorCanvas = document.getElementById('mentor-canvas');
    els.mentorMood = document.getElementById('mentor-mood-tag');
    els.mentorText = document.getElementById('mentor-text');
    els.infoSprite = document.getElementById('info-card-sprite');
    els.infoName = document.getElementById('info-card-name');
    els.infoSpec = document.getElementById('info-card-spec');
    els.infoDesc = document.getElementById('info-card-desc');
    els.infoTip = document.getElementById('info-card-tip');
    els.checklist = document.getElementById('wb-checklist');
    els.rightTitle = document.getElementById('wb-right-title');

    // Paste overlay
    els.pasteOverlay = document.getElementById('paste-minigame');
    els.pasteFill = document.getElementById('paste-meter-fill');
    els.pasteStatus = document.getElementById('paste-status-text');

    // BIOS modal
    els.biosModal = document.getElementById('bios-modal');
    els.biosScreen = document.getElementById('bios-screen');
    els.biosStatusPill = document.getElementById('bios-status-pill');
    els.btnBiosFinish = document.getElementById('btn-bios-finish');

    // Result modal
    els.resultModal = document.getElementById('result-modal');
    els.resultContent = document.getElementById('result-content');
  }

  function getDiff() {
    const key = (window.App && App.getDifficulty) ? App.getDifficulty() : 'normal';
    return (PCData.DIFFICULTIES && PCData.DIFFICULTIES[key]) || PCData.DIFFICULTIES.normal;
  }

  function buildPartsFromConfig(cfg) {
    const c = cfg || PCData.DEFAULT_BUILD;
    return {
      mb: PCData.getPartById(c.mb),
      cpu: PCData.getPartById(c.cpu),
      cooler: PCData.getPartById(c.cooler),
      ram: PCData.getPartById(c.ram),
      ssd: PCData.getPartById(c.ssd),
      gpu: PCData.getPartById(c.gpu),
      psu: PCData.getPartById(c.psu)
    };
  }

  function createInitialState(partsObj) {
    return {
      parts: partsObj,
      installed: {
        mb: false,
        cpu: false,
        cooler: false,
        ram: false,
        ssd: false,
        gpu: false,
        psu: false,
        fans: false
      },
      cables: {
        atx24: false,
        cpu: false,
        fan: false,
        gpu: false
      },
      pasteAmount: 0, // 0..100 (44..68 is ideal)
      pasteConfirmed: false,
      psuSwitch: false,
      glassClosed: false,
      showAirflow: false,
      poweredOn: false,
      score: 100,
      errors: 0,
      hintsLeft: mode === 'challenge' ? getDiff().hints : 99,
      highlightZones: [],
      hoverZone: null
    };
  }

  function start(newMode, payload = null) {
    mode = newMode;
    activeMission = newMode === 'mission' ? payload.mission : null;
    activeMissionConfig = newMode === 'mission' && payload && payload.config ? Object.assign({}, payload.config) : null;
    activeTrouble = newMode === 'troubleshoot' ? payload : null;
    lastBuildFinished = false;
    selectedItem = null;
    activeTab = 'parts';
    particles = [];
    hintUsedOnStep = false;

    const cfg = (newMode === 'troubleshoot' && activeTrouble && activeTrouble.customBuild)
      ? activeTrouble.customBuild
      : (activeMissionConfig || PCData.DEFAULT_BUILD);
    state = createInitialState(buildPartsFromConfig(cfg));

    // If troubleshoot mode, pre-install full PC then inject specific faults!
    if (mode === 'troubleshoot' && activeTrouble) {
      Object.keys(state.installed).forEach((k) => { state.installed[k] = true; });
      Object.keys(state.cables).forEach((k) => { state.cables[k] = true; });
      state.pasteAmount = 56;
      state.pasteConfirmed = true;
      state.psuSwitch = true;

      const f = activeTrouble.faults;
      if (f.psuMissing) state.installed.psu = false;
      if (f.psuSwitch === false) state.psuSwitch = false;
      if (f.cable24 === false) state.cables.atx24 = false;
      if (f.cableCpu === false) state.cables.cpu = false;
      if (f.cableFan === false) state.cables.fan = false;
      if (f.cableGpu === false) state.cables.gpu = false;
      if (f.ramMissing) state.installed.ram = false;
      if (f.ssdMissing) state.installed.ssd = false;
      if (f.noPaste) {
        state.pasteAmount = 0;
        state.pasteConfirmed = false;
      }
    }

    // Header UI
    if (mode === 'tutorial') {
      els.modeBadge.textContent = 'MODE 01 • GUIDED TUTORIAL';
      els.title.textContent = 'ฝึกสอนการประกอบคอมพิวเตอร์ (12 ขั้นตอน)';
      els.rightTitle.textContent = '📋 ขั้นตอนการประกอบ (12 สเต็ป)';
    } else if (mode === 'challenge') {
      els.modeBadge.textContent = 'MODE 02 • TIMED CHALLENGE';
      els.title.textContent = 'ทดสอบประกอบคอมพิวเตอร์ด้วยตนเอง & จับเวลา';
      els.rightTitle.textContent = '📋 รายการตรวจสอบความสมบูรณ์';
    } else if (mode === 'mission') {
      els.modeBadge.textContent = `MODE 03 • ${activeMission.num}`;
      els.title.textContent = `ประกอบเครื่องภารกิจ: ${activeMission.title}`;
      els.rightTitle.textContent = '📋 ขั้นตอนประกอบเครื่องลูกค้า';
    } else if (mode === 'troubleshoot') {
      els.modeBadge.textContent = `MODE 04 • ${activeTrouble.num}`;
      els.title.textContent = `ซ่อมเครื่อง: ${activeTrouble.title}`;
      els.rightTitle.textContent = '🔍 บันทึกการตรวจเช็กอาการเสีย';
    }

    // Reset timer
    stopTimer();
    timerSec = 0;
    els.hudTimer.textContent = '00:00';
    timerHandle = setInterval(() => {
      timerSec++;
      els.hudTimer.textContent = formatTime(timerSec);
    }, 1000);

    els.pasteOverlay.classList.add('hidden');
    closeBiosModal();
    closeResultModal();

    if (mode === 'troubleshoot') {
      setMentor('warn', `เคสซ่อม: "${activeTrouble.symptom}" ลองกดปุ่ม "⏻ กดปุ่มเปิดเครื่อง" เพื่อฟังเสียง POST Beep หรือดูอาการก่อนนะ!`);
    } else if (mode === 'challenge') {
      setMentor('guide', 'โหมดทดสอบจับเวลาเริ่มแล้ว! ประกอบชิ้นส่วนตามลำดับที่ถูกต้องให้ครบแล้วทดสอบบูต BIOS ขอให้ได้เกรด S!');
    } else {
      const step = getCurrentStep();
      setMentor('guide', step ? step.mentor : 'พร้อมประกอบคอมพิวเตอร์แล้ว!');
    }

    setInvTab('parts');
    syncUI();
  }

  function stopTimer() {
    if (timerHandle) {
      clearInterval(timerHandle);
      timerHandle = null;
    }
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function isStepDone(stepId) {
    if (!state) return false;
    switch (stepId) {
      case 'mb': return state.installed.mb;
      case 'cpu': return state.installed.cpu;
      case 'paste': return state.pasteConfirmed && state.pasteAmount > 0;
      case 'cooler': return state.installed.cooler;
      case 'ram': return state.installed.ram;
      case 'ssd': return state.installed.ssd;
      case 'psu': return state.installed.psu;
      case 'cables_main': return state.cables.atx24 && state.cables.cpu && state.cables.fan;
      case 'gpu': return state.installed.gpu && state.cables.gpu;
      case 'fans': return state.installed.fans;
      case 'psu_on': return state.psuSwitch;
      case 'power': return state.poweredOn && lastBuildFinished;
      default: return false;
    }
  }

  function getCurrentStep() {
    for (const st of PCData.STEPS) {
      if (!isStepDone(st.id)) return st;
    }
    return null;
  }

  function getCompletedStepCount() {
    return PCData.STEPS.filter((s) => isStepDone(s.id)).length;
  }

  function setMentor(mood, text) {
    mentorMood = mood;
    els.mentorText.textContent = text;
    const labels = { guide: 'GUIDE', happy: 'GREAT!', warn: 'ALERT', celebrate: 'SUCCESS!' };
    els.mentorMood.textContent = labels[mood] || 'GUIDE';
  }

  function spawnParticles(x, y, color = '#4deeea', count = 14) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 0.6 + Math.random() * 2.2;
      particles.push({
        x, y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 0.5,
        life: 18 + Math.floor(Math.random() * 14),
        size: Math.random() > 0.5 ? 3 : 2,
        color: i % 3 === 0 ? '#fbbf24' : color
      });
    }
  }

  function getTotalWatts() {
    if (!state) return { draw: 0, cap: 0 };
    let draw = 0;
    if (state.installed.mb) draw += state.parts.mb.watt;
    if (state.installed.cpu) draw += state.parts.cpu.watt;
    if (state.installed.cooler) draw += state.parts.cooler.watt;
    if (state.installed.ram) draw += state.parts.ram.watt;
    if (state.installed.ssd) draw += state.parts.ssd.watt;
    if (state.installed.gpu) draw += state.parts.gpu.watt;
    if (state.installed.fans) draw += 12;
    const cap = state.installed.psu ? state.parts.psu.capacity : 0;
    return { draw, cap };
  }

  // ==================== INVENTORY LIST ====================
  function getInventoryItems() {
    const p = state.parts;
    const mainParts = [
      { id: 'mb', sprite: 'mb', name: p.mb.name, sub: `${p.mb.socket} • ${p.mb.ramType}`, installed: state.installed.mb, desc: p.mb.desc, tip: p.mb.tip },
      { id: 'cpu', sprite: 'cpu', name: p.cpu.name, sub: `${p.cpu.socket} • ${p.cpu.cores}`, installed: state.installed.cpu, desc: p.cpu.desc, tip: p.cpu.tip },
      { id: 'cooler', sprite: 'cooler', name: p.cooler.name, sub: `รองรับ ${p.cooler.coolingCap}W TDP`, installed: state.installed.cooler, desc: p.cooler.desc, tip: p.cooler.tip },
      { id: 'ram', sprite: 'ram', name: p.ram.name, sub: `${p.ram.ramType} Dual Channel`, installed: state.installed.ram, desc: p.ram.desc, tip: p.ram.tip },
      { id: 'ssd', sprite: 'ssd', name: p.ssd.name, sub: `M.2 NVMe SSD`, installed: state.installed.ssd, desc: p.ssd.desc, tip: p.ssd.tip },
      { id: 'gpu', sprite: 'gpu', name: p.gpu.name, sub: `PCIe x16 • ${p.gpu.watt}W`, installed: state.installed.gpu, desc: p.gpu.desc, tip: p.gpu.tip },
      { id: 'psu', sprite: 'psu', name: p.psu.name, sub: `จ่ายไฟสูงสุด ${p.psu.capacity}W`, installed: state.installed.psu, desc: p.psu.desc, tip: p.psu.tip },
      {
        id: 'fans', sprite: 'fans', name: 'PixelFlow RGB Fans (4 ตัว)', sub: '3 หน้าดูดเข้า + 1 หลังเป่าออก',
        installed: state.installed.fans,
        desc: 'ชุดพัดลมเคสสร้างทิศทางลม Airflow ดูดลมเย็นเข้าทางด้านหน้าและระบายความร้อนออกด้านหลังเคส',
        tip: 'ทิศทางลมที่ดีช่วยลดอุณหภูมิ CPU และ GPU ลงได้ 8–15°C เลยทีเดียว!'
      }
    ];

    const tools = [
      {
        id: 'tool_paste', sprite: 'paste', name: 'หลอดซิลิโคน (Thermal Paste)',
        sub: state.pasteConfirmed ? `ทาแล้ว (${state.pasteAmount}%)` : 'หยอดขนาดเม็ดถั่วเขียวบน CPU',
        installed: state.pasteConfirmed && state.pasteAmount > 0,
        desc: 'ซิลิโคนนำความร้อน ทาบนกระดอง CPU ก่อนวางชุดระบายความร้อน เพื่อไล่ช่องว่างอากาศระดับจุลภาค',
        tip: 'ปริมาณที่เหมาะสมคือประมาณ 45–65% (ขนาดเม็ดถั่วเขียว) น้อยไปจะร้อน เยอะไปจะล้นเลอะ!'
      },
      {
        id: 'cable_24', sprite: 'cable_24', name: 'สายไฟ 24-Pin ATX (เมนบอร์ด)',
        sub: 'PSU ➔ ขอบขวาเมนบอร์ด',
        installed: state.cables.atx24,
        desc: 'สายไฟเส้นใหญ่ที่สุดสำหรับจ่ายไฟหลักให้เมนบอร์ดและสล็อตอุปกรณ์ต่างๆ',
        tip: 'เสียบให้สุดจนสลักล็อกคลิกเข้าที่ หากไม่แน่นเครื่องจะเปิดไม่ติด'
      },
      {
        id: 'cable_cpu', sprite: 'cable_cpu', name: 'สายไฟ 8-Pin EPS (ซีพียู)',
        sub: 'PSU ➔ มุมซ้ายบนเมนบอร์ด',
        installed: state.cables.cpu,
        desc: 'สายไฟเลี้ยงภาคจ่ายไฟ VRM ของซีพียูโดยเฉพาะ (4+4 Pin CPU)',
        tip: 'ห้ามสับสนระหว่างสาย 8-Pin CPU กับสาย 8-Pin PCIe การ์ดจอ เพราะการเรียงขั้วไฟต่างกัน!'
      },
      {
        id: 'cable_fan', sprite: 'cable_fan', name: 'สายพัดลม 4-Pin CPU_FAN',
        sub: 'Cooler ➔ หัวต่อ CPU_FAN บนบอร์ด',
        installed: state.cables.fan,
        desc: 'สายจ่ายไฟและควบคุมรอบหมุน (PWM) ของพัดลมระบายความร้อนซีพียู',
        tip: 'หากลืมเสียบสายนี้ พัดลม CPU จะไม่หมุนและหน้า BIOS จะแจ้งเตือน CPU Fan Error!'
      },
      {
        id: 'cable_gpu', sprite: 'cable_gpu', name: 'สายไฟ 8-Pin PCIe (การ์ดจอ)',
        sub: 'PSU ➔ ด้านบนการ์ดจอ GPU',
        installed: state.cables.gpu,
        desc: 'สายไฟเลี้ยงเสริมให้การ์ดจอแยกสามารถทำงานและส่งสัญญาณภาพออกหน้าจอได้',
        tip: 'การ์ดจอแยกที่ต้องการไฟเสริมหากลืมเสียบสายนี้จะไม่มีภาพขึ้นหน้าจอและมีเสียง Beep เตือน'
      }
    ];

    return activeTab === 'parts' ? mainParts : tools;
  }

  function getAllItemsFlat() {
    const prev = activeTab;
    activeTab = 'parts';
    const a = getInventoryItems();
    activeTab = 'tools';
    const b = getInventoryItems();
    activeTab = prev;
    return [...a, ...b];
  }

  function setInvTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.inv-tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    renderInventory();
  }

  function renderInventory() {
    const items = getInventoryItems();
    const curStep = (mode === 'tutorial' || mode === 'mission') ? getCurrentStep() : null;
    els.partsList.innerHTML = '';

    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'part-item';
      if (item.installed) div.classList.add('installed');
      if (selectedItem === item.id) div.classList.add('selected');

      // Highlight recommended item in tutorial/mission mode
      if (curStep && !item.installed) {
        const isRec =
          curStep.itemId === item.id ||
          (curStep.id === 'cables_main' && ['cable_24', 'cable_cpu', 'cable_fan'].includes(item.id)) ||
          (curStep.id === 'gpu' && state.installed.gpu && item.id === 'cable_gpu');
        if (isRec) div.classList.add('recommended');
      }

      div.draggable = !item.installed;
      div.innerHTML = `
        <canvas class="pixel-canvas part-thumb" width="36" height="36"></canvas>
        <div class="part-meta">
          <h4>${item.name}</h4>
          <small>${item.sub}</small>
        </div>
        <span class="part-status">${item.installed ? '✓ ติดแล้ว' : ''}</span>
      `;
      PixelArt.drawIconSprite(div.querySelector('canvas'), item.sprite);

      div.addEventListener('click', () => {
        showInfoCard(item);
        if (item.installed) {
          PixelSound.click();
          return;
        }
        PixelSound.select();
        selectedItem = (selectedItem === item.id) ? null : item.id;
        syncUI();
      });

      div.addEventListener('dragstart', (e) => {
        if (item.installed) { e.preventDefault(); return; }
        selectedItem = item.id;
        showInfoCard(item);
        e.dataTransfer.setData('text/plain', item.id);
        syncUI();
      });

      els.partsList.appendChild(div);
    });
  }

  function showInfoCard(item) {
    PixelArt.drawIconSprite(els.infoSprite, item.sprite);
    els.infoName.textContent = item.name;
    els.infoSpec.textContent = item.sub;
    els.infoDesc.textContent = item.desc;
    els.infoTip.textContent = '💡 เคล็ดลับ: ' + item.tip;
  }

  function renderChecklist() {
    els.checklist.innerHTML = '';
    if (mode === 'troubleshoot' && activeTrouble) {
      const checks = [
        { label: 'สวิตช์หลัง PSU เปิด (ON)', ok: state.psuSwitch },
        { label: 'สายไฟเมนบอร์ด 24-Pin ATX', ok: state.cables.atx24 },
        { label: 'สายไฟซีพียู 8-Pin EPS', ok: state.cables.cpu },
        { label: 'ซิลิโคน CPU (Thermal Paste)', ok: state.pasteConfirmed && state.pasteAmount > 0 },
        { label: 'สายพัดลม CPU_FAN', ok: state.cables.fan },
        { label: 'แรม (RAM Dual Channel)', ok: state.installed.ram },
        { label: 'M.2 NVMe SSD (บูตระบบ)', ok: state.installed.ssd },
        { label: 'สายไฟการ์ดจอ 8-Pin PCIe', ok: state.cables.gpu }
      ];
      checks.forEach((c) => {
        const row = document.createElement('div');
        row.className = 'check-row ' + (c.ok ? 'done' : 'current');
        row.innerHTML = `<span class="check-box">${c.ok ? '[OK]' : '[??]'}</span><span>${c.label}</span>`;
        els.checklist.appendChild(row);
      });
      return;
    }

    const cur = getCurrentStep();
    PCData.STEPS.forEach((st) => {
      const done = isStepDone(st.id);
      const isCur = cur && cur.id === st.id && (mode === 'tutorial' || mode === 'mission');
      const row = document.createElement('div');
      row.className = 'check-row' + (done ? ' done' : (isCur ? ' current' : ''));
      row.innerHTML = `<span class="check-box">${done ? '[✓]' : (isCur ? '[▶]' : '[ ]')}</span><span>${st.title}</span>`;
      els.checklist.appendChild(row);
    });
  }

  function computeHighlightZones() {
    const zones = [];
    const diff = getDiff();
    // If user selected an item, highlight its target zone (unless hard difficulty hides selection hints)
    const showGuide = (mode === 'tutorial' || mode === 'mission' || mode === 'troubleshoot' || hintUsedOnStep || diff.alwaysHighlight);

    if (selectedItem) {
      if (!(mode === 'challenge' && diff.hideSelectHighlight && !hintUsedOnStep)) {
        if (selectedItem === 'tool_paste' || selectedItem === 'cooler') zones.push('cpu');
        else if (selectedItem === 'fans') { zones.push('fans'); zones.push('fansRear'); }
        else if (PixelArt.ZONES[selectedItem]) zones.push(selectedItem);
      }
    } else if (showGuide && mode !== 'troubleshoot') {
      const cur = getCurrentStep();
      if (cur) {
        if (cur.id === 'cables_main') {
          if (!state.cables.atx24) zones.push('cable_24');
          if (!state.cables.cpu) zones.push('cable_cpu');
          if (!state.cables.fan) zones.push('cable_fan');
        } else if (cur.id === 'gpu') {
          if (!state.installed.gpu) zones.push('gpu');
          else if (!state.cables.gpu) zones.push('cable_gpu');
        } else if (cur.id === 'fans') {
          zones.push('fans', 'fansRear');
        } else if (PixelArt.ZONES[cur.zone]) {
          zones.push(cur.zone);
        }
      }
    }
    state.highlightZones = zones;
  }

  function syncUI() {
    if (!state) return;
    computeHighlightZones();
    renderInventory();
    renderChecklist();

    const doneCount = getCompletedStepCount();
    els.hudStep.textContent = mode === 'troubleshoot' ? activeTrouble.num : `${doneCount} / ${PCData.STEPS.length}`;
    els.hudScore.textContent = state.score;
    els.hudErrors.textContent = state.errors;
    els.hintCount.textContent = mode === 'challenge' ? state.hintsLeft : '∞';

    const w = getTotalWatts();
    els.stageWatt.textContent = `กำลังไฟระบบ: ${w.draw}W / ${w.cap}W PSU`;

    els.psuSwitchState.textContent = state.psuSwitch ? 'ON (I)' : 'OFF (0)';
    els.psuSwitchState.className = state.psuSwitch ? 'accent-green' : 'accent-red';

    if (selectedItem) {
      const found = getAllItemsFlat().find((i) => i.id === selectedItem);
      els.stageSelected.textContent = `🎯 กำลังถือ: ${found ? found.name : selectedItem} — คลิกตำแหน่งติดตั้งในเคส!`;
    } else {
      els.stageSelected.textContent = '👆 เลือกชิ้นส่วนด้านซ้าย แล้วคลิกตำแหน่งในเคส (หรือลากมาวาง)';
    }
  }

  // ==================== PLACEMENT & VALIDATION LOGIC ====================
  function recordError(msg) {
    PixelSound.error();
    state.errors++;
    const penalty = getDiff().errorPenalty || 5;
    state.score = Math.max(0, state.score - penalty);
    setMentor('warn', msg);
    App.toast(msg, 'error');
    syncUI();
  }

  function attemptPlace(itemId, clickX, clickY) {
    if (!itemId) {
      // Check if user clicked on PSU switch area directly on canvas
      if (clickX >= 34 && clickX <= 50 && clickY >= 170 && clickY <= 194 && state.installed.psu) {
        togglePsuSwitch();
      }
      return;
    }

    if (state.glassClosed) {
      recordError('ฝาข้างกระจกปิดอยู่! กดปุ่ม "🪟 ฝาข้าง" เพื่อเปิดฝาเคสก่อนติดตั้งอุปกรณ์นะ');
      return;
    }

    const hit = (zk) => {
      const z = PixelArt.ZONES[zk];
      if (!z) return false;
      // Generous 8px padding for smooth UX
      return clickX >= z.x - 8 && clickX <= z.x + z.w + 8 && clickY >= z.y - 8 && clickY <= z.y + z.h + 8;
    };

    // 1. Motherboard
    if (itemId === 'mb') {
      if (!hit('mb')) return recordError('วางเมนบอร์ดให้ตรงพื้นที่หมุดรอง Standoffs กลางเคสนะ!');
      state.installed.mb = true;
      onInstallSuccess('mb', 136, 86, PCData.STEPS[0].doneMsg);
      return;
    }

    // 2. CPU
    if (itemId === 'cpu') {
      if (!state.installed.mb) return recordError('ต้องติดตั้งเมนบอร์ดลงในเคสก่อนจึงจะวาง CPU ได้!');
      if (!hit('cpu')) return recordError('วาง CPU ให้ตรงช่องซ็อกเก็ตสี่เหลี่ยมบนเมนบอร์ดนะ!');
      state.installed.cpu = true;
      onInstallSuccess('cpu', 116, 62, PCData.STEPS[1].doneMsg);
      return;
    }

    // 3. Thermal Paste
    if (itemId === 'tool_paste') {
      if (!state.installed.cpu) return recordError('ต้องวาง CPU ลงในซ็อกเก็ตก่อนจึงจะทาซิลิโคนได้!');
      if (!hit('cpu')) return recordError('คลิกที่ตัว CPU เพื่อเปิดหลอดบีบซิลิโคนระบายความร้อน!');
      // In troubleshoot mode if cooler is already mounted, smoothly lift cooler for re-paste
      if (state.installed.cooler && mode === 'troubleshoot') {
        state.installed.cooler = false;
        App.toast('ถอด CPU Cooler ชั่วคราวเพื่อทาซิลิโคนใหม่...', 'gold');
      } else if (state.installed.cooler) {
        return recordError('ติดตั้ง CPU Cooler ทับไปแล้ว! ควรทาซิลิโคนก่อนวาง Cooler นะ');
      }
      openPasteMinigame();
      return;
    }

    // 4. CPU Cooler
    if (itemId === 'cooler') {
      if (!state.installed.cpu) return recordError('ต้องติดตั้ง CPU ก่อนจึงจะวาง CPU Cooler ได้!');
      if (!hit('cpu')) return recordError('วาง CPU Cooler ให้ตรงตำแหน่งบนตัว CPU นะ!');
      if (!state.pasteConfirmed || state.pasteAmount === 0) {
        if (mode === 'tutorial' || mode === 'mission') {
          return recordError('เดี๋ยวก่อน! ลืมทาซิลิโคนระบายความร้อน (Thermal Paste) ไปที่แท็บ "ซิลิโคน & สายไฟ" ก่อนนะ!');
        } else {
          // In Challenge mode, allow mistake so BIOS Overheat teaches them!
          App.toast('⚠️ คุณไม่ได้ทาซิลิโคน! ระวัง CPU ร้อนเกินพิกัดตอนเปิดเครื่อง!', 'error');
        }
      }
      state.installed.cooler = true;
      onInstallSuccess('cooler', 116, 62, PCData.STEPS[3].doneMsg);
      return;
    }

    // 5. RAM
    if (itemId === 'ram') {
      if (!state.installed.mb) return recordError('ต้องติดตั้งเมนบอร์ดก่อนจึงจะเสียบแรมได้!');
      if (!hit('ram')) return recordError('เสียบแรมให้ตรงสล็อตแรมแนวตั้งด้านขวาของซ็อกเก็ต CPU (ช่อง A2/B2)!');
      state.installed.ram = true;
      onInstallSuccess('ram', 168, 60, PCData.STEPS[4].doneMsg);
      return;
    }

    // 6. M.2 SSD
    if (itemId === 'ssd') {
      if (!state.installed.mb) return recordError('ต้องติดตั้งเมนบอร์ดก่อนจึงจะติดตั้ง M.2 NVMe SSD ได้!');
      if (!hit('ssd')) return recordError('วาง M.2 SSD ลงบนสล็อตแนวนอนใต้ซ็อกเก็ต CPU นะ!');
      state.installed.ssd = true;
      onInstallSuccess('ssd', 124, 94, PCData.STEPS[5].doneMsg);
      return;
    }

    // 7. PSU
    if (itemId === 'psu') {
      if (!hit('psu')) return recordError('ติดตั้งพาวเวอร์ซัพพลาย (PSU) ลงในช่องด้านล่างซ้ายของเคส!');
      state.installed.psu = true;
      onInstallSuccess('psu', 92, 180, PCData.STEPS[6].doneMsg);
      return;
    }

    // 8. GPU
    if (itemId === 'gpu') {
      if (!state.installed.mb) return recordError('ต้องติดตั้งเมนบอร์ดก่อนจึงจะเสียบการ์ดจอได้!');
      if (!hit('gpu')) return recordError('เสียบการ์ดจอลงในสล็อต PCIe x16 แนวนอนช่วงล่างของเมนบอร์ด!');
      state.installed.gpu = true;
      onInstallSuccess('gpu', 130, 122, 'เสียบการ์ดจอลงสล็อต PCIe x16 แล้ว! อย่าลืมไปแท็บสายไฟเพื่อเสียบ "สายไฟ 8-Pin PCIe (การ์ดจอ)" ด้วยนะ');
      return;
    }

    // 9. Case Fans
    if (itemId === 'fans') {
      if (!hit('fans') && !hit('fansRear')) return recordError('ติดพัดลมเคสที่ด้านหน้าขวา หรือด้านหลังซ้ายของเคส!');
      state.installed.fans = true;
      onInstallSuccess('fans', 264, 82, PCData.STEPS[9].doneMsg);
      return;
    }

    // 10. Cables
    if (itemId === 'cable_24') {
      if (!state.installed.mb || !state.installed.psu) return recordError('ต้องติดตั้งทั้งเมนบอร์ดและ PSU ก่อนเสียบสายไฟ 24-Pin!');
      if (!hit('cable_24')) return recordError('เสียบสาย 24-Pin ATX ที่ขั้วต่อแนวยาวขอบขวาของเมนบอร์ด!');
      state.cables.atx24 = true;
      PixelSound.cable();
      onCableSuccess(202, 66, 'เสียบสายไฟหลัก 24-Pin ATX เข้าเมนบอร์ดเรียบร้อย!');
      return;
    }
    if (itemId === 'cable_cpu') {
      if (!state.installed.mb || !state.installed.psu) return recordError('ต้องติดตั้งทั้งเมนบอร์ดและ PSU ก่อนเสียบสายไฟ 8-Pin CPU!');
      if (!hit('cable_cpu')) return recordError('เสียบสาย 8-Pin CPU ที่มุมบนซ้ายของเมนบอร์ด!');
      state.cables.cpu = true;
      PixelSound.cable();
      onCableSuccess(83, 28, 'เสียบสายไฟเลี้ยงซีพียู 8-Pin EPS เรียบร้อย!');
      return;
    }
    if (itemId === 'cable_fan') {
      if (!state.installed.cooler) return recordError('ต้องติดตั้ง CPU Cooler ก่อนจึงจะเสียบสายพัดลม CPU_FAN ได้!');
      if (!hit('cable_fan')) return recordError('เสียบสายพัดลมเข้าที่ขั้ว CPU_FAN ด้านบนขวาของซ็อกเก็ต CPU!');
      state.cables.fan = true;
      PixelSound.cable();
      onCableSuccess(142, 30, 'เสียบสายพัดลม CPU_FAN เรียบร้อย! พัดลมพร้อมระบายความร้อนแล้ว');
      return;
    }
    if (itemId === 'cable_gpu') {
      if (!state.installed.gpu || !state.installed.psu) return recordError('ต้องติดตั้งการ์ดจอและ PSU ก่อนจึงจะเสียบสาย 8-Pin PCIe ได้!');
      if (!hit('cable_gpu') && !hit('gpu')) return recordError('เสียบสายไฟ 8-Pin PCIe ที่ช่องไฟเลี้ยงด้านบนขวาของการ์ดจอ!');
      state.cables.gpu = true;
      PixelSound.cable();
      onCableSuccess(188, 110, PCData.STEPS[8].doneMsg);
      return;
    }
  }

  function onInstallSuccess(partKey, pxX, pxY, msg) {
    PixelSound.install();
    spawnParticles(pxX, pxY, '#4ade80', 18);
    selectedItem = null;
    hintUsedOnStep = false;
    state.poweredOn = false;
    setMentor('happy', msg);
    App.toast('✅ ' + msg, 'success');
    autoSwitchTabIfNeeded();
    syncUI();
  }

  function onCableSuccess(pxX, pxY, msg) {
    spawnParticles(pxX, pxY, '#fbbf24', 14);
    selectedItem = null;
    hintUsedOnStep = false;
    setMentor('happy', msg);
    App.toast('🔌 ' + msg, 'success');
    autoSwitchTabIfNeeded();
    syncUI();
  }

  function autoSwitchTabIfNeeded() {
    if (mode === 'tutorial' || mode === 'mission') {
      const next = getCurrentStep();
      if (next) {
        if (next.id === 'gpu' && state.installed.gpu && !state.cables.gpu) {
          setInvTab('tools');
        } else if (next.tab && next.tab !== activeTab) {
          setInvTab(next.tab);
        }
        setTimeout(() => {
          if (state && getCurrentStep() && getCurrentStep().id === next.id) {
            setMentor('guide', next.mentor);
          }
        }, 1600);
      }
    }
  }

  // ==================== THERMAL PASTE MINI-GAME ====================
  function openPasteMinigame() {
    const diff = getDiff();
    const zoneEl = document.getElementById('paste-zone-good');
    if (zoneEl) {
      zoneEl.style.left = diff.pasteMin + '%';
      zoneEl.style.width = (diff.pasteMax - diff.pasteMin) + '%';
    }
    els.pasteOverlay.classList.remove('hidden');
    updatePasteMeter();
  }

  function updatePasteMeter() {
    const diff = getDiff();
    const v = state.pasteAmount;
    els.pasteFill.style.width = v + '%';
    if (v === 0) {
      els.pasteFill.style.background = '#64748b';
      els.pasteStatus.textContent = 'ปริมาณ: 0% (ยังไม่บีบซิลิโคน)';
      els.pasteStatus.className = 'paste-status-text';
    } else if (v < diff.pasteMin) {
      els.pasteFill.style.background = '#fbbf24';
      els.pasteStatus.textContent = `ปริมาณ: ${v}% (น้อยไปหน่อย กดบีบเพิ่มอีกนิด!)`;
      els.pasteStatus.className = 'paste-status-text accent-gold';
    } else if (v <= diff.pasteMax) {
      els.pasteFill.style.background = '#4ade80';
      els.pasteStatus.textContent = `ปริมาณ: ${v}% ✨ พอดีเป๊ะ! ขนาดเม็ดถั่วเขียวสมบูรณ์แบบ!`;
      els.pasteStatus.className = 'paste-status-text accent-green';
    } else {
      els.pasteFill.style.background = '#f43f5e';
      els.pasteStatus.textContent = `ปริมาณ: ${v}% ⚠️ เยอะเกินไป! อาจล้นเลอะเทอะ ลองเช็ดออกแล้วทาใหม่`;
      els.pasteStatus.className = 'paste-status-text accent-red';
    }
  }

  function squeezePaste() {
    PixelSound.paste();
    state.pasteAmount = Math.min(100, state.pasteAmount + 12);
    updatePasteMeter();
  }

  function cleanPaste() {
    PixelSound.click();
    state.pasteAmount = 0;
    updatePasteMeter();
  }

  function confirmPaste() {
    if (state.pasteAmount === 0) {
      App.toast('กรุณาบีบซิลิโคนก่อนกดยืนยัน!', 'error');
      PixelSound.error();
      return;
    }
    const diff = getDiff();
    state.pasteConfirmed = true;
    els.pasteOverlay.classList.add('hidden');
    selectedItem = null;
    hintUsedOnStep = false;

    // Re-mount cooler automatically in troubleshoot Case 3 after re-pasting
    if (mode === 'troubleshoot' && activeTrouble && activeTrouble.faults.noPaste) {
      state.installed.cooler = true;
    }

    if (state.pasteAmount >= diff.pasteMin && state.pasteAmount <= diff.pasteMax) {
      App.unlockBadge('perfect_paste');
      PixelSound.install();
      spawnParticles(116, 62, '#4ade80', 18);
      setMentor('happy', 'ยอดเยี่ยม! หยอดซิลิโคนขนาดเม็ดถั่วเขียวพอดีเป๊ะ อุณหภูมิ CPU จะเย็นสุดๆ แน่นอน!');
      App.toast('🧪 ทาซิลิโคนสมบูรณ์แบบ! (เม็ดถั่วเขียวพอดีเป๊ะ)', 'success');
    } else {
      PixelSound.install();
      spawnParticles(116, 62, '#fbbf24', 12);
      setMentor('warn', state.pasteAmount < diff.pasteMin
        ? 'ทาซิลิโคนน้อยไปนิด อุณหภูมิ CPU อาจสูงกว่าปกติเล็กน้อย แต่ยังใช้งานได้'
        : 'ทาซิลิโคนเยอะไปหน่อยนะ! ของจริงจะล้นขอบซ็อกเก็ตได้');
      App.toast('🧪 ยืนยันการทาซิลิโคนแล้ว', 'gold');
    }
    autoSwitchTabIfNeeded();
    syncUI();
  }

  // ==================== POWER & BIOS / POST SIMULATOR ====================
  function togglePsuSwitch() {
    if (!state.installed.psu) {
      return recordError('ยังไม่ได้ติดตั้งพาวเวอร์ซัพพลาย (PSU) เลย!');
    }
    PixelSound.switchClick();
    state.psuSwitch = !state.psuSwitch;
    if (!state.psuSwitch) state.poweredOn = false;
    setMentor(state.psuSwitch ? 'happy' : 'guide', state.psuSwitch
      ? 'เปิดสวิตช์ PSU (I) เรียบร้อย! ตอนนี้พร้อมกดปุ่ม Power ทดสอบบูต BIOS แล้ว!'
      : 'ปิดสวิตช์ PSU (0) เพื่อความปลอดภัยขณะทำงานในเคส');
    syncUI();
  }

  function runPowerTest() {
    PixelSound.switchClick();
    const lines = [];
    let status = 'OK';
    let beepType = 'ok';
    let passed = false;

    const addLine = (text, cls = '') => lines.push({ text, cls });

    // 1. Check Power Delivery
    if (!state.installed.psu) {
      PixelSound.error();
      return recordError('ไม่มีพาวเวอร์ซัพพลาย (PSU) เครื่องเปิดไม่ติดแน่นอน!');
    }
    if (!state.psuSwitch) {
      status = 'NO POWER';
      beepType = null;
      addLine('> กดปุ่ม Power หน้าเคส...', '');
      addLine('> [!] เงียบสนิท... ไม่มีกระแสไฟเข้าสู่ระบบ!', 'bios-err');
      addLine('> สาเหตุ: สวิตช์ I/O ด้านหลังพาวเวอร์ซัพพลาย (PSU) ยังปิดอยู่ที่ OFF (0)!', 'bios-warn');
      addLine('> วิธีแก้ไข: กดปุ่ม "⚡ สวิตช์ PSU" ด้านล่างหน้าจอให้เป็น ON (I)', 'bios-ok');
      openBiosModal(lines, 'NO POWER', false);
      return;
    }
    if (!state.installed.mb || !state.cables.atx24) {
      status = 'NO POWER (24-PIN)';
      addLine('> สวิตช์ PSU ON แต่เมนบอร์ดไม่ตอบสนอง...', 'bios-err');
      addLine('> [ERROR] ไม่พบไฟเลี้ยงหลัก 24-Pin ATX บนเมนบอร์ด!', 'bios-err');
      addLine('> วิธีแก้ไข: ไปที่แท็บ "ซิลิโคน & สายไฟ" แล้วเสียบสาย 24-Pin ATX ให้แน่น', 'bios-warn');
      openBiosModal(lines, 'POWER FAULT', false);
      return;
    }
    if (!state.cables.cpu || !state.installed.cpu) {
      status = 'CPU FAULT';
      addLine('> พัดลมหมุนแต่ระบบไม่เริ่มทำงาน (CPU_LED RED)...', 'bios-err');
      addLine('> [ERROR] ไม่พบ CPU หรือยังไม่ได้เสียบสายไฟเลี้ยง 8-Pin EPS CPU!', 'bios-err');
      addLine('> วิธีแก้ไข: ตรวจสอบการติดตั้ง CPU และเสียบสาย 8-Pin EPS มุมซ้ายบนเมนบอร์ด', 'bios-warn');
      openBiosModal(lines, 'CPU ERROR', false);
      return;
    }

    // Power is live! Spin fans visually
    state.poweredOn = true;
    PixelSound.fanSpin();

    // 2. Check PSU Wattage Overload
    const watts = getTotalWatts();
    if (watts.draw > watts.cap) {
      state.poweredOn = false;
      PixelSound.error();
      addLine(`> ระบบต้องการไฟ ~${watts.draw}W แต่ PSU จ่ายได้สูงสุด ${watts.cap}W!`, 'bios-err');
      addLine('> [OCP SHUTDOWN] ระบบป้องกันไฟเกินตัดการทำงานทันที!', 'bios-err');
      openBiosModal(lines, 'PSU OVERLOAD', false);
      return;
    }

    // 3. Check RAM (POST Beep 3 Short!)
    if (!state.installed.ram) {
      beepType = 'ram';
      PixelSound.postBeep('ram');
      addLine('PIXEL-AMI POST DIAGNOSTIC...', '');
      addLine('🔊 [BEEP CODE]: ปี๊บ - ปี๊บ - ปี๊บ (สั้น 3 ครั้ง!)', 'bios-err');
      addLine('> [POST FAILED] MEMORY_ERROR: ตรวจไม่พบหน่วยความจำหลัก (RAM)!', 'bios-err');
      addLine('> วิธีแก้ไข: ติดตั้งแรมลงในสล็อต Dual Channel (A2 และ B2) ให้ลงล็อก', 'bios-warn');
      openBiosModal(lines, 'BEEP: 3 SHORT', false);
      return;
    }

    // 4. Check GPU & 8-Pin PCIe Power (1 Long 2 Short!)
    if (!state.installed.gpu || !state.cables.gpu) {
      beepType = 'gpu';
      PixelSound.postBeep('gpu');
      addLine('PIXEL-AMI POST DIAGNOSTIC...', '');
      addLine('🔊 [BEEP CODE]: ปี๊บบบบ - ปี๊บ - ปี๊บ (ยาว 1 สั้น 2 ครั้ง!)', 'bios-err');
      addLine('> [POST FAILED] VGA_NO_SIGNAL: ไม่พบการ์ดจอ หรือลืมเสียบสายไฟ 8-Pin PCIe!', 'bios-err');
      addLine('> วิธีแก้ไข: ติดตั้งการ์ดจอลงสล็อต PCIe x16 และเสียบสายไฟ 8-Pin PCIe บนตัวการ์ดจอ', 'bios-warn');
      openBiosModal(lines, 'NO DISPLAY', false);
      return;
    }

    // 5. Calculate Realistic CPU Temperature
    let cpuTemp = 36;
    const diff = getDiff();
    if (!state.installed.cooler || !state.cables.fan || state.pasteAmount === 0) {
      cpuTemp = 98;
    } else {
      if (state.pasteAmount < diff.pasteMin) cpuTemp += 16;
      else if (state.pasteAmount > diff.pasteMax) cpuTemp += 8;
      if (!state.installed.fans) cpuTemp += 9;
      if (state.parts.cooler.coolingCap < state.parts.cpu.tdp) cpuTemp += 22;
      if (state.parts.cooler.style === 'aio') cpuTemp -= 4;
    }

    if (cpuTemp >= 95) {
      PixelSound.postBeep('overheat');
      addLine('PIXEL-AMI UEFI BIOS v2.60', '');
      addLine(`CPU: ${state.parts.cpu.name} (${state.parts.cpu.cores})`, '');
      addLine(`🌡️ CPU TEMPERATURE: ${cpuTemp}°C  [CRITICAL OVERHEAT!!]`, 'bios-err');
      if (!state.installed.cooler) addLine('> [ERROR] ไม่พบชุดระบายความร้อน CPU Cooler!', 'bios-err');
      if (state.pasteAmount === 0) addLine('> [ERROR] ไม่พบซิลิโคนระบายความร้อน (Thermal Paste) บนหน้าสัมผัส CPU!', 'bios-err');
      if (!state.cables.fan) addLine('> [ERROR] CPU_FAN ERROR! พัดลมไม่หมุน (ลืมเสียบสาย 4-Pin CPU_FAN)!', 'bios-err');
      addLine('> THERMAL PROTECTION: ปิดระบบอัตโนมัติเพื่อป้องกัน CPU เสียหาย!', 'bios-warn');
      state.poweredOn = false;
      openBiosModal(lines, 'OVERHEAT 98°C', false);
      return;
    }

    // 6. Check M.2 NVMe SSD
    if (!state.installed.ssd) {
      PixelSound.postBeep('ok');
      addLine('PIXEL-AMI UEFI BIOS v2.60 — POST PASSED (1 Short Beep)', 'bios-ok');
      addLine(`CPU: ${state.parts.cpu.name} | Temp: ${cpuTemp}°C | RAM: ${state.parts.ram.name} (Dual Channel)`, '');
      addLine(`GPU: ${state.parts.gpu.name} (PCIe x16 Gen4)`, '');
      addLine('> [BOOT ERROR] No Bootable Device Found! ไม่พบไดรฟ์เก็บข้อมูล (M.2 NVMe SSD)', 'bios-err');
      addLine('> วิธีแก้ไข: ปิดหน้าต่างนี้แล้วติดตั้ง M.2 NVMe SSD ลงบนเมนบอร์ด', 'bios-warn');
      openBiosModal(lines, 'NO BOOT DRIVE', false);
      return;
    }

    // 7. FULL POST & BOOT SUCCESS!!
    PixelSound.postBeep('ok');
    setTimeout(() => PixelSound.bootSuccess(), 240);
    passed = true;
    lastBuildFinished = true;
    App.unlockBadge('bios_boot');

    addLine('🔊 [POST BEEP]: ปี๊บ! (1 Short Beep — ฮาร์ดแวร์สมบูรณ์ 100%)', 'bios-ok');
    addLine('======================================================', '');
    addLine('  PIXEL-AMI UEFI BIOS UTILITY v2.60 — SYSTEM HEALTH OK', 'bios-ok');
    addLine('======================================================', '');

    const tempStatus = cpuTemp <= 46 ? 'เย็นเยี่ยม (Optimal)' : (cpuTemp <= 60 ? 'ปกติ (Normal)' : 'ค่อนข้างอุ่น (Warm)');
    const biosTableHtml = `
      <div class="bios-box">
        <div><strong>Motherboard:</strong><br/>${state.parts.mb.name} (${state.parts.mb.socket})</div>
        <div><strong>Processor (CPU):</strong><br/>${state.parts.cpu.name} (${state.parts.cpu.cores})</div>
        <div><strong>Memory (RAM):</strong><br/>${state.parts.ram.name} <span class="bios-ok">[Dual Channel]</span></div>
        <div><strong>Graphics (GPU):</strong><br/>${state.parts.gpu.name}</div>
        <div><strong>Boot Storage:</strong><br/>${state.parts.ssd.name} <span class="bios-ok">[GPT/UEFI]</span></div>
        <div><strong>Power Supply:</strong><br/>${state.parts.psu.name} (โหลด ~${watts.draw}W)</div>
        <div><strong>CPU Temperature:</strong><br/><span class="${cpuTemp <= 55 ? 'bios-ok' : 'bios-warn'}">${cpuTemp}°C — ${tempStatus}</span></div>
        <div><strong>Case Airflow:</strong><br/>${state.installed.fans ? '<span class="bios-ok">1,250 RPM (Intake/Exhaust OK)</span>' : '<span class="bios-warn">ไม่ได้ติดพัดลมเคส</span>'}</div>
      </div>
      <div class="bios-line bios-ok" style="margin-top:12px;">
        &gt; Booting PIXEL OS v2.6 Educational Edition... [SUCCESS 100%] ████████████
      </div>
    `;

    setMentor('celebrate', 'สุดยอดมาก!! เครื่องผ่าน POST บูตเข้าหน้าจอ BIOS และระบบปฏิบัติการได้สมบูรณ์แบบ 100%!');
    openBiosModal(lines, 'BOOT SUCCESS', true, biosTableHtml);
    syncUI();
  }

  function openBiosModal(lines, pillText, isSuccess, extraHtml = '') {
    els.biosStatusPill.textContent = pillText;
    els.biosStatusPill.style.borderColor = isSuccess ? '#4ade80' : '#fb7185';
    els.biosStatusPill.style.color = isSuccess ? '#4ade80' : '#fb7185';
    els.biosScreen.innerHTML = lines.map((l) => `<div class="bios-line ${l.cls}">${l.text}</div>`).join('') + extraHtml;
    els.btnBiosFinish.classList.toggle('hidden', !isSuccess);
    els.biosModal.classList.remove('hidden');
  }

  function closeBiosModal() {
    els.biosModal.classList.add('hidden');
  }

  function finishAndShowResult() {
    closeBiosModal();
    stopTimer();
    const diff = getDiff();

    // Grade calculation
    let grade = 'S';
    if (state.score < 60) grade = 'D';
    else if (state.score < 75) grade = 'C';
    else if (state.score < 85) grade = 'B';
    else if (state.score < 95 || timerSec > diff.gradeSTime) grade = 'A';

    // Save Progress
    if (mode === 'tutorial') {
      App.saveProgress('tutorialDone', true);
      App.unlockBadge('tut_done');
    } else if (mode === 'challenge') {
      App.recordBestTime(timerSec);
      if (App.recordBestScore) App.recordBestScore(state.score);
      if (grade === 'S' || grade === 'A') App.unlockBadge('speed_builder');
    } else if (mode === 'mission' && activeMission) {
      App.markMissionCleared(activeMission.id);
    } else if (mode === 'troubleshoot' && activeTrouble) {
      App.markRepairCleared(activeTrouble.id);
    }

    if (diff.id === 'hard') {
      App.unlockBadge('hard_clear');
    }

    const extraNote = (mode === 'troubleshoot' && activeTrouble)
      ? `<div class="info-tip" style="text-align:left;margin-top:10px;">📖 <strong>สรุปความรู้จากเคสนี้:</strong> ${activeTrouble.explanation}</div>`
      : '';

    els.resultContent.innerHTML = `
      <div class="badge-pill">🏆 MISSION COMPLETE!</div>
      <h2>${mode === 'troubleshoot' ? 'ซ่อมเครื่องสำเร็จ!' : 'ประกอบคอมพิวเตอร์สำเร็จสมบูรณ์!'}</h2>
      <div class="grade-big">${grade}</div>
      <div class="result-stats">
        <div class="result-stat-box">⏱️ เวลาที่ใช้: <strong>${formatTime(timerSec)}</strong></div>
        <div class="result-stat-box">⭐ คะแนนความแม่นยำ: <strong>${state.score} / 100</strong></div>
        <div class="result-stat-box">⚠️ ข้อผิดพลาด: <strong>${state.errors} ครั้ง</strong></div>
        <div class="result-stat-box">🧪 ซิลิโคน: <strong>${state.pasteAmount}%</strong></div>
      </div>
      ${extraNote}
    `;
    els.resultModal.classList.remove('hidden');
  }

  function closeResultModal() {
    els.resultModal.classList.add('hidden');
  }

  // ==================== HINT SYSTEM ====================
  function triggerHint() {
    if (mode === 'challenge') {
      if (state.hintsLeft <= 0) {
        PixelSound.error();
        App.toast('คำใบ้ในโหมดทดสอบหมดแล้ว!', 'error');
        return;
      }
      state.hintsLeft--;
      state.score = Math.max(0, state.score - 3);
    }
    PixelSound.hint();
    hintUsedOnStep = true;

    if (mode === 'troubleshoot' && activeTrouble) {
      const f = activeTrouble.faults;
      if (f.psuMissing && !state.installed.psu) {
        setInvTab('parts');
      } else if (f.cable24 === false || f.cableCpu === false || f.noPaste || f.cableFan === false || f.cableGpu === false) {
        setInvTab('tools');
      } else {
        setInvTab('parts');
      }
      setMentor('guide', '💡 คำใบ้จาก อาจารย์วัช: ' + activeTrouble.clue);
      App.toast('💡 ' + activeTrouble.clue, 'gold');
    } else {
      const cur = getCurrentStep();
      if (cur) {
        if (cur.tab && cur.tab !== activeTab) setInvTab(cur.tab);
        setMentor('guide', '💡 คำใบ้: ' + cur.mentor);
        App.toast('💡 ' + cur.title, 'gold');
      }
    }
    syncUI();
  }

  // ==================== CANVAS COORDINATES & EVENTS ====================
  function getCanvasCoords(clientX, clientY) {
    const rect = els.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 320;
    const y = ((clientY - rect.top) / rect.height) * 220;
    return { x, y };
  }

  function findHoverZone(x, y) {
    for (const key of Object.keys(PixelArt.ZONES)) {
      const z = PixelArt.ZONES[key];
      if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) {
        return key;
      }
    }
    return null;
  }

  function init() {
    cacheDom();

    // Inventory tabs
    document.querySelectorAll('.inv-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        PixelSound.click();
        setInvTab(btn.dataset.tab);
      });
    });

    // Canvas click
    els.canvas.addEventListener('click', (e) => {
      if (!state) return;
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      attemptPlace(selectedItem, x, y);
    });

    // Canvas hover
    els.canvas.addEventListener('mousemove', (e) => {
      if (!state) return;
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      state.hoverZone = findHoverZone(x, y);
    });
    els.canvas.addEventListener('mouseleave', () => {
      if (state) state.hoverZone = null;
    });

    // Drag & Drop onto canvas
    els.canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!state) return;
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      state.hoverZone = findHoverZone(x, y);
    });
    els.canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!state) return;
      const itemId = e.dataTransfer.getData('text/plain') || selectedItem;
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      attemptPlace(itemId, x, y);
    });

    // Quick buttons
    document.getElementById('btn-psu-switch').addEventListener('click', togglePsuSwitch);
    document.getElementById('btn-power-pc').addEventListener('click', runPowerTest);
    document.getElementById('btn-wb-hint').addEventListener('click', triggerHint);

    document.getElementById('btn-wb-airflow').addEventListener('click', () => {
      if (!state) return;
      PixelSound.click();
      state.showAirflow = !state.showAirflow;
      App.toast(state.showAirflow ? '💨 เปิดแสดงทิศทางลม Airflow (ฟ้า=เย็นเข้า / ส้ม=ร้อนออก)' : 'ปิดการแสดงทิศทางลม', 'gold');
    });

    document.getElementById('btn-wb-glass').addEventListener('click', () => {
      if (!state) return;
      PixelSound.click();
      state.glassClosed = !state.glassClosed;
      App.toast(state.glassClosed ? '🪟 ปิดฝาข้างกระจก Tempered Glass แล้ว' : '🪟 เปิดฝาข้างเคสออกแล้ว');
    });

    document.getElementById('btn-wb-restart').addEventListener('click', () => {
      PixelSound.click();
      start(mode, mode === 'mission' ? { mission: activeMission, config: activeMissionConfig } : activeTrouble);
    });

    // Paste mini-game buttons
    document.getElementById('btn-squeeze-paste').addEventListener('click', squeezePaste);
    document.getElementById('btn-clean-paste').addEventListener('click', cleanPaste);
    document.getElementById('btn-confirm-paste').addEventListener('click', confirmPaste);

    // BIOS Modal buttons
    document.getElementById('btn-bios-close').addEventListener('click', () => {
      PixelSound.click();
      closeBiosModal();
    });
    els.btnBiosFinish.addEventListener('click', () => {
      PixelSound.click();
      finishAndShowResult();
    });

    // Result Modal buttons
    document.getElementById('btn-result-again').addEventListener('click', () => {
      PixelSound.click();
      closeResultModal();
      if (mode === 'troubleshoot') App.navigate('troubleshoot');
      else if (mode === 'mission') App.navigate('missions');
      else start(mode);
    });
    document.getElementById('btn-result-home').addEventListener('click', () => {
      PixelSound.click();
      closeResultModal();
      App.navigate('home');
    });

    // ESC closes BIOS modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.biosModal.classList.contains('hidden')) {
        closeBiosModal();
      }
    });

    // Main Workbench Render Loop
    function loop() {
      animTick++;
      if (state && document.getElementById('view-workbench').classList.contains('active')) {
        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08;
          p.life--;
          if (p.life <= 0) particles.splice(i, 1);
        }
        const ctx = els.canvas.getContext('2d');
        PixelArt.drawWorkbench(ctx, state, animTick, particles);
        PixelArt.drawMentor(els.mentorCanvas, mentorMood, animTick);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  return { init, start, stopTimer };
})();
