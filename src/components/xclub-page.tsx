import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { AceitePrivacidade } from "@/components/aceite-privacidade";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { XClubCaminho } from "@/components/xclub-caminho";
import { linkWhatsApp } from "@/lib/contato";
import {
  DESAFIOS,
  DORES,
  ENTREGAS_PEQUENAS,
  EXTENSOES,
  FAQ,
  RESULTADOS,
  ROADMAP,
  SEGMENTOS,
  type Segmento,
} from "@/lib/xclub";

const MSG_GERAL =
  "Olá! Vim pela página do X-Club da Écsilab e quero conhecer a solução para o meu negócio.";
const INK = "text-[#0b0b0c]";
const BTN_PRIMARIO =
  "xc-btn inline-flex items-center justify-center rounded-xl border-2 border-[#0b0b0c] bg-accent px-6 py-3.5 font-extrabold text-[#0b0b0c]";
const BTN_SECUNDARIO =
  "xc-btn inline-flex items-center justify-center rounded-xl border-2 border-[#0b0b0c] bg-white px-6 py-3.5 font-extrabold text-[#0b0b0c]";

const Marca = ({ children }: { children: React.ReactNode }) => (
  <span className="xc-marca">{children}</span>
);

function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 inline-block rounded-full border-2 border-[#0b0b0c] bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0b0b0c]">
      {children}
    </p>
  );
}

function Hero() {
  return (
    <section className="xc-papel relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Rotulo>Écsilab apresenta • X-Club</Rotulo>
          <h1 className={`text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl ${INK}`}>
            Seu próximo cliente pode estar <Marca>desistindo</Marca> antes de falar com você.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/75">
            O X-Club conecta site, Google, anúncios e canais de contato para facilitar o caminho
            entre encontrar seu negócio e escolher comprar de você. Uma operação de marketing local
            estruturada e acompanhada pela Écsilab.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#investimento" className={BTN_PRIMARIO}>
              Conhecer a solução
            </a>
            <a href="#jornada" className={BTN_SECUNDARIO}>
              Ver uma demonstração
            </a>
          </div>
          <p className="mt-6 text-sm font-semibold text-black/60">
            Para negócios de serviços e alimentação • Sem promessas de vendas garantidas
          </p>
        </div>
        <XClubCaminho />
      </div>
    </section>
  );
}

const FRASES = [
  "Mais fácil de encontrar",
  "Mais fácil de confiar",
  "Mais fácil de escolher",
  "Mais fácil de comprar",
];

