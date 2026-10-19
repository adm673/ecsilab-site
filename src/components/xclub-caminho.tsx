import { MapPin, MessageCircle, Monitor, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Hero do X-Club: o caminho do cliente.
 *
 * Quatro paradas (procura, Google, site, WhatsApp) com "buracos" entre elas. Antes do X-Club, muitos clientes
 * desistem nos buracos. A ovelha constrói as pontes e passa a chegar muito mais gente ao WhatsApp. O ciclo recomeça
 * (loop de 20 s). É uma ilustração conceitual, sem dados reais.
 */

const W = 1000;
const H = 620;
const CICLO = 20;
const OURO = "253,202,10";
// posição de cada parada (em % do palco) e o caminho entre elas
const NOS = [
  { x: 9, y: 63, nome: "Procura", Icone: Search },
  { x: 34, y: 36, nome: "Google", Icone: MapPin },
  { x: 60, y: 62, nome: "Site", Icone: Monitor },
  { x: 87, y: 30, nome: "WhatsApp", Icone: MessageCircle },
];
const pt = (i: number): [number, number] => [(NOS[i]!.x / 100) * W, (NOS[i]!.y / 100) * H];
const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
function semente(n: number) {
  let a = n >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Ponto do trecho k (0..2) em u (0..1): curva suave entre duas paradas. */
function noTrecho(k: number, u: number): [number, number] {
  const [x0, y0] = pt(k);
  const [x1, y1] = pt(k + 1);
  const cx = (x0 + x1) / 2;
  const cy = Math.min(y0, y1) - 70 + (k % 2 === 0 ? 20 : 60);
  const v = 1 - u;
  return [v * v * x0 + 2 * v * u * cx + u * u * x1, v * v * y0 + 2 * v * u * cy + u * u * y1];
}

type Cliente = { s: number; vai: boolean[]; queda: number; qx: number; qy: number; v: number };

export function XClubCaminho() {
  const caixaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [perdidos, setPerdidos] = useState(0);
  const [chegaram, setChegaram] = useState(0);
  const [fase, setFase] = useState<"antes" | "construindo" | "depois">("antes");

  useEffect(() => {
    const caixa = caixaRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!caixa || !canvas || !ctx) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const selo = new Image();
    selo.src = "/ovelha.png";

    let cw = 0;
    let ch = 0;
    let dpr = 1;
    let raf = 0;
    let visivel = false;
    let t = reduzir ? 14 : 0;
    let anterior = 0;
    let rnd = semente(3);
    let clientes: Cliente[] = [];
    let acc = 0;
    let nPerdidos = 0;
    let nChegaram = 0;
    let faseAtual = "";

    const medir = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = caixa.clientWidth;
      ch = (cw * H) / W;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      canvas.style.height = `${ch}px`;
    };
    const X = (v: number) => (v / W) * cw;

    const reiniciar = () => {
      clientes = [];
      nPerdidos = 0;
      nChegaram = 0;
      acc = 0;
      rnd = semente(3);
    };

    // 0..1 de cada ponte (trecho 0, 1 e 2)
    const ponte = (k: number) => suave(7 + k * 1.2, 8.6 + k * 1.2, t % CICLO);

    const passo = (dt: number) => {
      t += dt;
      const tl = t % CICLO;
      if (tl < dt && t > 1) reiniciar();
      acc += dt * 2.3;
      while (acc >= 1) {
        acc -= 1;
        clientes.push({
          s: 0,
          vai: [rnd() < 0.5, rnd() < 0.5, rnd() < 0.55],
          queda: -1,
          qx: 0,
          qy: 0,
          v: 0,
        });
      }
      for (const c of clientes) {
        if (c.queda >= 0) {
          c.queda += dt;
          c.v += dt * 520;
          c.qy += c.v * dt;
          continue;
        }
        const antes = c.s;
        c.s += dt * 0.46;
        const k = Math.floor(c.s);
        if (k < 3) {
          // no meio do trecho, se a ponte ainda não existe, ele pode desistir
          const meio = k + 0.5;
          if (antes < meio && c.s >= meio) {
            const aberta = 1 - ponte(k);
            if (rnd() < aberta && !c.vai[k]) {
              const [x, y] = noTrecho(k, 0.5);
              c.queda = 0;
              c.qx = x;
              c.qy = y;
              c.v = 0;
              nPerdidos++;
            }
          }
        } else if (antes < 3 && c.s >= 3) {
          nChegaram++;
        }
      }
      clientes = clientes.filter((c) => c.s < 3.04 && c.queda < 1.3);
      const novaFase = tl < 7 ? "antes" : tl < 11 ? "construindo" : "depois";
      if (novaFase !== faseAtual) {
        faseAtual = novaFase;
        setFase(novaFase);
      }
    };

    const desenhar = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      const tl = t % CICLO;
      const apaga = 1 - suave(18.7, 19.7, tl);
      ctx.globalAlpha = apaga * suave(0, 0.5, tl);
      ctx.lineCap = "round";

      // trechos: tracejado com buraco no meio; a ponte amarela preenche o buraco
      for (let k = 0; k < 3; k++) {
        const b = ponte(k);
        ctx.beginPath();
        for (let q = 0; q <= 40; q++) {
          const u = q / 40;
          if (u > 0.4 && u < 0.6) {
            continue;
          }
          const [x, y] = noTrecho(k, u);
          if (q === 0 || (u > 0.6 && u - 1 / 40 <= 0.6)) ctx.moveTo(X(x), X(y));
          else ctx.lineTo(X(x), X(y));
        }
        ctx.strokeStyle = "rgba(11,11,12,0.38)";
        ctx.lineWidth = Math.max(2, X(5));
        ctx.setLineDash([X(12), X(11)]);
        ctx.stroke();
        ctx.setLineDash([]);
        if (b > 0.001) {
          ctx.beginPath();
          const ate = 0.4 + 0.2 * b;
          for (let q = 0; q <= 20; q++) {
            const u = 0.4 + (ate - 0.4) * (q / 20);
            const [x, y] = noTrecho(k, u);
            if (q === 0) ctx.moveTo(X(x), X(y));
            else ctx.lineTo(X(x), X(y));
          }
          ctx.strokeStyle = `rgb(${OURO})`;
          ctx.lineWidth = Math.max(3, X(9));
          ctx.shadowColor = `rgba(${OURO},.8)`;
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        // "x" no buraco aberto
        const aberta = 1 - b;
        if (aberta > 0.05) {
          const [x, y] = noTrecho(k, 0.5);
          ctx.strokeStyle = `rgba(190,60,50,${0.85 * aberta})`;
          ctx.lineWidth = Math.max(2, X(5));
          const r = X(14);
          ctx.beginPath();
          ctx.moveTo(X(x) - r, X(y) - r);
          ctx.lineTo(X(x) + r, X(y) + r);
          ctx.moveTo(X(x) + r, X(y) - r);
          ctx.lineTo(X(x) - r, X(y) + r);
          ctx.stroke();
        }
      }

      // clientes
      for (const c of clientes) {
        if (c.queda >= 0) {
          ctx.fillStyle = `rgba(110,110,110,${Math.max(0, 0.9 - c.queda * 0.75)})`;
          ctx.beginPath();
          ctx.arc(X(c.qx), X(c.qy), X(9), 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        const k = Math.min(2, Math.floor(c.s));
        const [x, y] = noTrecho(k, Math.min(1, c.s - k));
        const conectado = tl > 11;
        ctx.fillStyle = conectado ? `rgb(${OURO})` : "#0b0b0c";
        ctx.strokeStyle = "#0b0b0c";
        ctx.lineWidth = Math.max(1.5, X(3));
        ctx.beginPath();
        ctx.arc(X(x), X(y), X(10), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // o selo da ovelha constrói as pontes
      if (tl > 6.6 && tl < 11.6 && selo.complete) {
        const u = suave(7, 10.8, tl);
        const k = Math.min(2, Math.floor(u * 3));
        const [x, y] = noTrecho(k, Math.min(1, u * 3 - k));
        const tam = X(78);
        ctx.save();
        ctx.globalAlpha = apaga * suave(6.6, 7.2, tl) * (1 - suave(11, 11.6, tl));
        ctx.shadowColor = `rgba(${OURO},.9)`;
        ctx.shadowBlur = 18;
        ctx.drawImage(selo, X(x) - tam / 2, X(y) - tam / 2 - X(30), tam, tam);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const quadro = (agora: number) => {
      raf = 0;
      if (!visivel) return;
      const dt = Math.max(0, Math.min(0.05, (agora - anterior) / 1000));
      anterior = agora;
      passo(dt);
      desenhar();
      setPerdidos(nPerdidos);
      setChegaram(nChegaram);
      raf = requestAnimationFrame(quadro);
    };
    const tocar = () => {
      if (reduzir || raf || !visivel) return;
      anterior = performance.now();
      raf = requestAnimationFrame(quadro);
    };

    medir();
    if (reduzir) {
      // quadro parado: o caminho já conectado, com um grupo de clientes chegando
      for (let q = 0; q < 60 * 6; q++) passo(1 / 60);
      t = 14;
      setPerdidos(nPerdidos);
      setChegaram(nChegaram);
    }
    desenhar();
    const ro = new ResizeObserver(() => {
      medir();
      desenhar();
    });
    ro.observe(caixa);
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = !!e?.isIntersecting;
        if (visivel) tocar();
      },
      { threshold: 0.15 },
    );
    io.observe(caixa);
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>)["__xc"] = {
        ir: (seg: number) => {
          for (let q = 0; q < seg * 60; q++) passo(1 / 60);
          desenhar();
          setPerdidos(nPerdidos);
          setChegaram(nChegaram);
        },
      };
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const legenda =
    fase === "antes"
      ? "Antes: o cliente desiste em cada buraco do caminho."
      : fase === "construindo"
        ? "A Écsilab conecta cada parada do caminho."
        : "Com o X-Club: mais gente chega ao WhatsApp.";

  return (
    <div className="relative w-full">
      <div
        ref={caixaRef}
        role="img"
        aria-label="Ilustração conceitual: clientes percorrem o caminho procura, Google, site e WhatsApp. Antes do X-Club, muitos desistem nos buracos entre as etapas; depois que a Écsilab conecta os canais, mais gente chega ao WhatsApp."
        className="relative w-full"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        {NOS.map(({ x, y, nome, Icone }) => (
          <div
            key={nome}
            aria-hidden="true"
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#0b0b0c] bg-white text-[#0b0b0c] shadow-[3px_3px_0_#0b0b0c] sm:h-14 sm:w-14">
              <Icone className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span className="rounded-full bg-[#0b0b0c] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">
              {nome}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="min-h-[2.4em] max-w-[18rem] text-sm font-bold leading-tight text-[#0b0b0c] sm:text-base">
          {legenda}
        </p>
        <dl className="flex gap-3 text-center">
          <div className="rounded-xl border-2 border-[#0b0b0c] bg-white px-3 py-1.5">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-black/60">
              Desistiram
            </dt>
            <dd className="text-xl font-extrabold tabular-nums text-[#0b0b0c]">{perdidos}</dd>
          </div>
          <div className="rounded-xl border-2 border-[#0b0b0c] bg-accent px-3 py-1.5">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-black/70">
              Chegaram
            </dt>
            <dd className="text-xl font-extrabold tabular-nums text-[#0b0b0c]">{chegaram}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-2 text-[11px] text-black/50">Ilustração conceitual, sem dados reais.</p>
    </div>
  );
}
