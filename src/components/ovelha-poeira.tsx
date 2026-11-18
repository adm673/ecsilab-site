import { useEffect, useRef } from "react";

type Dados = { w: number; h: number; p: number[] };

const AMARELO = "253,202,10";
const AMARELO_CLARO = "255,238,160";
const BRANCO = "255,255,255";

/**
 * A ovelha da Écsilab em poeira cósmica. A poeira nasce de toda a tela, sem moldura, e entra em espiral até
 * montar a ovelha no lugar da caixa (que só marca a posição e o tamanho). Depois ela respira, cada grão
 * orbita bem pouco, uma onda de luz atravessa o corpo de tempos em tempos e o mouse (ou o toque) afasta a poeira.
 * O canvas é fixo na tela, atrás do conteúdo, e a ovelha acompanha a caixa ao rolar a página.
 * Os pontos vêm de /ovelha-particulas.json. Sem movimento, quando o sistema pede menos animação.
 */
export function OvelhaPoeira({ className = "" }: { className?: string }) {
  const caixaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const caixa = caixaRef.current;
    if (!caixa) return;
    // O canvas fica direto no body, fixo e atrás do conteúdo, para a poeira nascer de toda a tela, sem moldura.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:fixed;left:0;top:0;z-index:0;pointer-events:none;display:block";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let vivo = true;
    let raf = 0;
    let cw = 0;
    let ch = 0;
    let dpr = 1;
    const mouse = { x: -9999, y: -9999 };
    const inicio = performance.now();

    let n = 0;
    let rx = new Float32Array(0); // posição de repouso, em unidades da ovelha
    let ry = new Float32Array(0);
    let sx = new Float32Array(0); // ponto de partida, em pixels da tela
    let sy = new Float32Array(0);
    let dx = new Float32Array(0); // deslocamento causado pelo mouse
    let dy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let atraso = new Float32Array(0);
    let duracao = new Float32Array(0);
    let fase = new Float32Array(0);
    let giro = new Float32Array(0); // sentido e força da espiral
    let orbita = new Float32Array(0);
    let freq = new Float32Array(0);
    let amarela = new Uint8Array(0);
    let hx = new Float32Array(0);
    let hy = new Float32Array(0);
    let hc = new Uint8Array(0);

    const medir = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = document.documentElement.clientWidth;
      ch = window.innerHeight;
      canvas.width = Math.max(1, Math.round(cw * dpr));
      canvas.height = Math.max(1, Math.round(ch * dpr));
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    };

    const suave = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

    const quadro = (agora: number) => {
      if (!vivo) return;
      const e = reduzir ? 99 : (agora - inicio) / 1000;
      const b = caixa.getBoundingClientRect();
      const S = Math.min(b.width, b.height) * 0.98;
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const visivel = b.bottom > -S && b.top < ch + S;
      const montando = e < 5; // enquanto a poeira ainda chega, ela cruza a tela inteira
      if (n > 0 && (visivel || montando) && S > 4) {
        const respiro = 1 + 0.014 * Math.sin(e * 0.9);
        const raio = S * 0.14;
        const r = Math.max(0.5, S * 0.0019);

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 0.6);
        g.addColorStop(0, `rgba(${AMARELO},0.10)`);
        g.addColorStop(1, `rgba(${AMARELO},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(cx - S, cy - S, S * 2, S * 2);

        // onda de luz que atravessa a ovelha da esquerda para a direita
        const onda = e > 4 ? (((e - 4) * 0.2) % 1.7) - 0.6 : -9;
        let nh = 0;

        for (const cor of [0, 1]) {
          ctx.fillStyle = `rgba(${cor ? AMARELO : BRANCO},${cor ? 0.95 : 0.8})`;
          ctx.beginPath();
          for (let i = 0; i < n; i++) {
            if (amarela[i] !== cor) continue;
            const p = suave((e - atraso[i]!) / duracao[i]!);
            const w = reduzir ? 0 : e * freq[i]! + fase[i]!;
            const oa = reduzir ? 0 : orbita[i]! * S;
            const alvoX = cx + rx[i]! * respiro * S + Math.cos(w) * oa;
            const alvoY = cy + ry[i]! * respiro * S + Math.sin(w * 1.13) * oa;
            let px = alvoX;
            let py = alvoY;
            if (p < 1) {
              // espiral: a poeira de toda a tela gira e se fecha sobre o ponto de repouso
              const ang = (1 - p) * giro[i]!;
              const c = Math.cos(ang);
              const s = Math.sin(ang);
              const ex = (sx[i]! - alvoX) * (1 - p);
              const ey = (sy[i]! - alvoY) * (1 - p);
              px = alvoX + ex * c - ey * s;
              py = alvoY + ex * s + ey * c;
            }

            if (!reduzir && p >= 1) {
              const ddx = px + dx[i]! - mouse.x;
              const ddy = py + dy[i]! - mouse.y;
              const d2 = ddx * ddx + ddy * ddy;
              if (d2 < raio * raio && d2 > 0.01) {
                const d = Math.sqrt(d2);
                const f = (1 - d / raio) * 2.4;
                vx[i] = vx[i]! + (ddx / d) * f;
                vy[i] = vy[i]! + (ddy / d) * f;
              }
              vx[i] = (vx[i]! - dx[i]! * 0.03) * 0.92;
              vy[i] = (vy[i]! - dy[i]! * 0.03) * 0.92;
              dx[i] = dx[i]! + vx[i]!;
              dy[i] = dy[i]! + vy[i]!;
              px += dx[i]!;
              py += dy[i]!;
            }
            if (px < -4 || px > cw + 4 || py < -4 || py > ch + 4) continue;
            ctx.moveTo(px + r, py);
            ctx.arc(px, py, r, 0, Math.PI * 2);

            if (p >= 1 && Math.abs(rx[i]! - onda) < 0.07) {
              hx[nh] = px;
              hy[nh] = py;
              hc[nh] = cor;
              nh++;
            }
          }
          ctx.fill();
        }

        // realce da onda de luz
        for (const cor of [0, 1]) {
          ctx.fillStyle = `rgba(${cor ? AMARELO_CLARO : BRANCO},1)`;
          ctx.beginPath();
          for (let k = 0; k < nh; k++) {
            if (hc[k] !== cor) continue;
            ctx.moveTo(hx[k]! + r * 1.7, hy[k]!);
            ctx.arc(hx[k]!, hy[k]!, r * 1.7, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }
      if (!reduzir) raf = requestAnimationFrame(quadro);
    };

    const mover = (ev: PointerEvent) => {
      mouse.x = ev.clientX;
      mouse.y = ev.clientY;
    };
    const sair = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const redesenhar = () => {
      medir();
      if (reduzir) quadro(performance.now());
    };

    medir();
    window.addEventListener("resize", redesenhar);
    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerleave", sair);
    window.addEventListener("blur", sair);
    if (reduzir) window.addEventListener("scroll", redesenhar, { passive: true });

    fetch("/ovelha-particulas.json")
      .then((res) => res.json() as Promise<Dados>)
      .then((d) => {
        if (!vivo) return;
        const total = d.p.length / 3;
        const leve = (navigator.hardwareConcurrency ?? 8) <= 4 || cw < 520;
        const pontos = leve ? 8000 : total;
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
        giro = new Float32Array(n);
        orbita = new Float32Array(n);
        freq = new Float32Array(n);
        amarela = new Uint8Array(n);
        hx = new Float32Array(n);
        hy = new Float32Array(n);
        hc = new Uint8Array(n);
        escolhidos.forEach((idx, i) => {
          rx[i] = (d.p[idx * 3]! - 125.5) / 200;
          ry[i] = (d.p[idx * 3 + 1]! - 124) / 200;
          sx[i] = Math.random() * cw; // nasce em qualquer ponto da tela
          sy[i] = Math.random() * ch;
          atraso[i] = Math.random() * 1.6;
          duracao[i] = 2.4 + Math.random() * 1.2;
          fase[i] = Math.random() * Math.PI * 2;
          giro[i] = (Math.random() < 0.5 ? -1 : 1) * (0.8 + Math.random() * 1.4);
          orbita[i] = 0.003 + Math.random() * 0.006;
          freq[i] = 0.5 + Math.random() * 0.9;
          amarela[i] = d.p[idx * 3 + 2] === 1 ? 1 : 0;
        });
        raf = requestAnimationFrame(quadro);
      })
      .catch(() => undefined);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", redesenhar);
      window.removeEventListener("scroll", redesenhar);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerleave", sair);
      window.removeEventListener("blur", sair);
      canvas.remove();
    };
  }, []);

  return <div ref={caixaRef} className={`aspect-square ${className}`} aria-hidden="true" />;
}
