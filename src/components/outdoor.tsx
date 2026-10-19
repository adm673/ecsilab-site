import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Outdoor da Home: um painel grande que passa, uma a uma, as frentes da Écsilab.
 * Troca sozinho a cada 7 s (pausa com o mouse, o foco ou o botão) e também por setas, pontos e deslize no celular.
 * Com "reduzir movimento" não troca sozinho.
 */

const INK = "#0b0b0c";
const OURO = "#fdca0a";
const TEMPO = 7000;

type Banner = {
  id: string;
  rotulo: string;
  titulo: ReactNode;
  texto: string;
  cta: string;
  href: string;
  fundo: string;
  tinta: string;
  arte: ReactNode;
};

const Ouro = ({ children }: { children: ReactNode }) => (
  <span style={{ color: OURO }}>{children}</span>
);

const arteXClub = (
  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
    <rect
      x="60"
      y="60"
      width="280"
      height="170"
      rx="22"
      fill="#fff"
      stroke={INK}
      strokeWidth="5"
      transform="rotate(-5 200 145)"
    />
    <g transform="rotate(-5 200 145)">
      <line x1="60" y1="118" x2="340" y2="118" stroke={INK} strokeWidth="3" strokeDasharray="8 8" />
      <circle cx="60" cy="118" r="14" fill="#f4f0e3" />
      <circle cx="340" cy="118" r="14" fill="#f4f0e3" />
      <text x="84" y="100" fontSize="26" fontWeight="900" fill={INK}>
        X-Club
      </text>
      <text x="84" y="170" fontSize="40" fontWeight="900" fill={INK}>
        R$ 565,67
      </text>
      <rect
        x="84"
        y="190"
        width="150"
        height="22"
        rx="11"
        fill={OURO}
        stroke={INK}
        strokeWidth="3"
      />
      <circle cx="300" cy="86" r="26" fill={OURO} stroke={INK} strokeWidth="4" />
    </g>
  </svg>
);

const arteEnterprise = (
  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
    <circle
      cx="200"
      cy="150"
      r="110"
      fill="none"
      stroke={INK}
      strokeOpacity=".25"
      strokeWidth="3"
      strokeDasharray="4 10"
    />
    <circle cx="200" cy="150" r="46" fill={INK} />
    <text x="200" y="157" textAnchor="middle" fontSize="18" fontWeight="900" fill={OURO}>
      IA
    </text>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const x = 200 + Math.cos(a) * 110;
      const y = 150 + Math.sin(a) * 110;
      return (
        <g key={i}>
          <line x1="200" y1="150" x2={x} y2={y} stroke={INK} strokeWidth="3" />
          <rect
            x={x - 22}
            y={y - 22}
            width="44"
            height="44"
            rx="12"
            fill={i % 2 ? "#fff" : OURO}
            stroke={INK}
            strokeWidth="4"
          />
        </g>
      );
    })}
  </svg>
);

const arteIA = (
  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
    {[
      [60, 70],
      [60, 150],
      [60, 230],
      [200, 40],
      [200, 110],
      [200, 190],
      [200, 260],
      [340, 100],
      [340, 200],
    ].map(([x, y], i, arr) =>
      arr.map(([x2, y2], j) =>
        x2! - x! === 140 || (x2! - x! === 140 && i === j) ? (
          <line
            key={`${i}-${j}`}
            x1={x}
            y1={y}
            x2={x2}
            y2={y2}
            stroke={OURO}
            strokeOpacity=".28"
            strokeWidth="2"
          />
        ) : null,
      ),
    )}
    {[
      [60, 70],
      [60, 150],
      [60, 230],
      [200, 40],
      [200, 110],
      [200, 190],
      [200, 260],
      [340, 100],
      [340, 200],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 15 : 10} fill={i % 2 ? OURO : "#fff"} />
    ))}
  </svg>
);

