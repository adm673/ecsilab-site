import { useEffect, useRef } from "react";

type Dados = { w: number; h: number; p: number[] };

const AMARELO = "253,202,10";
const BRANCO = "255,255,255";

/**
 * A ovelha da Écsilab em poeira cósmica, versão leve para cabeçalhos e telas de entrada: as partículas
 * voam de pontos aleatórios e se montam, depois respiram. O mouse (ou o toque) afasta a poeira, que volta
 * ao lugar. Os pontos vêm de /ovelha-particulas.json. Sem movimento, quando o sistema pede menos animação.
 */
export function OvelhaPoeira({
  className = "",
  pontos = 9000,
}: {
  className?: string;
  pontos?: number;
}) {
  const caixaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const caixa = caixaRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!caixa || !canvas || !ctx) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let vivo = true;
    let raf = 0;
    let cw = 0;
    let ch = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999 };
    const inicio = performance.now();

    let n = 0;
    let rx = new Float32Array(0);
    let ry = new Float32Array(0);
    let sx = new Float32Array(0); // ponto de partida aleatório
    let sy = new Float32Array(0);
    let dx = new Float32Array(0); // deslocamento causado pelo mouse
    let dy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let atraso = new Float32Array(0);
    let duracao = new Float32Array(0);
    let fase = new Float32Array(0);
    let amarela = new Uint8Array(0);

    const medir = () => {
      const r = caixa.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = r.width;
      ch = r.height;
      canvas.width = Math.max(1, Math.round(cw * dpr));
      canvas.height = Math.max(1, Math.round(ch * dpr));
    };

    const suave = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

    const quadro = (agora: number) => {
      if (!vivo) return;
      const e = reduzir ? 99 : (agora - inicio) / 1000;
      const S = Math.min(cw, ch) * 0.98;
      const respiro = 1 + 0.012 * Math.sin(e * 0.9);
      const raio = S * 0.16;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      // brilho suave atrás do rosto
      const g = ctx.createRadialGradient(cw / 2, ch * 0.5, 0, cw / 2, ch * 0.5, S * 0.55);
      g.addColorStop(0, `rgba(${AMARELO},0.10)`);
      g.addColorStop(1, `rgba(${AMARELO},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cw, ch);

      const r = Math.max(0.55, S * 0.0027);
      for (const cor of [0, 1]) {
        ctx.fillStyle = `rgba(${cor ? AMARELO : BRANCO},${cor ? 0.95 : 0.82})`;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          if (amarela[i] !== cor) continue;
          const p = suave((e - atraso[i]!) / duracao[i]!);
          const flut = reduzir ? 0 : Math.sin(e * 0.9 + fase[i]!) * 0.004;
          const alvoX = cw / 2 + (rx[i]! * respiro + flut) * S;
          const alvoY = ch / 2 + (ry[i]! * respiro + flut * 0.8) * S;
          const iniX = cw / 2 + sx[i]! * S;
          const iniY = ch / 2 + sy[i]! * S;
          let px = iniX + (alvoX - iniX) * p;
          let py = iniY + (alvoY - iniY) * p;

          if (!reduzir) {
            const ddx = px + dx[i]! - mouse.x;
            const ddy = py + dy[i]! - mouse.y;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 < raio * raio && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = (1 - d / raio) * 2.2;
              vx[i] = vx[i]! + (ddx / d) * f;
              vy[i] = vy[i]! + (ddy / d) * f;
            }
            vx[i] = (vx[i]! - dx[i]! * 0.035) * 0.9;
            vy[i] = (vy[i]! - dy[i]! * 0.035) * 0.9;
            dx[i] = dx[i]! + vx[i]!;
            dy[i] = dy[i]! + vy[i]!;
            px += dx[i]!;
            py += dy[i]!;
          }
          ctx.moveTo(px + r, py);
          ctx.arc(px, py, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      if (!reduzir) raf = requestAnimationFrame(quadro);
    };

    const mover = (ev: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = ev.clientX - b.left;
      mouse.y = ev.clientY - b.top;
    };
    const sair = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    medir();
    const ro = new ResizeObserver(() => {
      medir();
      if (reduzir) quadro(performance.now());
    });
    ro.observe(caixa);
    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerleave", sair);
    window.addEventListener("blur", sair);

    fetch("/ovelha-particulas.json")
      .then((res) => res.json() as Promise<Dados>)
      .then((d) => {
        if (!vivo) return;
        const total = d.p.length / 3;
        const escolhidos: number[] = [];
        const passo = Math.max(1, total / pontos);
        for (let k = 0; k < total; k += passo) escolhidos.push(Math.floor(k));
        n = escolhidos.length;
        rx = new Float32Array(n);
        ry = new Float32Array(n);
        sx = new Float32Array(n);
        sy = new Float32Array(n);
        dx = new Float32Array(n);
        dy = new Float32Array(n);
        vx = new Float32Array(n);
        vy = new Float32Array(n);
        atraso = new Float32Array(n);
        duracao = new Float32Array(n);
        fase = new Float32Array(n);
        amarela = new Uint8Array(n);
        escolhidos.forEach((idx, i) => {
          rx[i] = (d.p[idx * 3]! - 125.5) / 200;
          ry[i] = (d.p[idx * 3 + 1]! - 124) / 200;
          const ang = Math.random() * Math.PI * 2;
          const dist = 0.7 + Math.random() * 0.9;
          sx[i] = Math.cos(ang) * dist;
          sy[i] = Math.sin(ang) * dist;
          atraso[i] = Math.random() * 0.9;
          duracao[i] = 1.5 + Math.random() * 0.9;
          fase[i] = Math.random() * Math.PI * 2;
          amarela[i] = d.p[idx * 3 + 2] === 1 ? 1 : 0;
        });
        raf = requestAnimationFrame(quadro);
      })
      .catch(() => undefined);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerleave", sair);
      window.removeEventListener("blur", sair);
    };
  }, [pontos]);

  return (
    <div ref={caixaRef} className={`aspect-square ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
