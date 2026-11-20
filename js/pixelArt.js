/* =========================================================
   PIXEL ART ENGINE — 16-BIT SPRITES & WORKBENCH RENDERER
   ========================================================= */
window.PixelArt = (function () {
  // Helper: draw integer pixel rect
  function px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  // Helper: draw pixel border rect
  function box(ctx, x, y, w, h, fill, border, hi, sh) {
    px(ctx, x, y, w, h, border);
    px(ctx, x + 1, y + 1, w - 2, h - 2, fill);
    if (hi) {
      px(ctx, x + 1, y + 1, w - 2, 1, hi);
      px(ctx, x + 1, y + 1, 1, h - 2, hi);
    }
    if (sh) {
      px(ctx, x + 1, y + h - 2, w - 2, 1, sh);
      px(ctx, x + w - 2, y + 1, 1, h - 2, sh);
    }
  }

  // Helper: rainbow pixel color
  function rgbColor(tick, offset = 0) {
    const palette = ['#ff4d6d', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6'];
    return palette[Math.floor((tick / 10 + offset)) % palette.length];
  }

  // Helper: pixel spinning fan (drawn inside a square)
  function drawPixelFan(ctx, x, y, size, tick, spinning, rgb = false, accent = '#4deeea') {
    const cx = Math.floor(x + size / 2);
    const cy = Math.floor(y + size / 2);
    const r = Math.floor(size / 2) - 1;
    // Outer frame
    box(ctx, x, y, size, size, '#151824', '#090b12', '#353c54', '#0d1018');
    // Circular cavity (octagonal pixel circle)
    px(ctx, x + 3, y + 2, size - 6, size - 4, '#0c0e17');
    px(ctx, x + 2, y + 3, size - 4, size - 6, '#0c0e17');

    // RGB Ring
    if (rgb && spinning) {
      const col = rgbColor(tick, x);
      px(ctx, x + 3, y + 2, size - 6, 1, col);
      px(ctx, x + 3, y + size - 3, size - 6, 1, col);
      px(ctx, x + 2, y + 3, 1, size - 6, col);
      px(ctx, x + size - 3, y + 3, 1, size - 6, col);
    }

    // Blades (4-frame crisp pixel rotation)
    const phase = spinning ? Math.floor(tick / 2) % 4 : 0;
    const bladeCol = spinning ? (rgb ? '#cbd5e1' : '#64748b') : '#475569';
    const bladeHi = spinning ? '#94a3b8' : '#64748b';
    const len = Math.max(3, r - 2);

    if (phase === 0 || phase === 2) {
      // Cross blades (+ or X)
      if (phase === 0) {
        px(ctx, cx - 1, cy - len, 2, len * 2 + 1, bladeCol);
        px(ctx, cx - len, cy - 1, len * 2 + 1, 2, bladeCol);
        px(ctx, cx, cy - len, 1, len, bladeHi);
      } else {
        for (let i = -len + 1; i <= len - 1; i++) {
          px(ctx, cx + i, cy + i, 2, 2, bladeCol);
          px(ctx, cx + i, cy - i, 2, 2, bladeCol);
        }
      }
    } else {
      // Diagonal offset blades
      const dir = phase === 1 ? 1 : -1;
      for (let i = -len + 1; i <= len - 1; i++) {
        px(ctx, cx + i, cy + Math.round(i * 0.5 * dir), 2, 2, bladeCol);
        px(ctx, cx - Math.round(i * 0.5 * dir), cy + i, 2, 2, bladeHi);
      }
    }

    // Hub
    px(ctx, cx - 2, cy - 2, 5, 5, '#1e293b');
    px(ctx, cx - 1, cy - 1, 3, 3, spinning ? accent : '#475569');
  }

  // Stepped pixel cable curve (Manhattan / diagonal steps)
  function drawPixelCable(ctx, points, color, highlight, width = 2) {
    for (let i = 0; i < points.length - 1; i++) {
      let [x0, y0] = points[i];
      let [x1, y1] = points[i + 1];
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;
      while (true) {
        px(ctx, x0, y0, width, width, '#08090f');
        px(ctx, x0, y0, width, Math.max(1, width - 1), color);
        if (highlight && (x0 + y0) % 4 === 0) {
          px(ctx, x0, y0, 1, 1, highlight);
        }
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
      }
    }
  }

  // ==================== ICON SPRITE RENDERER (for UI cards & inventory) ====================
  function drawIconSprite(canvas, type, tick = 0) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Draw on virtual 24x24 grid scaled cleanly to canvas size
    const s = Math.max(1, Math.floor(Math.min(w, h) / 24));
    const ox = Math.floor((w - 24 * s) / 2);
    const oy = Math.floor((h - 24 * s) / 2);
    const P = (x, y, rw, rh, col) => px(ctx, ox + x * s, oy + y * s, rw * s, rh * s, col);

    if (type === 'logo' || type === 'pc') {
      P(3, 2, 18, 20, '#0b0912');
      P(4, 3, 16, 18, '#262d47');
      P(5, 4, 10, 13, '#111626');
      P(6, 5, 8, 8, '#1e293b');
      P(8, 7, 4, 4, '#38bdf8');
      P(6, 14, 9, 2, '#4ade80');
      P(16, 4, 3, 16, '#181e30');
      P(17, 6, 1, 3, '#4deeea');
      P(17, 11, 1, 3, '#a78bfa');
      P(17, 16, 1, 2, '#fbbf24');
      P(5, 18, 10, 2, '#0f172a');
      return;
    }

    if (type === 'mb') {
      P(2, 2, 20, 20, '#0b0912');
      P(3, 3, 18, 18, '#1e293b');
      P(4, 4, 3, 7, '#64748b'); // I/O
      P(8, 5, 6, 6, '#334155'); // socket
      P(9, 6, 4, 4, '#fbbf24');
      P(16, 4, 1, 8, '#38bdf8'); // RAM slots
      P(18, 4, 1, 8, '#38bdf8');
      P(5, 14, 12, 2, '#94a3b8'); // PCIe
      P(5, 17, 8, 2, '#475569');
      P(16, 15, 4, 4, '#0ea5e9'); // chipset
      P(10, 12, 5, 1, '#4ade80'); // trace
      return;
    }

    if (type === 'cpu') {
      P(4, 4, 16, 16, '#0b0912');
      P(5, 5, 14, 14, '#15803d'); // green PCB
      P(7, 7, 10, 10, '#cbd5e1'); // IHS
      P(8, 8, 8, 8, '#94a3b8');
      P(9, 9, 6, 6, '#e2e8f0');
      P(6, 17, 2, 2, '#fbbf24'); // gold triangle
      P(10, 10, 4, 1, '#334155');
      P(10, 12, 3, 1, '#334155');
      // Gold pads
      for (let i = 6; i <= 16; i += 2) {
        P(i, 3, 1, 1, '#fbbf24');
        P(i, 20, 1, 1, '#fbbf24');
      }
      return;
    }

    if (type === 'paste' || type === 'tool_paste') {
      P(10, 2, 4, 3, '#38bdf8'); // plunger top
      P(11, 5, 2, 3, '#94a3b8');
      P(8, 8, 8, 10, '#0b0912');
      P(9, 9, 6, 8, '#e2e8f0');
      P(10, 11, 4, 5, '#64748b'); // paste inside
      P(10, 18, 4, 2, '#475569');
      P(11, 20, 2, 2, '#94a3b8'); // tip
      P(11, 22, 2, 1, '#cbd5e1'); // drop
      return;
    }

    if (type === 'cooler') {
      P(4, 3, 16, 18, '#0b0912');
      P(5, 4, 14, 16, '#64748b');
      for (let y = 5; y <= 17; y += 2) P(6, y, 12, 1, '#cbd5e1');
      P(7, 2, 2, 2, '#ea580c'); // copper pipes
      P(11, 2, 2, 2, '#ea580c');
      P(15, 2, 2, 2, '#ea580c');
      P(7, 7, 10, 10, '#1e293b');
      P(8, 8, 8, 8, '#38bdf8');
      P(10, 10, 4, 4, '#0f172a');
      return;
    }

    if (type === 'ram') {
      P(5, 3, 5, 18, '#0b0912');
      P(6, 4, 3, 16, '#1e293b');
      P(6, 4, 3, 2, '#4deeea'); // RGB top
      P(7, 7, 1, 9, '#a78bfa');
      P(6, 19, 3, 2, '#fbbf24'); // gold pins

      P(13, 3, 5, 18, '#0b0912');
      P(14, 4, 3, 16, '#1e293b');
      P(14, 4, 3, 2, '#f472b6'); // RGB top
      P(15, 7, 1, 9, '#38bdf8');
      P(14, 19, 3, 2, '#fbbf24');
      return;
    }

    if (type === 'ssd') {
      P(2, 8, 20, 8, '#0b0912');
      P(3, 9, 18, 6, '#0f172a');
      P(3, 10, 2, 4, '#fbbf24'); // M.2 connector
      P(7, 10, 4, 4, '#334155'); // controller
      P(8, 11, 2, 2, '#4deeea');
      P(12, 10, 4, 4, '#1e293b'); // NAND
      P(17, 10, 3, 4, '#1e293b');
      P(20, 11, 1, 2, '#cbd5e1'); // screw notch
      return;
    }

    if (type === 'gpu') {
      P(2, 6, 20, 12, '#0b0912');
      P(3, 7, 18, 10, '#1e293b');
      P(3, 7, 18, 2, '#4ade80'); // accent bar
      // 2 pixel fans
      P(5, 10, 6, 6, '#0f172a');
      P(7, 12, 2, 2, '#4deeea');
      P(13, 10, 6, 6, '#0f172a');
      P(15, 12, 2, 2, '#4deeea');
      P(4, 17, 10, 2, '#fbbf24'); // PCIe gold edge
      return;
    }

    if (type === 'psu') {
      P(2, 5, 20, 14, '#0b0912');
      P(3, 6, 18, 12, '#1e293b');
      P(5, 8, 8, 8, '#0f172a'); // fan grille
      P(7, 10, 4, 4, '#475569');
      P(15, 8, 5, 3, '#fbbf24'); // 80+ label
      P(15, 13, 4, 3, '#f43f5e'); // power switch
      return;
    }

    if (type === 'fans') {
      P(4, 4, 16, 16, '#0b0912');
      P(5, 5, 14, 14, '#1e293b');
      P(6, 6, 12, 12, '#0f172a');
      P(11, 6, 2, 12, '#4deeea');
      P(6, 11, 12, 2, '#4deeea');
      P(10, 10, 4, 4, '#fbbf24');
      return;
    }

    if (type === 'cable' || type.startsWith('cable_')) {
      const col = type === 'cable_24' ? '#fbbf24'
        : type === 'cable_cpu' ? '#38bdf8'
        : type === 'cable_gpu' ? '#4ade80'
        : '#f472b6';
      P(3, 8, 5, 8, '#0b0912');
      P(4, 9, 3, 6, '#475569');
      P(8, 10, 8, 4, col);
      P(16, 8, 5, 8, '#0b0912');
      P(17, 9, 3, 6, '#fbbf24');
      return;
    }

    if (type === 'bios') {
      P(2, 3, 20, 15, '#0b0912');
      P(3, 4, 18, 13, '#1d4ed8');
      P(4, 5, 16, 2, '#93c5fd');
      P(5, 9, 10, 1, '#ffffff');
      P(5, 11, 13, 1, '#4ade80');
      P(5, 13, 8, 1, '#fbbf24');
      P(9, 18, 6, 2, '#475569');
      P(6, 20, 12, 2, '#64748b');
      return;
    }
  }

  // ==================== Prof.Watcharapong PIXEL PORTRAIT ====================
  function drawMentor(canvas, mood = 'guide', tick = 0) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const s = Math.floor(canvas.width / 16);
    const P = (x, y, w, h, c) => px(ctx, x * s, y * s, w * s, h * s, c);

    // BG
    P(0, 0, 16, 16, '#141122');
    // Hair
    P(4, 1, 8, 3, '#3b2f5c');
    P(3, 2, 10, 3, '#4c3d75');
    P(10, 1, 2, 1, '#7c6aad');
    // Face
    P(4, 4, 8, 7, '#fcd5b5');
    P(3, 6, 1, 2, '#f5b889');
    P(12, 6, 1, 2, '#f5b889');
    // Glasses
    const blink = (tick % 120) > 114;
    P(4, 6, 3, 3, '#0f172a');
    P(9, 6, 3, 3, '#0f172a');
    P(7, 7, 2, 1, '#0f172a');
    if (!blink) {
      P(5, 7, 2, 1, '#4deeea');
      P(10, 7, 2, 1, '#4deeea');
    } else {
      P(5, 7, 2, 1, '#fcd5b5');
      P(10, 7, 2, 1, '#fcd5b5');
    }
    // Mouth by mood
    if (mood === 'celebrate' || mood === 'happy') {
      P(6, 9, 4, 1, '#9f1239');
      P(7, 10, 2, 1, '#fb7185');
    } else if (mood === 'warn') {
      P(6, 9, 4, 1, '#f43f5e');
      P(13, 2, 2, 4, '#fbbf24'); // exclamation
      P(13, 7, 2, 1, '#fbbf24');
    } else {
      P(7, 9, 2, 1, '#9a5b3b');
    }
    // Lab coat + tie
    P(3, 11, 10, 5, '#e2e8f0');
    P(6, 11, 4, 5, '#1e293b');
    P(7, 11, 2, 4, '#38bdf8'); // cyan tie
    P(4, 13, 2, 1, '#94a3b8'); // pocket
  }

  // ==================== CLIENT PIXEL AVATARS ====================
  function drawClientAvatar(canvas, type = 'student') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const s = Math.floor(canvas.width / 16);
    const P = (x, y, w, h, c) => px(ctx, x * s, y * s, w * s, h * s, c);

    const presets = {
      student: { bg: '#1e1b33', hair: '#271c19', shirt: '#38bdf8', acc: '#f472b6' },
      gamer: { bg: '#141d2e', hair: '#7c3aed', shirt: '#10b981', acc: '#fbbf24' },
      teacher: { bg: '#1f2438', hair: '#334155', shirt: '#f59e0b', acc: '#e2e8f0' },
      creator: { bg: '#281833', hair: '#e11d48', shirt: '#a855f7', acc: '#4deeea' },
      scientist: { bg: '#0f222d', hair: '#cbd5e1', shirt: '#f8fafc', acc: '#38bdf8' }
    };
    const p = presets[type] || presets.student;
    P(0, 0, 16, 16, p.bg);
    P(4, 2, 8, 3, p.hair);
    P(3, 3, 10, 4, p.hair);
    P(4, 5, 8, 6, '#fdd5b1');
    // Eyes
    P(5, 7, 2, 2, '#0f172a');
    P(9, 7, 2, 2, '#0f172a');
    P(5, 7, 1, 1, '#ffffff');
    P(9, 7, 1, 1, '#ffffff');
    // Smile
    P(7, 9, 2, 1, '#b45309');
    // Gamer headphones
    if (type === 'gamer') {
      P(2, 5, 2, 4, p.acc);
      P(12, 5, 2, 4, p.acc);
      P(4, 1, 8, 1, p.acc);
    }
    // Shirt
    P(3, 11, 10, 5, p.shirt);
    P(6, 12, 4, 2, p.acc);
  }

  // ==================== HERO ANIMATED PC SHOWCASE ====================
  function drawHeroPC(canvas, tick) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 200, 160);

    // Desk & dark pixel room
    px(ctx, 0, 0, 200, 160, '#110f1d');
    // Subtle wall grid
    for (let x = 0; x < 200; x += 16) px(ctx, x, 0, 1, 134, '#181428');
    for (let y = 0; y < 134; y += 16) px(ctx, 0, y, 200, 1, '#181428');
    // Desk
    px(ctx, 0, 134, 200, 26, '#2a223d');
    px(ctx, 0, 134, 200, 3, '#463a66');

    // Monitor (left)
    box(ctx, 12, 42, 82, 56, '#091529', '#07060d', '#3b4261', '#1a1e30');
    px(ctx, 16, 46, 74, 48, '#0b1e3d');
    // Pixel screen content
    px(ctx, 18, 48, 70, 7, '#1d4ed8');
    px(ctx, 20, 50, 28, 3, '#e0f2fe');
    px(ctx, 20, 59, 44, 2, '#4ade80');
    px(ctx, 20, 64, 58, 2, '#38bdf8');
    px(ctx, 20, 69, 36, 2, '#fbbf24');
    // Animated CPU graph bars on monitor
    for (let i = 0; i < 8; i++) {
      const bh = 6 + Math.floor(Math.abs(Math.sin((tick * 0.08) + i)) * 14);
      px(ctx, 20 + i * 8, 90 - bh, 5, bh, i % 2 === 0 ? '#4deeea' : '#a78bfa');
    }
    // Stand
    px(ctx, 48, 98, 10, 24, '#2d334d');
    px(ctx, 36, 122, 34, 6, '#3d4566');
    // Keyboard
    box(ctx, 16, 138, 70, 12, '#1e2236', '#090a12', '#3a4263');
    for (let i = 0; i < 12; i++) {
      px(ctx, 20 + i * 5, 141, 3, 2, rgbColor(tick, i));
      px(ctx, 20 + i * 5, 145, 3, 2, '#64748b');
    }

    // Pixel Gaming PC Tower (right)
    box(ctx, 108, 24, 80, 110, '#1a1f33', '#080910', '#414b70', '#0e111d');
    // Glass window
    px(ctx, 114, 30, 54, 76, '#0d111c');
    // Motherboard
    px(ctx, 117, 34, 42, 54, '#1e293b');
    // CPU RGB Cooler
    drawPixelFan(ctx, 124, 40, 18, tick, true, true, '#4deeea');
    // RGB RAM
    px(ctx, 146, 38, 3, 18, rgbColor(tick, 1));
    px(ctx, 151, 38, 3, 18, rgbColor(tick, 3));
    // GPU
    box(ctx, 118, 66, 44, 14, '#27324a', '#090b12', '#4ade80');
    px(ctx, 122, 70, 36, 2, rgbColor(tick, 5));
    // PSU Shroud
    box(ctx, 114, 108, 54, 20, '#131726', '#080a12', '#2c3452');
    px(ctx, 120, 115, 22, 6, '#fbbf24');
    // Front RGB Fans (3 stacked)
    drawPixelFan(ctx, 170, 34, 14, tick, true, true, '#4deeea');
    drawPixelFan(ctx, 170, 56, 14, tick, true, true, '#a78bfa');
    drawPixelFan(ctx, 170, 78, 14, tick, true, true, '#f472b6');

    // Floating pixel sparkles
    for (let i = 0; i < 4; i++) {
      const sx = 112 + ((tick + i * 37) % 72);
      const sy = 20 - Math.floor(((tick * 0.4 + i * 19) % 16));
      px(ctx, sx, sy, 2, 2, i % 2 === 0 ? '#4deeea' : '#fbbf24');
    }
  }

  // ==================== WORKBENCH HITBOXES (320x220) ====================
  const ZONES = {
    mb:        { x: 62,  y: 24,  w: 150, h: 128, label: 'ช่องเมนบอร์ด (Motherboard)' },
    cpu:       { x: 96,  y: 42,  w: 40,  h: 40,  label: 'ซ็อกเก็ตซีพียู (CPU Socket)' },
    ram:       { x: 150, y: 34,  w: 38,  h: 56,  label: 'สล็อตแรม Dual Channel (A2/B2)' },
    ssd:       { x: 94,  y: 86,  w: 58,  h: 16,  label: 'สล็อต M.2 NVMe SSD' },
    gpu:       { x: 60,  y: 108, w: 154, h: 30,  label: 'สล็อตการ์ดจอ PCIe x16' },
    psu:       { x: 46,  y: 160, w: 96,  h: 40,  label: 'ช่องพาวเวอร์ซัพพลาย (PSU)' },
    fans:      { x: 248, y: 30,  w: 32,  h: 112, label: 'จุดติดพัดลมเคส (Case Fans)' },
    fansRear:  { x: 36,  y: 34,  w: 24,  h: 48,  label: 'พัดลมหลังเคส (Rear Exhaust)' },
    cable_24:  { x: 193, y: 46,  w: 18,  h: 40,  label: 'หัวต่อไฟเมนบอร์ด 24-Pin ATX' },
    cable_cpu: { x: 74,  y: 22,  w: 22,  h: 14,  label: 'หัวต่อไฟซีพียู 8-Pin EPS' },
    cable_fan: { x: 134, y: 24,  w: 18,  h: 14,  label: 'หัวต่อพัดลม CPU_FAN' },
    cable_gpu: { x: 182, y: 102, w: 22,  h: 16,  label: 'หัวต่อไฟการ์ดจอ 8-Pin PCIe' }
  };

  // ==================== MAIN WORKBENCH PC CASE RENDERER (320x220) ====================
  function drawWorkbench(ctx, state, tick, particles) {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 320, 220);

    // 1. Workshop desk backdrop
    px(ctx, 0, 0, 320, 220, '#100e1a');
    for (let x = 0; x < 320; x += 16) px(ctx, x, 0, 1, 220, '#161326');
    for (let y = 0; y < 220; y += 16) px(ctx, 0, y, 320, 1, '#161326');

    // Workbench mat beneath case
    px(ctx, 18, 208, 284, 8, '#1e293b');
    px(ctx, 18, 208, 284, 2, '#334155');

    // 2. PC Case Outer Chassis (x:34, y:12, w:252, h:196)
    // Rubber feet
    px(ctx, 44, 206, 22, 4, '#090a10');
    px(ctx, 254, 206, 22, 4, '#090a10');

    // Main outer steel frame
    box(ctx, 34, 12, 252, 196, '#1a1f30', '#07080f', '#424c6e', '#0d101c');
    // Interior recessed dark cavity
    px(ctx, 42, 20, 236, 180, '#111421');

    // Top mesh vents
    for (let x = 76; x < 240; x += 6) {
      px(ctx, x, 14, 4, 4, '#090b12');
    }
    // Front mesh panel (right edge)
    px(ctx, 278, 24, 6, 172, '#0b0e17');
    for (let y = 28; y < 190; y += 4) {
      px(ctx, 279, y, 4, 2, '#27304a');
    }
    // Power LED on top-right of case
    const ledCol = state.poweredOn ? '#4ade80' : (state.psuSwitch ? '#fbbf24' : '#334155');
    px(ctx, 266, 14, 10, 4, '#090b12');
    px(ctx, 268, 15, 6, 2, ledCol);

    // PSU Shroud divider line (bottom section)
    box(ctx, 42, 156, 236, 6, '#232940', '#0a0c14', '#394263');
    // PSU bay interior
    px(ctx, 42, 162, 236, 38, '#0c0f1a');
    // Cable routing grommets (rubber holes in backplate)
    const grommets = [[218, 48, 10, 26], [218, 96, 10, 26], [156, 148, 22, 6]];
    grommets.forEach(([gx, gy, gw, gh]) => {
      box(ctx, gx, gy, gw, gh, '#08090f', '#252c42');
    });

    // Motherboard Standoffs (9 brass dots when MB not installed)
    if (!state.installed.mb) {
      const sx = [68, 136, 204];
      const sy = [30, 86, 144];
      sx.forEach((x) => sy.forEach((y) => {
        px(ctx, x - 2, y - 2, 5, 5, '#090b12');
        px(ctx, x - 1, y - 1, 3, 3, '#d97706');
        px(ctx, x, y, 1, 1, '#fef08a');
      }));
    }

    // 3. Installed Motherboard
    const mbPart = state.parts.mb;
    if (state.installed.mb) {
      const mbCol = mbPart.color || '#1e293b';
      const mbAcc = mbPart.accent || '#38bdf8';
      box(ctx, 62, 24, 150, 128, mbCol, '#080a10', '#475569', '#0f172a');

      // Decorative pixel PCB traces
      px(ctx, 84, 82, 62, 1, '#334155');
      px(ctx, 84, 84, 48, 1, '#334155');
      px(ctx, 148, 96, 40, 1, '#334155');
      px(ctx, 190, 86, 1, 44, '#334155');

      // Rear I/O Armor + VRM Heatsinks
      box(ctx, 64, 28, 16, 48, '#0f172a', '#06080d', mbAcc);
      px(ctx, 67, 34, 10, 3, mbAcc);
      box(ctx, 84, 28, 46, 10, '#334155', '#090b12', '#64748b');
      box(ctx, 82, 42, 10, 34, '#334155', '#090b12', '#64748b');

      // 8-Pin CPU EPS Header
      box(ctx, 76, 24, 14, 7, '#0f172a', '#05060a', state.cables.cpu ? '#4ade80' : '#fbbf24');
      // CPU_FAN Header
      box(ctx, 136, 26, 12, 6, '#0f172a', '#05060a', state.cables.fan ? '#4ade80' : '#f472b6');

      // CPU Socket (x:98, y:44, w:36, h:36)
      box(ctx, 98, 44, 36, 36, '#334155', '#090b12', '#94a3b8');
      px(ctx, 102, 48, 28, 28, '#1e293b');
      // Socket pins grid
      for (let py = 50; py < 74; py += 3) {
        for (let px0 = 104; px0 < 128; px0 += 3) {
          px(ctx, px0, py, 2, 2, '#ca8a04');
        }
      }
      // Corner alignment triangle
      px(ctx, 102, 72, 4, 4, '#fbbf24');

      // 4 RAM DIMM Slots (A1, A2, B1, B2)
      for (let i = 0; i < 4; i++) {
        const rx = 154 + i * 8;
        const isDualSlot = (i === 1 || i === 3); // A2, B2
        box(ctx, rx, 36, 5, 50, isDualSlot ? '#0c4a6e' : '#0f172a', '#05070c', isDualSlot ? '#38bdf8' : '#334155');
        px(ctx, rx + 1, 34, 3, 2, '#94a3b8'); // top latch
        px(ctx, rx + 1, 86, 3, 2, '#94a3b8'); // bottom latch
      }

      // 24-Pin ATX Header
      box(ctx, 198, 50, 9, 32, '#0f172a', '#05060a', state.cables.atx24 ? '#4ade80' : '#fbbf24');

      // M.2 NVMe Slot
      box(ctx, 96, 89, 54, 10, '#0f172a', '#05070c', '#475569');
      px(ctx, 98, 91, 5, 6, '#fbbf24'); // connector
      px(ctx, 146, 93, 2, 2, '#cbd5e1'); // standoff

      // PCIe x16 Metal Slot
      box(ctx, 74, 114, 78, 8, '#0f172a', '#94a3b8');
      px(ctx, 76, 117, 74, 2, '#020617');
      // Secondary PCIe x4 slot
      box(ctx, 74, 134, 44, 6, '#0f172a', '#475569');

      // Chipset Heatsink + CMOS Battery
      box(ctx, 174, 116, 28, 24, '#0f172a', '#06080d', mbAcc);
      px(ctx, 178, 121, 20, 4, mbAcc);
      // CMOS Battery
      px(ctx, 156, 128, 10, 10, '#64748b');
      px(ctx, 158, 130, 6, 6, '#cbd5e1');

      // Corner screws (installed)
      [[66, 28], [206, 28], [66, 146], [206, 146]].forEach(([sx, sy]) => {
        px(ctx, sx, sy, 3, 3, '#cbd5e1');
        px(ctx, sx + 1, sy + 1, 1, 1, '#475569');
      });
    }

    // 4. Installed CPU
    if (state.installed.cpu) {
      box(ctx, 101, 47, 30, 30, '#15803d', '#062010', '#4ade80');
      box(ctx, 105, 51, 22, 22, '#cbd5e1', '#475569', '#f8fafc', '#64748b');
      px(ctx, 103, 73, 3, 3, '#fbbf24'); // gold triangle
      px(ctx, 110, 58, 12, 2, '#475569');
      px(ctx, 112, 62, 8, 2, '#64748b');
    }

    // 5. Thermal Paste Dab on CPU (visible before cooler is installed)
    if (state.installed.cpu && !state.installed.cooler && state.pasteAmount > 0) {
      const r = Math.max(2, Math.min(11, Math.round(state.pasteAmount / 9)));
      const col = state.pasteAmount > 75 ? '#94a3b8' : '#cbd5e1';
      px(ctx, 116 - r, 62 - r, r * 2, r * 2, '#475569');
      px(ctx, 116 - r + 1, 62 - r + 1, r * 2 - 2, r * 2 - 2, col);
      px(ctx, 116 - Math.floor(r / 2), 62 - Math.floor(r / 2), 2, 2, '#f8fafc');
    }

    // 6. Installed M.2 NVMe SSD
    if (state.installed.ssd) {
      box(ctx, 98, 89, 51, 10, '#0f172a', '#020617', '#38bdf8');
      px(ctx, 104, 91, 12, 6, '#1e293b');
      px(ctx, 120, 91, 16, 6, '#334155');
      px(ctx, 122, 93, 12, 2, '#4deeea');
      px(ctx, 146, 92, 3, 4, '#e2e8f0'); // M.2 screw
    }

    // 7. Installed RAM Sticks (Dual Channel A2 & B2)
    if (state.installed.ram) {
      const ramPart = state.parts.ram;
      [154 + 8, 154 + 24].forEach((rx, idx) => {
        box(ctx, rx, 35, 6, 52, '#1e293b', '#05070c', '#475569');
        const led = ramPart.rgb && state.poweredOn
          ? rgbColor(tick, idx * 3)
          : (ramPart.rgb ? '#38bdf8' : '#64748b');
        px(ctx, rx + 1, 37, 4, 48, led);
        px(ctx, rx + 2, 40, 2, 42, '#0f172a');
        if (ramPart.rgb && state.poweredOn) {
          px(ctx, rx + 2, 42 + ((tick + idx * 8) % 36), 2, 6, '#ffffff');
        }
      });
    }

    // 8. Installed CPU Cooler
    if (state.installed.cooler) {
      const style = state.parts.cooler.style || 'tower';
      const fanSpin = state.poweredOn && state.cables.fan;
      if (style === 'aio') {
        // Top 240mm Radiator
        box(ctx, 92, 20, 100, 11, '#1e293b', '#05070c', '#475569');
        for (let x = 96; x < 188; x += 4) px(ctx, x, 22, 2, 7, '#0f172a');
        // Pixel AIO Tubes
        drawPixelCable(ctx, [[128, 54], [142, 42], [150, 31]], '#1e293b', '#475569', 3);
        drawPixelCable(ctx, [[124, 50], [134, 38], [142, 31]], '#1e293b', '#475569', 3);
        // Pump Block on CPU
        box(ctx, 100, 46, 32, 32, '#0f172a', '#04060b', '#4deeea');
        const ringCol = fanSpin ? rgbColor(tick, 2) : '#334155';
        box(ctx, 106, 52, 20, 20, '#0b1120', ringCol);
        px(ctx, 112, 58, 8, 8, fanSpin ? '#4deeea' : '#475569');
      } else if (style === 'tower') {
        // Heatsink Fins + Copper Heatpipes
        box(ctx, 96, 40, 40, 44, '#475569', '#090b12', '#94a3b8');
        for (let y = 43; y < 81; y += 3) px(ctx, 98, y, 36, 1, '#cbd5e1');
        // Copper tips
        [102, 110, 118, 126].forEach((cx) => px(ctx, cx, 38, 3, 3, '#ea580c'));
        // RGB Fan on tower
        drawPixelFan(ctx, 101, 47, 30, tick, fanSpin, true, '#4deeea');
      } else {
        // Stock Cooler
        drawPixelFan(ctx, 100, 46, 32, tick, fanSpin, false, '#38bdf8');
      }
    }

    // 9. Installed PSU (bottom left)
    if (state.installed.psu) {
      box(ctx, 46, 164, 94, 34, '#1e293b', '#07090f', '#475569', '#0f172a');
      // Honeycomb grille
      for (let gx = 52; gx < 84; gx += 4) {
        for (let gy = 170; gy < 192; gy += 4) {
          px(ctx, gx, gy, 2, 2, '#090b12');
        }
      }
      // Wattage sticker
      box(ctx, 92, 170, 42, 16, '#0f172a', '#fbbf24');
      px(ctx, 96, 174, 24, 3, '#fbbf24');
      px(ctx, 96, 179, 34, 3, '#e2e8f0');
      // Rear I/O switch indicator on left side of PSU
      box(ctx, 37, 176, 9, 12, '#090b12', '#475569');
      px(ctx, 39, 178, 5, 8, state.psuSwitch ? '#4ade80' : '#f43f5e');
    }

    // 10. Power Cables (drawn over MB & PSU)
    if (state.cables.atx24) {
      drawPixelCable(ctx, [[140, 176], [222, 176], [222, 66], [204, 66]], '#334155', '#fbbf24', 4);
      box(ctx, 198, 52, 9, 28, '#1e293b', '#000', '#fbbf24');
    }
    if (state.cables.cpu) {
      drawPixelCable(ctx, [[132, 164], [226, 152], [226, 22], [83, 22], [83, 28]], '#1e293b', '#38bdf8', 3);
      box(ctx, 77, 24, 12, 7, '#0c4a6e', '#000', '#38bdf8');
    }
    if (state.cables.fan) {
      drawPixelCable(ctx, [[128, 46], [136, 36], [142, 30]], '#334155', '#f472b6', 2);
      box(ctx, 137, 26, 10, 6, '#831843', '#000', '#f472b6');
    }

    // 11. Installed GPU (PCIe x16)
    if (state.installed.gpu) {
      const g = state.parts.gpu;
      const gw = g.fans === 3 ? 156 : (g.fans === 2 ? 136 : 104);
      box(ctx, 60, 110, gw, 26, g.color || '#1e293b', '#06080d', '#64748b', '#0b0f19');
      // Glowing side LED strip
      const stripCol = state.poweredOn && state.cables.gpu ? (g.accent || '#4ade80') : '#334155';
      px(ctx, 64, 113, gw - 12, 3, stripCol);
      // Rear bracket
      px(ctx, 56, 108, 4, 30, '#94a3b8');
      // GPU fans preview cutouts
      const fCount = g.fans || 2;
      for (let i = 0; i < fCount; i++) {
        const fx = 72 + i * 38;
        if (fx + 18 < 60 + gw) {
          drawPixelFan(ctx, fx, 118, 16, tick, state.poweredOn && state.cables.gpu, false, g.accent);
        }
      }
      // 8-Pin PCIe Power Port on GPU top-right
      box(ctx, 60 + gw - 24, 107, 14, 6, '#090b12', state.cables.gpu ? '#4ade80' : '#f43f5e');
    }

    // 12. GPU 8-Pin PCIe Cable
    if (state.cables.gpu && state.installed.gpu) {
      const g = state.parts.gpu;
      const gw = g.fans === 3 ? 156 : (g.fans === 2 ? 136 : 104);
      const gx = 60 + gw - 18;
      drawPixelCable(ctx, [[140, 184], [190, 184], [190, 146], [gx, 136], [gx, 112]], '#1e293b', '#4ade80', 3);
      box(ctx, gx - 5, 107, 12, 6, '#14532d', '#000', '#4ade80');
    }

    // 13. Case Airflow Fans (Rear Exhaust + 2 Front Intake)
    if (state.installed.fans) {
      const spin = state.poweredOn;
      // Rear Exhaust
      drawPixelFan(ctx, 40, 42, 20, tick, spin, true, '#fb923c');
      // Front Intake x2
      drawPixelFan(ctx, 254, 42, 22, tick, spin, true, '#38bdf8');
      drawPixelFan(ctx, 254, 72, 22, tick, spin, true, '#38bdf8');
      drawPixelFan(ctx, 254, 102, 22, tick, spin, true, '#38bdf8');
    }

    // 14. Airflow Visualization Overlay (Cool blue in right → Warm orange out left/top)
    if (state.showAirflow) {
      const offset = (tick * 2) % 40;
      // Cool air entering from right front fans
      for (let row = 0; row < 3; row++) {
        const y = 52 + row * 30;
        for (let k = 0; k < 3; k++) {
          const ax = 266 - ((offset + k * 42) % 120);
          px(ctx, ax, y, 10, 2, '#38bdf8');
          px(ctx, ax, y - 1, 2, 4, '#4deeea');
        }
      }
      // Warm air exiting left & top
      for (let k = 0; k < 2; k++) {
        const ax = 128 - ((offset + k * 48) % 90);
        px(ctx, ax, 50, 10, 2, '#fb923c');
        px(ctx, ax, 49, 2, 4, '#f43f5e');
        // Rising hot air out top
        const ay = 104 - ((offset + k * 42) % 86);
        px(ctx, 140 + k * 34, ay, 2, 9, '#fb923c');
        px(ctx, 139 + k * 34, ay, 4, 2, '#f43f5e');
      }
    }

    // 15. Tempered Glass Side Panel Overlay
    if (state.glassClosed) {
      ctx.fillStyle = 'rgba(148, 210, 255, 0.10)';
      ctx.fillRect(42, 20, 236, 180);
      // Diagonal pixel sheen lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let i = 0; i < 60; i++) {
        ctx.fillRect(58 + i, 24 + i * 2, 6, 2);
      }
      // Thumb screws on corners
      [[45, 23], [271, 23], [45, 193], [271, 193]].forEach(([tx, ty]) => {
        px(ctx, tx, ty, 4, 4, '#090b12');
        px(ctx, tx + 1, ty + 1, 2, 2, '#94a3b8');
      });
    }

    // 16. Interactive Drop Zone Highlights (Guide / Selected Item)
    const activeZones = state.highlightZones || [];
    const pulse = Math.floor(tick / 12) % 2 === 0;
    activeZones.forEach((zk) => {
      const z = ZONES[zk];
      if (!z) return;
      ctx.fillStyle = pulse ? 'rgba(77, 238, 234, 0.22)' : 'rgba(251, 191, 36, 0.18)';
      ctx.fillRect(z.x, z.y, z.w, z.h);
      ctx.strokeStyle = pulse ? '#4deeea' : '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(z.x + 1, z.y + 1, z.w - 2, z.h - 2);
    });

    // Hover outline
    if (state.hoverZone && ZONES[state.hoverZone]) {
      const hz = ZONES[state.hoverZone];
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(hz.x, hz.y, hz.w, hz.h);
    }

    // 17. Pixel Spark / Install Confetti Particles
    if (particles && particles.length) {
      particles.forEach((p) => {
        px(ctx, p.x, p.y, p.size, p.size, p.color);
      });
    }
  }

  // ==================== 16-BIT PIXEL ART CERTIFICATE RENDERER ====================
  function drawCertificate(canvas, data) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const W = canvas.width;
    const H = canvas.height;

    // 1. Background & subtle pixel grid
    px(ctx, 0, 0, W, H, '#120f20');
    for (let x = 0; x < W; x += 16) px(ctx, x, 0, 1, H, '#19152b');
    for (let y = 0; y < H; y += 16) px(ctx, 0, y, W, 1, '#19152b');

    // 2. Double golden & cyan pixel border
    box(ctx, 10, 10, W - 20, H - 20, '#161329', '#fbbf24', '#fde68a', '#b45309');
    box(ctx, 18, 18, W - 36, H - 36, '#141124', '#38bdf8', '#4deeea', '#0e7490');

    // Corner pixel stars / medals
    const corners = [[24, 24], [W - 40, 24], [24, H - 40], [W - 40, H - 40]];
    corners.forEach(([cx, cy]) => {
      px(ctx, cx + 6, cy, 4, 16, '#fbbf24');
      px(ctx, cx, cy + 6, 16, 4, '#fbbf24');
      px(ctx, cx + 4, cy + 4, 8, 8, '#fef08a');
    });

    // 3. Header banner
    box(ctx, 90, 28, W - 180, 44, '#1e1b38', '#4deeea');
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4deeea';
    ctx.font = 'bold 17px "Silkscreen", monospace';
    ctx.fillText('PIXEL PC BUILDER ACADEMY', W / 2, 49);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px "Chakra Petch", sans-serif';
    ctx.fillText('ใบรับรองผลการเรียนรู้และการฝึกปฏิบัติการประกอบคอมพิวเตอร์ (CERTIFICATE OF MASTERY)', W / 2, 66);

    // 4. Student Info Row
    ctx.fillStyle = '#a8a1c7';
    ctx.font = '14px "Chakra Petch", sans-serif';
    ctx.fillText('ขอมอบเกียรติบัตรฉบับนี้ให้แก่', W / 2, 96);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Chakra Petch", sans-serif';
    ctx.fillText(data.studentName || 'นักเรียน / ผู้เรียน (ยังไม่ระบุชื่อ)', W / 2, 125);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px "Chakra Petch", sans-serif';
    const idText = data.studentId ? `รหัสนักเรียน: ${data.studentId}` : 'รหัสนักเรียน: -';
    const roomText = data.studentRoom ? `ชั้น/ห้อง: ${data.studentRoom}` : 'ชั้น/ห้อง: -';
    const diffText = `ระดับความยาก: ${data.difficultyLabel || 'NORMAL'}`;
    ctx.fillText(`${idText}   •   ${roomText}   •   ${diffText}`, W / 2, 150);

    // Divider line
    px(ctx, 56, 164, W - 112, 2, '#433c63');

    // 5. Left Pixel PC Badge + Right Overall Mastery Grade
    const offPc = document.createElement('canvas');
    offPc.width = 72;
    offPc.height = 72;
    drawIconSprite(offPc, 'pc');
    ctx.drawImage(offPc, 46, 178, 72, 72);

    // Grade Seal on right
    box(ctx, W - 134, 176, 86, 80, '#1e1b38', '#fbbf24', '#fde68a', '#b45309');
    ctx.fillStyle = '#a8a1c7';
    ctx.font = 'bold 11px "Chakra Petch", sans-serif';
    ctx.fillText('เกรดรวม', W - 91, 195);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 34px "Silkscreen", monospace';
    ctx.fillText(data.overallGrade || 'B', W - 91, 232);
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 12px "Chakra Petch", sans-serif';
    ctx.fillText(`Mastery ${data.mastery}%`, W - 91, 249);

    // Center summary text
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px "Chakra Petch", sans-serif';
    ctx.fillText('ผลการประเมินรายโหมดการเรียนรู้ (5 MODES SUMMARY)', 136, 192);
    ctx.fillStyle = '#a8a1c7';
    ctx.font = '13px "Chakra Petch", sans-serif';
    ctx.fillText(`• โหมด 1 ฝึกสอน 12 ขั้นตอน: ${data.tutorialText}`, 136, 214);
    ctx.fillText(`• โหมด 2 ทดสอบจับเวลา: ${data.challengeText}`, 136, 234);
    ctx.fillText(`• โหมด 3 ภารกิจจัดสเปก: ${data.missionsText}   |   โหมด 4 ศูนย์ซ่อม: ${data.repairsText}`, 136, 254);

    // 6. Five Metric Pixel Boxes
    const metrics = [
      { label: 'โหมดฝึกสอน', val: data.tutorialShort, col: '#4ade80' },
      { label: 'จับเวลาดีที่สุด', val: data.bestTimeText, col: '#38bdf8' },
      { label: 'ภารกิจจัดสเปก', val: data.missionsShort, col: '#fbbf24' },
      { label: 'ศูนย์ซ่อม BIOS', val: data.repairsShort, col: '#f472b6' },
      { label: 'แบบทดสอบวัดผล', val: data.quizShort, col: '#a78bfa' }
    ];
    const boxW = 118;
    const gap = 10;
    const startX = Math.floor((W - (metrics.length * boxW + (metrics.length - 1) * gap)) / 2);

    metrics.forEach((m, idx) => {
      const bx = startX + idx * (boxW + gap);
      box(ctx, bx, 272, boxW, 56, '#1a1730', '#433c63');
      px(ctx, bx + 2, 274, boxW - 4, 3, m.col);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#a8a1c7';
      ctx.font = '11px "Chakra Petch", sans-serif';
      ctx.fillText(m.label, bx + boxW / 2, 293);
      ctx.fillStyle = m.col;
      ctx.font = 'bold 15px "Chakra Petch", sans-serif';
      ctx.fillText(m.val, bx + boxW / 2, 316);
    });

    // 7. Footer: Verification Code + Instructor Sign-off
    const offProf = document.createElement('canvas');
    offProf.width = 48;
    offProf.height = 48;
    drawMentor(offProf, 'celebrate', 0);
    box(ctx, W - 216, 344, 52, 52, '#0f0d1a', '#fbbf24');
    ctx.drawImage(offProf, W - 214, 346, 48, 48);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Chakra Petch", sans-serif';
    ctx.fillText(`รหัสตรวจสอบ (Verify Code): ${data.verifyCode}`, 42, 362);
    ctx.fillText(`วันที่ออกรายงาน: ${data.dateStr}`, 42, 381);
    ctx.fillStyle = '#4ade80';
    ctx.fillText(`เหรียญตราที่ปลดล็อก: ${data.badgesText}`, 42, 400);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px "Chakra Petch", sans-serif';
    ctx.fillText('Prof.Watcharapong', W - 154, 366);
    ctx.fillStyle = '#a8a1c7';
    ctx.font = '12px "Chakra Petch", sans-serif';
    ctx.fillText('นายวัชรพงษ์ สุขแช่ม', W - 154, 384);
    ctx.fillText('ครูวิทยาลัยเทคนิคจันทบุรี', W - 154, 400);
  }

  return {
    ZONES,
    drawIconSprite,
    drawMentor,
    drawClientAvatar,
    drawHeroPC,
    drawWorkbench,
    drawCertificate
  };
})();