const arteGrowth = (
  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
    {[50, 90, 130, 180, 235].map((h, i) => (
      <rect
        key={i}
        x={50 + i * 68}
        y={260 - h}
        width="48"
        height={h}
        rx="6"
        fill={i === 4 ? INK : "#fff"}
        stroke={INK}
        strokeWidth="4"
      />
    ))}
    <path
      d="M56 170 L130 130 L200 140 L290 70 L360 30"
      fill="none"
      stroke={INK}
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M330 24 L364 28 L354 60"
      fill="none"
      stroke={INK}
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const arteMarketing = (
  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
    <g stroke={INK} strokeWidth="4">
      <rect x="40" y="50" width="150" height="100" rx="14" fill={OURO} />
      <rect x="210" y="50" width="150" height="100" rx="14" fill="#fff" />
      <rect x="40" y="170" width="150" height="80" rx="14" fill="#fff" />
      <rect x="210" y="170" width="150" height="80" rx="14" fill={INK} />
    </g>
    <circle cx="115" cy="100" r="26" fill="#fff" stroke={INK} strokeWidth="4" />
    <path d="M104 100l8 8 14-16" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
    <rect x="230" y="72" width="100" height="10" rx="5" fill={INK} />
    <rect x="230" y="96" width="70" height="10" rx="5" fill={INK} opacity=".4" />
    <rect x="60" y="192" width="90" height="10" rx="5" fill={INK} />
    <rect x="230" y="192" width="90" height="10" rx="5" fill={OURO} />
  </svg>
);

const arteRares = (
  <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
    {[
      ["37,1x", 300],
      ["21x", 190],
      ["7x", 100],
    ].map(([r, w], i) => (
      <g key={String(r)}>
        <rect
          x="40"
          y={60 + i * 70}
          width={Number(w)}
          height="42"
          rx="8"
          fill={i === 0 ? OURO : "#fff"}
        />
        <text x={50 + Number(w)} y={89 + i * 70} fontSize="26" fontWeight="900" fill="#fff">
          {r}
        </text>
      </g>
    ))}
  </svg>
);

const BANNERS: Banner[] = [
  {
    id: "xclub",
    rotulo: "Novo • Porta de entrada",
    titulo: (
      <>
        X-Club: seu marketing local, <Ouro>conectado</Ouro>.
      </>
    ),
    texto: "Site, Google, anúncios e canais de contato em uma operação só. A partir de R$ 399/mês.",
    cta: "Conhecer o X-Club",
    href: "/x-club",
    fundo: "#f4f0e3",
    tinta: INK,
    arte: arteXClub,
  },
  {
    id: "enterprise",
    rotulo: "Écsilab Enterprise",
    titulo: (
      <>
        Departamentos inteiros operando com <Ouro>IA</Ouro>.
      </>
    ),
    texto:
      "Pagamento único, infraestrutura em nome da sua empresa e sem mensalidade nossa para continuar funcionando.",
    cta: "Ver o Enterprise",
    href: "/enterprise",
    fundo: "#ffffff",
    tinta: INK,
    arte: arteEnterprise,
  },
  {
    id: "ia",
    rotulo: "Soluções de IA",
    titulo: (
      <>
        33 soluções de IA para tirar o <Ouro>trabalho repetitivo</Ouro> do caminho.
      </>
    ),
    texto: "Agentes, automações e análises prontos para entrar na rotina do seu time.",
    cta: "Explorar as soluções",
    href: "/solucoes#solucoes-ia",
    fundo: "#0b0b0c",
    tinta: "#ffffff",
    arte: arteIA,
  },
  {
    id: "growth",
    rotulo: "Portfólio de Growth",
    titulo: <>Crescimento com método, do processo à escala comercial.</>,
    texto: "Estratégia, time comercial e processos para o resultado crescer onde está a restrição.",
    cta: "Ver o portfólio",
    href: "/solucoes#servicos",
    fundo: OURO,
    tinta: INK,
    arte: arteGrowth,
  },
  {
    id: "marketing",
    rotulo: "Portfólio de Marketing",
    titulo: (
      <>
        Marca, aquisição e relacionamento <Ouro>em um só lugar</Ouro>.
      </>
    ),
    texto:
      "Da comunicação aos sites e ferramentas: o que sua empresa precisa para ser encontrada e escolhida.",
    cta: "Ver os serviços",
    href: "/solucoes#servicos",
    fundo: "#161616",
    tinta: "#ffffff",
    arte: arteMarketing,
  },
  {
    id: "mentes",
    rotulo: "Mentes e Método",
    titulo: (
      <>
        O método por trás de <Ouro>resultados medidos</Ouro>.
      </>
    ),
    texto: "Conheça o Rares e os resultados de clientes que o método já acompanhou.",
    cta: "Conhecer o método",
    href: "/mentes",
    fundo: "#0b0b0c",
    tinta: "#ffffff",
    arte: arteRares,
  },
];

export function Outdoor() {
  const [i, setI] = useState(0);
  const [pausadoUsuario, setPausadoUsuario] = useState(false);
  const [sobre, setSobre] = useState(false);
  const [reduzir, setReduzir] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const inicioX = useRef<number | null>(null);
  const n = BANNERS.length;

  const ir = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    setReduzir(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const rodando = !pausadoUsuario && !sobre && !reduzir;

  useEffect(() => {
    setProgresso(0);
    if (!rodando) return;
    let raf = 0;
    const t0 = performance.now();
    const quadro = (agora: number) => {
      const p = Math.min(1, (agora - t0) / TEMPO);
      setProgresso(p);
      if (p >= 1) setI((v) => (v + 1) % n);
      else raf = requestAnimationFrame(quadro);
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [i, rodando, n]);

  const atual = BANNERS[i]!;

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Frentes da Écsilab"
      className="relative border-y border-white/10 bg-ink"
      onMouseEnter={() => setSobre(true)}
      onMouseLeave={() => setSobre(false)}
      onFocusCapture={() => setSobre(true)}
      onBlurCapture={() => setSobre(false)}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div
          className="relative overflow-hidden rounded-[2rem] border-2 border-white/15 shadow-[0_30px_80px_-30px_rgba(253,202,10,0.35)]"
          onPointerDown={(e) => {
            inicioX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (inicioX.current === null) return;
            const dx = e.clientX - inicioX.current;
            inicioX.current = null;
            if (Math.abs(dx) > 50) ir(i + (dx < 0 ? 1 : -1));
          }}
        >
          <div className="relative min-h-[30rem] sm:min-h-[28rem] md:min-h-[26rem] lg:min-h-[26rem]">
            {BANNERS.map((b, k) => (
              <div
                key={b.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${k + 1} de ${n}: ${b.rotulo}`}
                aria-hidden={k !== i}
                inert={k !== i}
                className="absolute inset-0 grid grid-cols-1 items-center gap-6 px-7 pb-10 pt-7 transition-all duration-700 sm:px-10 md:grid-cols-[1.1fr_1fr] md:gap-10 md:px-14"
                style={{
                  background: b.fundo,
                  color: b.tinta,
                  opacity: k === i ? 1 : 0,
                  transform: k === i ? "none" : `translateX(${k < i ? "-3%" : "3%"})`,
                  pointerEvents: k === i ? "auto" : "none",
                }}
              >
                <div>
                  <p
                    className="mb-4 inline-block rounded-full border-2 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]"
                    style={{ borderColor: b.tinta }}
                  >
                    {b.rotulo}
                  </p>
                  <h2 className="text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                    {b.titulo}
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed opacity-80 sm:text-lg">
                    {b.texto}
                  </p>
                  <a
                    href={b.href}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 px-5 py-3 font-extrabold transition hover:translate-x-0.5"
                    style={{
                      background: OURO,
                      color: INK,
                      borderColor: INK === b.tinta ? INK : OURO,
                    }}
                  >
                    {b.cta} <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
                <div className="pointer-events-none absolute inset-y-6 right-0 -z-0 w-4/5 opacity-20 md:static md:h-64 md:w-auto md:opacity-100 lg:h-72">
                  {b.arte}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-black/20">
            <div className="h-full bg-accent" style={{ width: `${progresso * 100}%` }} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Escolher banner">
            {BANNERS.map((b, k) => (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={b.rotulo}
                onClick={() => ir(k)}
                className={`h-2.5 rounded-full transition-all ${k === i ? "w-8 bg-accent" : "w-2.5 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
            <span className="ml-3 hidden text-sm text-paper/60 sm:inline">{atual.rotulo}</span>
          </div>
          <div className="flex items-center gap-2">
            {!reduzir && (
              <button
                type="button"
                onClick={() => setPausadoUsuario((v) => !v)}
                aria-label={
                  pausadoUsuario ? "Retomar passagem automática" : "Pausar passagem automática"
                }
                className="rounded-full border border-white/20 p-2 text-paper hover:border-accent hover:text-accent"
              >
                {pausadoUsuario ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => ir(i - 1)}
              aria-label="Banner anterior"
              className="rounded-full border border-white/20 p-2 text-paper hover:border-accent hover:text-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => ir(i + 1)}
              aria-label="Próximo banner"
              className="rounded-full border border-white/20 p-2 text-paper hover:border-accent hover:text-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