function Faixa() {
  const itens = [...FRASES, ...FRASES, ...FRASES, ...FRASES, ...FRASES, ...FRASES];
  return (
    <div className="overflow-hidden border-y-2 border-[#0b0b0c] bg-accent py-3" aria-hidden="true">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {itens.map((f, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm font-black uppercase tracking-widest text-[#0b0b0c]"
          >
            {f}
            <span>✺</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Custo() {
  return (
    <section className="xc-papel">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Rotulo>01 — O custo invisível</Rotulo>
        <h2 className={`max-w-3xl text-3xl font-black leading-tight sm:text-5xl ${INK}`}>
          O cliente não avisa quando <Marca>desiste</Marca>.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-black/70">
          Ele encontra uma dificuldade, abre outra opção e segue em frente. O problema pode começar
          muito antes do primeiro contato.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {DORES.map((d) => (
            <article key={d.n} className="xc-card p-6">
              <p className="text-xs font-extrabold tracking-[0.2em] text-black/50">{d.n}</p>
              <h3 className={`mt-3 text-xl font-black ${INK}`}>{d.t}</h3>
              <p className="mt-2 leading-relaxed text-black/70">{d.d}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-3xl border-2 border-[#0b0b0c] bg-[#0b0b0c] p-8 text-white sm:p-12">
          <p className="max-w-3xl text-2xl font-extrabold leading-snug sm:text-4xl">
            Talvez você não precise começar divulgando mais. Talvez precise{" "}
            <span className="text-accent">conectar melhor o que já tem.</span>
          </p>
          <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
            É aqui que entra o X-Club ↗
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Ilustrações do celular ---------- */

function Cena({ seg, etapa }: { seg: Segmento; etapa: number }) {
  const ink = "#0b0b0c";
  if (seg === "servicos") {
    return (
      <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
        <rect width="200" height="120" fill="#fff6cc" />
        <rect x="20" y="44" width="70" height="66" fill="#fff" stroke={ink} strokeWidth="3" />
        <rect x="100" y="24" width="80" height="86" fill="#fdca0a" stroke={ink} strokeWidth="3" />
        {[0, 1, 2].map((r) =>
          [0, 1].map((c) => (
            <rect
              key={`${r}${c}`}
              x={30 + c * 30}
              y={54 + r * 18}
              width="16"
              height="10"
              fill={etapa >= 1 ? ink : "#ddd"}
            />
          )),
        )}
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`b${r}${c}`}
              x={110 + c * 22}
              y={34 + r * 18}
              width="14"
              height="10"
              fill="#fff"
              stroke={ink}
              strokeWidth="2"
            />
          )),
        )}
        {etapa >= 3 && (
          <g>
            <circle cx="160" cy="32" r="16" fill="#25d366" stroke={ink} strokeWidth="3" />
            <path
              d="M154 32l4 4 8-9"
              stroke="#fff"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}
        {etapa === 0 && (
          <g>
            <circle cx="100" cy="60" r="18" fill="none" stroke={ink} strokeWidth="4" />
            <path d="M113 73l16 16" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
      <rect width="200" height="120" fill="#fff6cc" />
      <ellipse cx="100" cy="98" rx="62" ry="8" fill="#0001" />
      <path d="M44 62h112a56 20 0 0 0-112 0z" fill="#e9a23b" stroke={ink} strokeWidth="3" />
      <rect
        x="40"
        y="62"
        width="120"
        height="8"
        rx="4"
        fill="#4caf50"
        stroke={ink}
        strokeWidth="3"
      />
      <rect x="44" y="70" width="112" height="12" fill="#8b4a2b" stroke={ink} strokeWidth="3" />
      <path d="M44 82h112a56 14 0 0 1-112 0z" fill="#e9a23b" stroke={ink} strokeWidth="3" />
      {etapa >= 1 && (
        <g fill={ink}>
          <rect x="22" y="18" width="52" height="6" rx="3" />
          <rect x="22" y="30" width="38" height="6" rx="3" />
        </g>
      )}
      {etapa >= 2 && (
        <g>
          <circle cx="150" cy="26" r="11" fill="#25d366" stroke={ink} strokeWidth="3" />
          <circle cx="176" cy="26" r="11" fill="#ea1d2c" stroke={ink} strokeWidth="3" />
        </g>
      )}
      {etapa >= 3 && (
        <path d="M92 30l8 8 16-18" stroke={ink} strokeWidth="6" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

function Jornada() {
  const [seg, setSeg] = useState<Segmento>("servicos");
  const [etapa, setEtapa] = useState(0);
  const d = SEGMENTOS[seg];
  const e = d.etapas[etapa]!;
  return (
    <section id="jornada" className="xc-papel scroll-mt-20 border-t-2 border-[#0b0b0c]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Rotulo>02 — Duas jornadas. Um sistema.</Rotulo>
        <h2 className={`max-w-3xl text-3xl font-black leading-tight sm:text-5xl ${INK}`}>
          O que você quer <Marca>facilitar</Marca> para o seu cliente?
        </h2>

        <div role="tablist" aria-label="Segmento" className="mt-8 grid gap-4 sm:grid-cols-2">
          {(["servicos", "food"] as const).map((s) => {
            const ativo = s === seg;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={ativo}
                onClick={() => {
                  setSeg(s);
                  setEtapa(0);
                }}
                className={`xc-card p-6 text-left transition ${ativo ? "bg-accent" : "bg-white hover:-translate-y-0.5"}`}
              >
                <p className="text-xs font-extrabold tracking-[0.2em] text-black/60">
                  X-CLUB {s === "servicos" ? "SERVIÇOS" : "FOOD"}
                </p>
                <p className={`mt-2 text-2xl font-black ${INK}`}>{SEGMENTOS[s].jornadaTitulo}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-14">
          <Rotulo>03 — Uma experiência melhor</Rotulo>
          <h2 className={`max-w-3xl text-3xl font-black leading-tight sm:text-5xl ${INK}`}>
            Veja o X-Club na jornada do cliente.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-black/70">{d.jornadaDesc}</p>
          <p className="mt-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black/50">
            Exemplo interativo • Não é um case real
          </p>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_320px]">
            <ol className="grid gap-3">
              {d.etapas.map((et, i) => (
                <li key={et.label}>
                  <button
                    type="button"
                    onClick={() => setEtapa(i)}
                    aria-pressed={i === etapa}
                    className={`xc-card flex w-full items-start gap-4 p-5 text-left transition ${i === etapa ? "bg-accent" : "bg-white hover:-translate-y-0.5"}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#0b0b0c] bg-white text-sm font-black text-[#0b0b0c]">
                      {i + 1}
                    </span>
                    <span>
                      <span className={`block text-lg font-black ${INK}`}>{et.label}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-black/70">
                        {et.desc}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mx-auto w-[270px] rounded-[2.2rem] border-[3px] border-[#0b0b0c] bg-white p-3 shadow-[8px_8px_0_#0b0b0c]">
              <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-[#0b0b0c]" />
              <div className="aspect-[5/3] overflow-hidden rounded-xl border-2 border-[#0b0b0c]">
                <Cena seg={seg} etapa={etapa} />
              </div>
              <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-black/50">
                {e.kicker}
              </p>
              <p className={`mt-1 min-h-[3.2em] text-lg font-black leading-tight ${INK}`}>
                {e.phone}
              </p>
              <span className="mt-2 inline-block rounded-lg border-2 border-[#0b0b0c] bg-accent px-3 py-1.5 text-sm font-extrabold text-[#0b0b0c]">
                {e.cta}
              </span>
              <p className="mt-3 text-xs text-black/60">{e.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Estrutura() {
  const [seg] = useState<Segmento>("servicos");
  const d = SEGMENTOS[seg];
  return (
    <section className="xc-papel border-t-2 border-[#0b0b0c]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Rotulo>04 — Não é só presença. É uma estrutura.</Rotulo>
        <h2 className={`max-w-3xl text-3xl font-black leading-tight sm:text-5xl ${INK}`}>
          O que o X-Club <Marca>organiza</Marca> para você?
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="xc-card p-6 md:col-span-2">
            <p className="text-xs font-extrabold tracking-[0.2em] text-black/50">01 / X PRESENCE</p>
            <div className="mt-3 grid items-center gap-6 md:grid-cols-[1fr_320px]">
              <div>
                <h3 className={`text-2xl font-black ${INK}`}>Um site claro para cada decisão.</h3>
                <p className="mt-2 leading-relaxed text-black/70">
                  Site com 6 seções, pensado para apresentar a oferta e levar ao próximo passo.
                </p>
              </div>
              <div className="overflow-hidden rounded-xl border-2 border-[#0b0b0c] bg-white">
                <div className="flex gap-1.5 border-b-2 border-[#0b0b0c] bg-[#f4f0e3] px-3 py-2">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#0b0b0c]" />
                  <i className="h-2.5 w-2.5 rounded-full bg-[#0b0b0c]/50" />
                  <i className="h-2.5 w-2.5 rounded-full bg-[#0b0b0c]/25" />
                </div>
                <div className="p-4">
                  <p className={`text-base font-black ${INK}`}>{d.browserTitulo}</p>
                  <p className="mt-1 text-xs text-black/65">{d.browserDesc}</p>
                  <span className="mt-3 inline-block rounded-md border-2 border-[#0b0b0c] bg-accent px-2.5 py-1 text-xs font-extrabold text-[#0b0b0c]">
                    {d.browserBtn}
                  </span>
                </div>
              </div>
            </div>
          </article>
          <article className="xc-card p-6">
            <p className="text-xs font-extrabold tracking-[0.2em] text-black/50">02 / X LOCAL</p>
            <h3 className={`mt-3 text-xl font-black ${INK}`}>Google e descoberta local.</h3>
            <p className="mt-2 leading-relaxed text-black/70">
              Organização da presença local para facilitar que novas pessoas encontrem seu negócio.
            </p>
          </article>
          <article className="xc-card p-6">
            <p className="text-xs font-extrabold tracking-[0.2em] text-black/50">03 / X ADS</p>
            <h3 className={`mt-3 text-xl font-black ${INK}`}>
              Anúncios que levam ao destino certo.
            </h3>
            <p className="mt-2 leading-relaxed text-black/70">
              Meta Ads base: 1 campanha, 1 conjunto, 3 criativos. Verba de mídia separada.
            </p>
          </article>
          <article className="xc-card p-6">
            <p className="text-xs font-extrabold tracking-[0.2em] text-black/50">
              04 / X CONVERSION
            </p>
            <h3 className={`mt-3 text-xl font-black ${INK}`}>{d.conversaoTitulo}</h3>
            <p className="mt-2 leading-relaxed text-black/70">{d.conversaoTexto}</p>
          </article>
          {ENTREGAS_PEQUENAS.map((x) => (
            <article key={x.n} className="xc-card p-6">
              <p className="text-xs font-extrabold tracking-[0.2em] text-black/50">{x.n}</p>
              <h3 className={`mt-3 text-xl font-black ${INK}`}>{x.t}</h3>
              <p className="mt-2 leading-relaxed text-black/70">{x.d}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border-2 border-[#0b0b0c] bg-accent p-8 sm:p-10">
          <p className={`text-2xl font-black sm:text-3xl ${INK}`}>
            Não é sobre adicionar tarefas. É sobre diminuir obstáculos.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-4">
            {RESULTADOS.map((r) => (
              <li
                key={r.t}
                className="rounded-xl border-2 border-[#0b0b0c] bg-white p-4 text-center"
              >
                <span className="block text-2xl text-[#0b0b0c]" aria-hidden="true">
                  {r.i}
                </span>
                <span className="mt-1 block text-sm font-extrabold text-[#0b0b0c]">{r.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Implantacao() {
  return (
    <section className="xc-papel border-t-2 border-[#0b0b0c]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Rotulo>05 — Implantação e evolução</Rotulo>
        <h2 className={`max-w-3xl text-3xl font-black leading-tight sm:text-5xl ${INK}`}>
          Primeiro <Marca>estruturamos</Marca>. Depois ativamos. Então melhoramos.
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {ROADMAP.map((r, i) => (
            <li key={r.dias} className="xc-card relative p-6">
              <span className="absolute -top-3 right-4 rounded-full border-2 border-[#0b0b0c] bg-accent px-2.5 py-0.5 text-xs font-black text-[#0b0b0c]">
                {i + 1}
              </span>
              <p className="text-xs font-extrabold tracking-[0.18em] text-black/50">{r.dias}</p>
              <h3 className={`mt-3 text-xl font-black ${INK}`}>{r.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/70">{r.d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-black/60">
          O cronograma final é definido na proposta, conforme o segmento, a disponibilidade de
          acessos e materiais.
        </p>
      </div>
    </section>
  );
}

function Investimento() {
  return (
    <section id="investimento" className="scroll-mt-16 bg-[#0b0b0c] text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="mb-4 inline-block rounded-full border-2 border-accent px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent">
          06 — Investimento transparente
        </p>
        <h2 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
          O marketing local do seu negócio, <span className="text-accent">mais conectado.</span>
        </h2>

        <div className="xc-ticket mx-auto mt-12 max-w-xl text-[#0b0b0c]">
          <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-[#0b0b0c]/40 px-7 py-5">
            <div>
              <p className="text-xs font-extrabold tracking-[0.2em] text-black/60">CARTEIRINHA</p>
              <p className="text-2xl font-black">X-Club</p>
            </div>
            <img
              src="/ovelha.png"
              alt=""
              className="h-14 w-14 rounded-full border-2 border-[#0b0b0c] bg-white object-contain p-1"
            />
          </div>
          <div className="px-7 py-6">
            <p className="text-xs font-extrabold tracking-[0.2em] text-black/60">
              NOS PRIMEIROS 12 MESES
            </p>
            <p className="mt-1 text-5xl font-black sm:text-6xl">
              R$ 565,67<span className="text-lg font-extrabold text-black/60">/mês</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm font-semibold">
              <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
                <span>Operação mensal X-Club</span>
                <span>R$ 399,00</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-black/10 pb-2">
                <span>Site (parcela de referência, 12×)</span>
                <span>R$ 166,67</span>
              </li>
            </ul>
            <p className="mt-5 rounded-xl border-2 border-[#0b0b0c] bg-accent px-4 py-3 text-sm font-extrabold">
              Depois de quitar o site: R$ 399/mês
            </p>
            <p className="mt-5 text-xs leading-relaxed text-black/60">
              Mídia paga (verba de anúncios) é separada. Valor de referência do site: R$ 2.000.
              Domínio, hospedagem, licenças e manutenção conforme proposta.
            </p>
            <a
              href={linkWhatsApp(MSG_GERAL)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BTN_PRIMARIO} mt-6 w-full`}
            >
              Quero o X-Club
            </a>
          </div>
        </div>

        <h3 className="mt-20 text-2xl font-black sm:text-3xl">Expansões opcionais</h3>
        <p className="mt-2 max-w-2xl text-white/70">
          Quando seu negócio evoluir, a estrutura pode acompanhar.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXTENSOES.map((x) => (
            <article key={x.t} className="rounded-2xl border-2 border-white/20 p-5">
              <h4 className="text-lg font-black text-accent">{x.t}</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{x.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Perguntas() {
  return (
    <section className="xc-papel">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Rotulo>07 — Sem letras miúdas</Rotulo>
        <h2 className={`text-3xl font-black leading-tight sm:text-5xl ${INK}`}>
          Dúvidas? <Marca>Respondemos.</Marca>
        </h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((q) => (
            <details key={q.p} className="xc-card group p-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-black text-[#0b0b0c]">
                {q.p}
                <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-black/70">{q.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contato() {
  const [segmento, setSegmento] = useState<Segmento>("servicos");
  const [negocio, setNegocio] = useState("");
  const [nome, setNome] = useState("");
  const [fone, setFone] = useState("");
  const [desafio, setDesafio] = useState(DESAFIOS[0]!);
  const [aceite, setAceite] = useState(false);

  const campo =
    "w-full rounded-xl border-2 border-[#0b0b0c] bg-white px-4 py-3 text-[#0b0b0c] placeholder:text-black/40 focus:outline-none focus:shadow-[4px_4px_0_#fdca0a]";

  const enviar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const msg = [
      "Olá! Vim pela página do X-Club da Écsilab.",
      `Segmento: ${SEGMENTOS[segmento].rotulo}`,
      `Negócio: ${negocio}`,
      `Meu nome: ${nome}`,
      `WhatsApp: ${fone}`,
      `Maior desafio: ${desafio}`,
    ].join("\n");
    window.open(linkWhatsApp(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contato-xclub" className="xc-papel scroll-mt-16 border-t-2 border-[#0b0b0c]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div>
          <Rotulo>Começamos pelo seu negócio</Rotulo>
          <h2 className={`text-3xl font-black leading-tight sm:text-5xl ${INK}`}>
            Seu marketing pode estar perdendo oportunidades. <Marca>Vamos descobrir onde.</Marca>
          </h2>
          <ul className="mt-6 space-y-2 text-black/70">
            {[
              "Conversa por WhatsApp, sem compromisso",
              "Sem promessa de vendas garantidas",
              "Proposta clara, com valores e escopo",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#0b0b0c]" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={enviar} className="xc-card space-y-4 p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-[#0b0b0c]">Segmento</span>
            <select
              className={campo}
              value={segmento}
              onChange={(e) => setSegmento(e.target.value as Segmento)}
            >
              <option value="servicos">Serviços</option>
              <option value="food">Alimentação (Food)</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-[#0b0b0c]">
              Nome do negócio
            </span>
            <input
              className={campo}
              required
              value={negocio}
              onChange={(e) => setNegocio(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-[#0b0b0c]">Seu nome</span>
            <input
              className={campo}
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-[#0b0b0c]">WhatsApp</span>
            <input
              className={campo}
              required
              inputMode="tel"
              placeholder="(00) 00000-0000"
              value={fone}
              onChange={(e) => setFone(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold text-[#0b0b0c]">
              Maior desafio
            </span>
            <select className={campo} value={desafio} onChange={(e) => setDesafio(e.target.value)}>
              {DESAFIOS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <div className="text-black/75 [&_label]:text-black/75 [&_a]:!text-[#0b0b0c] [&_a]:underline">
            <AceitePrivacidade checked={aceite} onChange={setAceite} />
          </div>
          <button type="submit" className={`${BTN_PRIMARIO} w-full`}>
            Continuar no WhatsApp
          </button>
          <p className="text-xs text-black/55">
            Ao continuar, abrimos o WhatsApp com a mensagem pronta. Nada é enviado antes disso.
          </p>
        </form>
      </div>
    </section>
  );
}

export function XClubPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Faixa />
        <Custo />
        <Jornada />
        <Estrutura />
        <Implantacao />
        <Investimento />
        <Perguntas />
        <Contato />
      </main>
      <SiteFooter />
    </>
  );
}
