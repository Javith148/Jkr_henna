import React, { useEffect, useRef } from 'react';

/**
 * HennaSelfDrawingAnimation
 * High-performance, 4K resolution vector SVG self-drawing Henna (Mehndi) animation.
 * Features:
 * - Completely transparent background.
 * - No hand, no cone, no external objects.
 * - Starts from central floral motif and grows organically into intricate symmetrical mandala pattern.
 * - Deep mahogany dark brown henna ink lines.
 * - Infinite seamless looping transition.
 */
export default function HennaSelfDrawingAnimation({ width = "100%", height = "100%", className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let pathsToAnimate = [];
    let animationFrameId = null;
    let isCancelled = false;

    const CENTER = 500;

    function addPath(d, strokeWidth, color, delayMs) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("stroke-width", strokeWidth);
      path.setAttribute("stroke", color);
      path.setAttribute("fill", "none");
      path.style.filter = "drop-shadow(0px 1px 1px rgba(59, 9, 16, 0.25))";
      container.appendChild(path);

      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.opacity = '1';

      pathsToAnimate.push({
        element: path,
        length: length,
        delay: delayMs,
        duration: 1200
      });
    }

    function addCircle(cx, cy, r, strokeWidth, color, delayMs) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("stroke-width", strokeWidth);
      circle.setAttribute("stroke", color);
      circle.setAttribute("fill", "none");
      circle.style.filter = "drop-shadow(0px 1px 1px rgba(59, 9, 16, 0.25))";
      container.appendChild(circle);

      const length = 2 * Math.PI * r;
      circle.style.strokeDasharray = length;
      circle.style.strokeDashoffset = length;
      circle.style.opacity = '1';

      pathsToAnimate.push({
        element: circle,
        length: length,
        delay: delayMs,
        duration: 1400
      });
    }

    function addDot(cx, cy, r, color, delayMs) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", color);
      circle.style.opacity = '0';
      circle.style.transform = 'scale(0)';
      circle.style.transformOrigin = `${cx}px ${cy}px`;
      circle.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      container.appendChild(circle);

      pathsToAnimate.push({
        element: circle,
        isDot: true,
        delay: delayMs,
        duration: 500
      });
    }

    function buildMandala() {
      container.innerHTML = '';
      pathsToAnimate = [];

      // Center Seed & Flower
      addCircle(CENTER, CENTER, 12, 3, "#3b0910", 0);
      addCircle(CENTER, CENTER, 28, 2, "#540d17", 200);

      // 8-Petal Central Lotus
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const x1 = CENTER + 28 * Math.cos(angle);
        const y1 = CENTER + 28 * Math.sin(angle);
        const x2 = CENTER + 65 * Math.cos(angle);
        const y2 = CENTER + 65 * Math.sin(angle);
        
        const cp1x = CENTER + 55 * Math.cos(angle - 0.3);
        const cp1y = CENTER + 55 * Math.sin(angle - 0.3);
        const cp2x = CENTER + 55 * Math.cos(angle + 0.3);
        const cp2y = CENTER + 55 * Math.sin(angle + 0.3);
        
        addPath(`M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`, 2.8, "#3b0910", 400 + i * 80);
        addDot(CENTER + 42 * Math.cos(angle), CENTER + 42 * Math.sin(angle), 3, "#3b0910", 600 + i * 80);
      }

      // Scalloped Inner Ring
      addCircle(CENTER, CENTER, 75, 2.2, "#540d17", 1100);
      addCircle(CENTER, CENTER, 85, 1.8, "#3b0910", 1300);

      for (let i = 0; i < 16; i++) {
        const a1 = (i * 22.5) * Math.PI / 180;
        const a2 = ((i + 1) * 22.5) * Math.PI / 180;
        const r = 85;
        const x1 = CENTER + r * Math.cos(a1);
        const y1 = CENTER + r * Math.sin(a1);
        const x2 = CENTER + r * Math.cos(a2);
        const y2 = CENTER + r * Math.sin(a2);
        const midA = ((i + 0.5) * 22.5) * Math.PI / 180;
        const cpx = CENTER + (r + 14) * Math.cos(midA);
        const cpy = CENTER + (r + 14) * Math.sin(midA);

        addPath(`M ${x1} ${y1} Q ${cpx} ${cpy}, ${x2} ${y2}`, 2.2, "#3b0910", 1500 + i * 50);
        addDot(CENTER + (r + 20) * Math.cos(midA), CENTER + (r + 20) * Math.sin(midA), 2.5, "#540d17", 1700 + i * 50);
      }

      // Symmetrical Paisley / Kalka Layer
      addCircle(CENTER, CENTER, 120, 2.5, "#3b0910", 2300);

      for (let i = 0; i < 8; i++) {
        const angle = (i * 45 + 22.5) * Math.PI / 180;
        const rBase = 120;
        const rTip = 230;

        const bx = CENTER + rBase * Math.cos(angle);
        const by = CENTER + rBase * Math.sin(angle);
        const tx = CENTER + rTip * Math.cos(angle);
        const ty = CENTER + rTip * Math.sin(angle);

        const c1x = CENTER + (rBase + 45) * Math.cos(angle - 0.35);
        const c1y = CENTER + (rBase + 45) * Math.sin(angle - 0.35);
        const c2x = CENTER + (rTip - 20) * Math.cos(angle - 0.25);
        const c2y = CENTER + (rTip - 20) * Math.sin(angle - 0.25);

        const c3x = CENTER + (rTip - 20) * Math.cos(angle + 0.25);
        const c3y = CENTER + (rTip - 20) * Math.sin(angle + 0.25);
        const c4x = CENTER + (rBase + 45) * Math.cos(angle + 0.35);
        const c4y = CENTER + (rBase + 45) * Math.sin(angle + 0.35);

        addPath(`M ${bx} ${by} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tx} ${ty} C ${c3x} ${c3y}, ${c4x} ${c4y}, ${bx} ${by}`, 3, "#3b0910", 2500 + i * 120);

        for (let h = 1; h <= 4; h++) {
          const hR = rBase + h * 22;
          const hx1 = CENTER + hR * Math.cos(angle - 0.12);
          const hy1 = CENTER + hR * Math.sin(angle - 0.12);
          const hx2 = CENTER + hR * Math.cos(angle + 0.12);
          const hy2 = CENTER + hR * Math.sin(angle + 0.12);
          addPath(`M ${hx1} ${hy1} Q ${CENTER + (hR + 5) * Math.cos(angle)} ${CENTER + (hR + 5) * Math.sin(angle)}, ${hx2} ${hy2}`, 1.8, "#540d17", 3200 + i * 100 + h * 60);
        }

        addDot(CENTER + (rTip + 18) * Math.cos(angle), CENTER + (rTip + 18) * Math.sin(angle), 4.5, "#3b0910", 3800 + i * 100);
      }

      // Outer Vines & Leaves
      for (let i = 0; i < 16; i++) {
        const angle = (i * 22.5) * Math.PI / 180;
        const r1 = 250;
        const r2 = 360;

        const x1 = CENTER + r1 * Math.cos(angle);
        const y1 = CENTER + r1 * Math.sin(angle);
        const x2 = CENTER + r2 * Math.cos(angle);
        const y2 = CENTER + r2 * Math.sin(angle);
        const cpx = CENTER + (r1 + 60) * Math.cos(angle + 0.15);
        const cpy = CENTER + (r1 + 60) * Math.sin(angle + 0.15);

        addPath(`M ${x1} ${y1} Q ${cpx} ${cpy}, ${x2} ${y2}`, 2.5, "#3b0910", 4200 + i * 80);

        for (let l = 1; l <= 3; l++) {
          const lR = r1 + l * 32;
          const lx = CENTER + lR * Math.cos(angle);
          const ly = CENTER + lR * Math.sin(angle);
          const leafTipX = CENTER + (lR + 18) * Math.cos(angle + 0.2);
          const leafTipY = CENTER + (lR + 18) * Math.sin(angle + 0.2);

          addPath(`M ${lx} ${ly} Q ${CENTER + (lR + 10) * Math.cos(angle + 0.3)} ${CENTER + (lR + 10) * Math.sin(angle + 0.3)}, ${leafTipX} ${leafTipY}`, 2, "#540d17", 4600 + i * 60 + l * 50);
          addDot(leafTipX, leafTipY, 2.5, "#3b0910", 4800 + i * 60 + l * 50);
        }
      }

      // Outer Envelope Star Rings
      addCircle(CENTER, CENTER, 375, 2, "#540d17", 5800);
      addCircle(CENTER, CENTER, 388, 1.5, "#3b0910", 6100);

      for (let i = 0; i < 32; i++) {
        const angle = (i * 11.25) * Math.PI / 180;
        addDot(CENTER + 405 * Math.cos(angle), CENTER + 405 * Math.sin(angle), i % 2 === 0 ? 4 : 2.5, "#3b0910", 6300 + i * 30);
      }
    }

    function runAnimationLoop() {
      buildMandala();
      const startTime = performance.now();
      const DRAW_TIME = 8000;
      const HOLD_TIME = 2500;
      const FADE_TIME = 1500;

      function step(now) {
        if (isCancelled) return;
        const elapsed = now - startTime;

        pathsToAnimate.forEach(item => {
          if (elapsed >= item.delay) {
            const progress = Math.min((elapsed - item.delay) / item.duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            if (item.isDot) {
              item.element.style.opacity = String(eased);
              item.element.style.transform = `scale(${eased})`;
            } else {
              item.element.style.strokeDashoffset = String(item.length * (1 - eased));
            }
          }
        });

        if (elapsed < DRAW_TIME + HOLD_TIME) {
          animationFrameId = requestAnimationFrame(step);
        } else if (elapsed < DRAW_TIME + HOLD_TIME + FADE_TIME) {
          const fade = (elapsed - (DRAW_TIME + HOLD_TIME)) / FADE_TIME;
          container.style.opacity = String(1 - fade);
          animationFrameId = requestAnimationFrame(step);
        } else {
          container.style.opacity = '1';
          runAnimationLoop();
        }
      }

      animationFrameId = requestAnimationFrame(step);
    }

    runAnimationLoop();

    return () => {
      isCancelled = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ width, height, background: 'transparent' }} className={className}>
      <svg viewBox="0 0 1000 1000" style={{ width: '100%', height: '100%', background: 'transparent' }}>
        <g ref={containerRef}></g>
      </svg>
    </div>
  );
}
