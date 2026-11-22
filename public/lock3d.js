(function () {
  if (customElements.get('pentadoor-lock')) return;
  const V = '0.160.0';
  class PentadoorLock extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      this.style.display = 'block'; this.style.position = 'relative';
      if (!this.style.width) this.style.width = '100%';
      if (!this.style.height) this.style.height = '100%';
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:absolute;inset:0;touch-action:pan-y;cursor:grab;';
      this.appendChild(wrap); this._wrap = wrap;
      const hint = document.createElement('div');
      hint.textContent = 'גררו לסיבוב';
      hint.style.cssText = 'position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font:400 13px Heebo,sans-serif;color:#8E8E93;pointer-events:none;transition:opacity .6s;';
      this.appendChild(hint); this._hint = hint;
      this._load();
    }
    disconnectedCallback() { this._dead = true; if (this._ro) this._ro.disconnect(); if (this._renderer) this._renderer.dispose(); }
    async _load() {
      const THREE = await import(`https://esm.sh/three@${V}`);
      const { RoomEnvironment } = await import(`https://esm.sh/three@${V}/examples/jsm/environments/RoomEnvironment.js`);
      if (!this._dead) this._build(THREE, RoomEnvironment);
    }
    _build(THREE, RoomEnvironment) {
      const wrap = this._wrap;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
      wrap.appendChild(renderer.domElement); renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
      this._renderer = renderer;
      const scene = new THREE.Scene();
      const pm = new THREE.PMREMGenerator(renderer);
      scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture;
      const camera = new THREE.PerspectiveCamera(24, 1, 1, 1000);
      const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-25, 50, 60); scene.add(key);
      const rimL = new THREE.DirectionalLight(0xe0a070, 2.2); rimL.position.set(-60, 10, -30); scene.add(rimL);
      const rimR = new THREE.DirectionalLight(0xbfd4ff, 1.6); rimR.position.set(60, 20, -30); scene.add(rimR);

      const slab = (w, h, d, r, b = 0.22) => {
        const W = w - 2 * b, H = h - 2 * b, R = Math.min(r, W / 2, H / 2), s = new THREE.Shape(), x = -W / 2, y = -H / 2;
        s.moveTo(x + R, y); s.lineTo(x + W - R, y); s.quadraticCurveTo(x + W, y, x + W, y + R);
        s.lineTo(x + W, y + H - R); s.quadraticCurveTo(x + W, y + H, x + W - R, y + H);
        s.lineTo(x + R, y + H); s.quadraticCurveTo(x, y + H, x, y + H - R);
        s.lineTo(x, y + R); s.quadraticCurveTo(x, y, x + R, y);
        const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.01, d - 2 * b), bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 6, curveSegments: 16 });
        g.center(); return g;
      };
      const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
      const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
      const brushed = canvasTex(512, 512, (ctx, w, h) => { ctx.fillStyle = '#7a7a7a'; ctx.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { const v = 100 + Math.random() * 60; ctx.fillStyle = `rgba(${v},${v},${v},.3)`; ctx.fillRect(Math.random() * w, 0, 1, h); } });
      brushed.wrapS = brushed.wrapT = THREE.RepeatWrapping; brushed.repeat.set(0.12, 0.12); brushed.colorSpace = THREE.NoColorSpace;

      const glass = new THREE.MeshPhysicalMaterial({ color: 0x030304, metalness: 0.2, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6 });
      const metal = new THREE.MeshPhysicalMaterial({ color: 0x5a5b61, metalness: 0.8, roughness: 0.38, roughnessMap: brushed, clearcoat: 0.3, clearcoatRoughness: 0.4, envMapIntensity: 1.3 });
      const satin = new THREE.MeshPhysicalMaterial({ color: 0x26262a, metalness: 0.6, roughness: 0.42, roughnessMap: brushed, clearcoat: 0.35, clearcoatRoughness: 0.35, envMapIntensity: 1.2 });
      const decal = (tex, w, h) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));

      const root = new THREE.Group(); scene.add(root);
      // ----- outside unit
      const F = new THREE.Group(); F.position.x = 5.2; root.add(F);
      const fh = new THREE.Mesh(slab(7, 16, 1.3, 0.9, 0.32), glass); fh.position.set(0, 9, 0); F.add(fh);
      const faceTex = canvasTex(700, 1600, (ctx, w) => {
        const px = w * 0.3, py = 64, pw = w * 0.4, ph = 84;
        rr(ctx, px, py, pw, ph, ph / 2); ctx.fillStyle = '#121316'; ctx.fill(); ctx.strokeStyle = '#2b2d31'; ctx.lineWidth = 3; ctx.stroke();
        [w * 0.42, w * 0.58].forEach(cx => { const g = ctx.createRadialGradient(cx - 6, py + ph / 2 - 6, 2, cx, py + ph / 2, 28); g.addColorStop(0, '#6a7a9a'); g.addColorStop(0.35, '#1a2030'); g.addColorStop(1, '#050608'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, py + ph / 2, 28, 0, 7); ctx.fill(); ctx.strokeStyle = '#3a3d44'; ctx.lineWidth = 4; ctx.stroke(); });
        ctx.textAlign = 'center'; ctx.fillStyle = '#f2f2f2'; ctx.font = '500 40px "Courier New",monospace'; ctx.fillText('Welcome', w / 2, 330);
        ctx.font = '24px "Courier New",monospace'; ctx.fillStyle = '#9a9a9a'; ctx.fillText('2026-11-11  16:55', w / 2, 372);
        const cols = [w * 0.25, w * 0.5, w * 0.75], rows = [560, 720, 880, 1040];
        ctx.font = '300 72px "Helvetica Neue",Arial,sans-serif'; ctx.textBaseline = 'middle';
        ['1','2','3','4','5','6','7','8','9','*','0','bell'].forEach((k, i) => {
          const x = cols[i % 3], y = rows[Math.floor(i / 3)];
          ctx.shadowColor = 'rgba(255,255,255,.6)'; ctx.shadowBlur = 12;
          if (k === '*') { ctx.fillStyle = '#ff3b30'; ctx.shadowColor = 'rgba(255,60,50,.8)'; ctx.fillText('★', x, y); }
          else if (k === 'bell') { ctx.strokeStyle = '#3aa0ff'; ctx.shadowColor = 'rgba(60,160,255,.9)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 26, y + 22); ctx.quadraticCurveTo(x - 20, y + 10, x - 20, y - 8); ctx.quadraticCurveTo(x - 20, y - 32, x, y - 32); ctx.quadraticCurveTo(x + 20, y - 32, x + 20, y - 8); ctx.quadraticCurveTo(x + 20, y + 10, x + 26, y + 22); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y + 30, 6, 0, 7); ctx.stroke(); }
          else { ctx.fillStyle = '#fff'; ctx.fillText(k, x, y); }
        });
        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,255,255,.6)'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
        rr(ctx, w / 2 - 26, 790, 52, 34, 5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(w / 2 - 26, 802); ctx.lineTo(w / 2 + 26, 802); ctx.stroke();
        const lx = w / 2, ly = 1215; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(lx, ly - 18, 18, Math.PI, 0); ctx.stroke(); rr(ctx, lx - 28, ly - 18, 56, 46, 8); ctx.stroke();
      });
      const face = decal(faceTex, 6.4, 14.63); face.position.set(0, 9.4, 0.66); F.add(face);
      const body = new THREE.Mesh(slab(7.4, 26.5, 2.4, 1.7, 0.6), metal); body.position.set(0, -11.25, 0.5); F.add(body);
      const fpRing = new THREE.Mesh(slab(1.7, 1.5, 0.12, 0.35, 0.03), new THREE.MeshBasicMaterial({ color: 0x2f8dff, toneMapped: false })); fpRing.position.set(0, -0.3, 1.72); F.add(fpRing);
      const fp = new THREE.Mesh(slab(1.35, 1.15, 0.2, 0.25, 0.05), new THREE.MeshPhysicalMaterial({ color: 0x0a0d14, roughness: 0.12, clearcoat: 1, metalness: 0.3 })); fp.position.set(0, -0.3, 1.76); F.add(fp);
      const fpLed = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), new THREE.MeshBasicMaterial({ color: 0xff2a2a, toneMapped: false })); fpLed.position.set(0, -1.35, 1.71); F.add(fpLed);
      const cover = new THREE.Mesh(slab(2.5, 3.6, 0.16, 0.35, 0.06), new THREE.MeshPhysicalMaterial({ color: 0x35363a, metalness: 0.8, roughness: 0.48, roughnessMap: brushed })); cover.position.set(0, -12.8, 1.72); F.add(cover);
      const logoTex = canvasTex(800, 140, (ctx) => {
        ctx.fillStyle = '#d0d0d0'; ctx.strokeStyle = '#d0d0d0'; ctx.textBaseline = 'middle';
        ctx.save(); ctx.translate(62, 70); ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(0, -44); ctx.lineTo(38, -24); ctx.lineTo(38, 12); ctx.lineTo(0, 46); ctx.lineTo(-38, 12); ctx.lineTo(-38, -24); ctx.closePath(); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 4, 16, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 30); ctx.stroke(); ctx.restore();
        ctx.font = '600 78px Arial,sans-serif'; ctx.fillText('PENTADOR', 130, 74);
      });
      const logo = decal(logoTex, 3.4, 0.6); logo.position.set(0, -21.3, 1.71); F.add(logo);

      // ----- inside unit
      const B = new THREE.Group(); B.position.x = -5.2; root.add(B);
      const bh = new THREE.Mesh(slab(7, 13.5, 1.4, 1.0, 0.32), satin); bh.position.set(0, 12.6, 0); B.add(bh);
      const scrTex = canvasTex(600, 1150, (ctx, w, h) => {
        rr(ctx, 0, 0, w, h, 40); ctx.fillStyle = '#040405'; ctx.fill();
        const sx = 36, sy = 40, sw = w - 72, sh = 900;
        const g = ctx.createLinearGradient(0, sy, 0, sy + sh); g.addColorStop(0, '#3a4252'); g.addColorStop(0.5, '#1a1f29'); g.addColorStop(1, '#0c0e13');
        rr(ctx, sx, sy, sw, sh, 12); ctx.fillStyle = g; ctx.fill();
        const r = ctx.createRadialGradient(w / 2, sy + 330, 10, w / 2, sy + 330, 260); r.addColorStop(0, 'rgba(255,220,180,.22)'); r.addColorStop(1, 'rgba(255,220,180,0)'); ctx.fillStyle = r; ctx.fillRect(sx, sy, sw, sh);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '300 92px "Helvetica Neue",Arial,sans-serif'; ctx.fillText('16:55', w / 2, sy + 130);
        ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '500 26px Arial,sans-serif'; ctx.fillText('FRONT DOOR · LIVE', w / 2, sy + 205);
        ctx.fillStyle = '#ff3b30'; ctx.beginPath(); ctx.arc(w / 2 - 128, sy + 205, 7, 0, 7); ctx.fill();
        const x = w / 2, y = sy + 440; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x - 40, y + 34); ctx.quadraticCurveTo(x - 30, y + 16, x - 30, y - 10); ctx.quadraticCurveTo(x - 30, y - 50, x, y - 50); ctx.quadraticCurveTo(x + 30, y - 50, x + 30, y - 10); ctx.quadraticCurveTo(x + 30, y + 16, x + 40, y + 34); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y + 48, 9, 0, 7); ctx.stroke();
        [[w / 2 - 120, '#ff453a'], [w / 2 + 120, '#30d158']].forEach(([bx, col]) => { ctx.beginPath(); ctx.arc(bx, sy + 790, 54, 0, 7); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(bx, sy + 800, 22, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); });
        ctx.strokeStyle = '#55585e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(w / 2, h - 110, 32, 0, 7); ctx.stroke();
      });
      const scr = decal(scrTex, 6.3, 12.07); scr.position.set(0, 12.6, 0.71); B.add(scr);
      const bBody = new THREE.Mesh(slab(7.6, 31, 2.6, 1.3, 0.55), satin); bBody.position.set(0, -9.0, 0.6); B.add(bBody);
      const pb = new THREE.Mesh(slab(5.2, 7.6, 0.6, 0.9, 0.15), satin); pb.position.set(0, 1.0, 2.1); B.add(pb);
      const paddle = new THREE.Mesh(slab(4.6, 6.8, 2.2, 1.0, 0.55), satin); paddle.position.set(-0.2, 1.0, 3.1); B.add(paddle);
      const sb = new THREE.Mesh(slab(1.0, 1.6, 0.3, 0.3, 0.08), satin); sb.position.set(2.75, 4.6, 1.95); B.add(sb);
      [-8.6, -15.2].forEach((y, i) => {
        const k = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.08, 0.9, 64), satin); k.rotation.x = Math.PI / 2; k.position.set(0, y, 2.3); B.add(k);
        const ridge = new THREE.Mesh(slab(0.9, 3.4, 1.1, 0.42, 0.25), satin); ridge.position.set(0, y, 3.1); ridge.rotation.z = i ? 0.25 : -0.15; B.add(ridge);
      });
      const hole = new THREE.Mesh(new THREE.CircleGeometry(0.32, 24), new THREE.MeshBasicMaterial({ color: 0x000000 })); hole.position.set(0, -21.6, 1.91); B.add(hole);

      // ground shadow
      const shTex = canvasTex(512, 256, (ctx, w, h) => { const g = ctx.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.65)'); g.addColorStop(0.5, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); });
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = -23.5; scene.add(sh);
      root.position.y = 1.2;

      let off = 0, rotX = 0, vel = 0, dragging = false, lx = 0, ly = 0, idle = 10;
      const el = renderer.domElement;
      el.addEventListener('pointerdown', e => { dragging = true; lx = e.clientX; ly = e.clientY; vel = 0; wrap.style.cursor = 'grabbing'; this._hint.style.opacity = 0; el.setPointerCapture(e.pointerId); });
      el.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; vel = dx * 0.009; off += vel; if (e.pointerType === 'mouse') rotX = Math.max(-0.3, Math.min(0.3, rotX + dy * 0.004)); idle = 0; });
      const up = () => { dragging = false; wrap.style.cursor = 'grab'; };
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      const fit = () => {
        const w = wrap.clientWidth || 1, h = wrap.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h;
        const vf = THREE.MathUtils.degToRad(camera.fov) / 2, hf = Math.atan(Math.tan(vf) * camera.aspect);
        const d = Math.max(25 / Math.tan(vf), 12 / Math.tan(hf)); camera.position.set(0, 4, d); camera.lookAt(0, -1, 0); camera.updateProjectionMatrix();
      };
      this._ro = new ResizeObserver(fit); this._ro.observe(wrap); fit();
      const clock = new THREE.Clock();
      const tick = () => {
        if (this._dead) return; requestAnimationFrame(tick);
        const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime; idle += dt;
        if (!dragging) { vel *= 0.93; off += vel; if (idle > 3 && this.getAttribute('autorotate') !== 'false') { const n = Math.atan2(Math.sin(off), Math.cos(off)); off = n + (0 - n) * Math.min(1, dt * 1.2); rotX += (0 - rotX) * dt * 2; } }
        const sway = this.getAttribute('autorotate') === 'false' ? 0 : Math.sin(t * 0.45) * 0.42;
        root.rotation.set(rotX, off + sway, 0);
        fpRing.material.color.setHSL(0.59, 1, 0.5 + 0.08 * Math.sin(t * 2.2));
        renderer.render(scene, camera);
      };
      tick();
    }
  }
  customElements.define('pentadoor-lock', PentadoorLock);
})();
