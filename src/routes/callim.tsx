import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, FileType2, LogOut, Sparkles, Upload, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { OvelhaPoeira } from "@/components/ovelha-poeira";
import {
  apagarArquivo,
  ehAdmin,
  enviarArquivo,
  entrar,
  linkTemporario,
  lerTexto,
  listarDocs,
  portal,
  sair,
  temAcesso,
  type DocPortal,
} from "@/lib/portal";

const CLIENTE = "callim";
const NOME_CLIENTE = "Callim";

export const Route = createFileRoute("/callim")({
  head: () => ({
    meta: [
      { title: "Callim | Área do cliente Écsilab" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AreaCallim,
});

type Estado = "carregando" | "login" | "sem-acesso" | "ok";

function AreaCallim() {
  const [estado, setEstado] = useState<Estado>("carregando");
  const [docs, setDocs] = useState<DocPortal[]>([]);
  const [admin, setAdmin] = useState(false);
  const [nome, setNome] = useState<string | null>(null);

  async function recarregarDocs() {
    setDocs(await listarDocs(CLIENTE));
  }

  async function carregar() {
    if (!portal) return setEstado("login");
    const { data } = await portal.auth.getSession();
    if (!data.session) return setEstado("login");
    const adm = await ehAdmin();
    if (!adm && !(await temAcesso(CLIENTE))) return setEstado("sem-acesso");
    const meta = data.session.user.user_metadata as { nome?: unknown } | undefined;
    setNome(typeof meta?.nome === "string" && meta.nome.trim() ? meta.nome.trim() : null);
    setAdmin(adm);
    await recarregarDocs();
    setEstado("ok");
  }

  useEffect(() => {
    void carregar();
    const sub = portal?.auth.onAuthStateChange((evento) => {
      if (evento === "SIGNED_IN" || evento === "SIGNED_OUT") void carregar();
    });
    return () => sub?.data.subscription.unsubscribe();
  }, []);

  if (estado === "carregando") {
    return (
      <Tela>
        <OvelhaPoeira className="mx-auto w-40" />
        <p className="mt-4 text-sm text-paper/60">Carregando…</p>
      </Tela>
    );
  }
  if (estado === "login") return <Login />;
  if (estado === "sem-acesso") {
    return (
      <Tela>
        <h1 className="text-2xl font-bold">Sem acesso a esta área</h1>
        <p className="mt-3 text-paper/70">
          Esta conta não tem acesso aos materiais da {NOME_CLIENTE}. Fale com a Écsilab.
        </p>
        <button
          onClick={() => void sair()}
          className="mt-6 rounded-md bg-accent px-4 py-2 font-semibold text-ink"
        >
          Sair
        </button>
      </Tela>
    );
  }
  return <Materiais docs={docs} admin={admin} nome={nome} recarregar={recarregarDocs} />;
}

function FundoOvelha() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <img
        src="/ovelha-preta.png"
        alt=""
        className="w-[min(88vw,760px)] max-w-none select-none opacity-60"
      />
    </div>
  );
}

function Tela({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <FundoOvelha />
      <div className="tech-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </main>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(await entrar(email, senha));
    setEnviando(false);
  }

  return (
    <Tela>
      <img src="/logo-ecsilab.png" alt="Écsilab" className="mx-auto h-8 w-auto" />
      <OvelhaPoeira className="mx-auto mt-6 w-52 sm:w-60" />
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        Área do cliente
      </p>
      <h1 className="mt-2 text-3xl font-bold">{NOME_CLIENTE}</h1>
      <p className="mt-2 text-paper/70">Entre para ver os planejamentos e roteiros.</p>
      <form onSubmit={enviar} className="mt-8 space-y-4 text-left">
        <label className="block text-sm">
          E-mail
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-white/[0.03] px-3 py-2.5 text-paper outline-none transition focus:border-accent"
          />
        </label>
        <label className="block text-sm">
          Senha
          <input
            type="password"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-white/[0.03] px-3 py-2.5 text-paper outline-none transition focus:border-accent"
          />
        </label>
        {erro ? (
          <p role="alert" className="text-sm text-red-400">
            {erro}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={enviando}
          className="btn-neon w-full rounded-lg bg-accent px-4 py-2.5 font-semibold text-ink disabled:opacity-60"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </Tela>
  );
}

function saudacao(): string {
  const h = new Date().getHours();
  return h < 5 ? "Boa madrugada" : h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function dataCurta(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function ehNovo(iso?: string): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && Date.now() - t < 7 * 24 * 60 * 60 * 1000;
}

async function baixar(doc: DocPortal) {
  const nomeDoArquivo = doc.caminho.split("/").pop() ?? doc.titulo;
  if (doc.formato === "html") {
    const conteudo = await lerTexto(doc.caminho);
    if (conteudo !== null) {
      const arquivo = new Blob([conteudo], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(arquivo);
      const a = document.createElement("a");
      a.href = url;
      a.download = nomeDoArquivo;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }
  }
  const url = await linkTemporario(doc.caminho, nomeDoArquivo);
  if (url) window.location.assign(url);
}

function Materiais({
  docs,
  admin,
  nome,
  recarregar,
}: {
  docs: DocPortal[];
  admin: boolean;
  nome: string | null;
  recarregar: () => Promise<void>;
}) {
  const [aberto, setAberto] = useState<DocPortal | null>(null);
  const [apagando, setApagando] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Mais recentes primeiro.
  const ordenados = [...docs].sort((a, b) =>
    (b.atualizadoEm ?? "").localeCompare(a.atualizadoEm ?? ""),
  );
  const ultima = ordenados.map((d) => dataCurta(d.atualizadoEm)).find(Boolean) ?? null;

  useEffect(() => {
    if (!aberto) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(null);
    };
    window.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = antes;
      window.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const campo = e.currentTarget.elements.namedItem("arquivos") as HTMLInputElement;
    const arquivos = Array.from(campo.files ?? []);
    if (arquivos.length === 0) return setAviso("Escolha um ou mais arquivos.");
    setEnviando(true);
    setAviso(null);
    const erros: string[] = [];
    for (const a of arquivos) {
      const erro = await enviarArquivo(CLIENTE, a);
      if (erro) erros.push(erro);
    }
    await recarregar();
    campo.value = "";
    setEnviando(false);
    setAviso(
      erros.length
        ? erros.join(" ")
        : `${arquivos.length === 1 ? "Arquivo enviado" : "Arquivos enviados"}. Arquivo com o mesmo nome é substituído.`,
    );
  }

  async function apagar(doc: DocPortal) {
    if (apagando !== doc.caminho) return setApagando(doc.caminho);
    setApagando(null);
    const erro = await apagarArquivo(doc.caminho);
    setAviso(erro ?? `${doc.titulo} apagado.`);
    await recarregar();
  }

  return (
    <>
      <FundoOvelha />
      <header className="sticky top-0 z-30 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" aria-label="Écsilab, página inicial">
            <img src="/logo-ecsilab.png" alt="Écsilab" className="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-accent sm:inline">
              Área do cliente
            </span>
            <button
              onClick={() => void sair()}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm text-paper/80 transition hover:border-accent hover:text-accent"
            >
              <LogOut size={15} aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01]">
          <div className="tech-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative grid items-center gap-2 px-6 py-8 sm:px-10 md:grid-cols-[1.25fr_1fr] md:py-10">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-accent/[0.14] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <Sparkles size={13} aria-hidden="true" />
                {NOME_CLIENTE} · Écsilab
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                {saudacao()},{" "}
                <span className="shimmer-text">
                  {admin ? "equipe Écsilab" : (nome ?? "bem-vindo")}
                </span>
                .
              </h1>
              <p className="mt-4 max-w-xl text-base text-paper/75 sm:text-lg">
                {admin
                  ? `Aqui você publica os materiais da ${NOME_CLIENTE} e confere como o cliente vê.`
                  : `Aqui ficam os planejamentos e roteiros da ${NOME_CLIENTE}, preparados pela Écsilab e sempre atualizados.`}
              </p>
              <dl className="mt-6 flex flex-wrap gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
                  <dt className="text-xs uppercase tracking-wider text-paper/50">Materiais</dt>
                  <dd className="text-lg font-bold">{docs.length}</dd>
                </div>
                {ultima ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
                    <dt className="text-xs uppercase tracking-wider text-paper/50">
                      Última atualização
                    </dt>
                    <dd className="text-lg font-bold">{ultima}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
            <OvelhaPoeira className="mx-auto w-full max-w-[300px] md:max-w-[340px]" />
          </div>
        </section>

        {admin ? (
          <details
            open={docs.length === 0}
            className="group mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
              <Upload size={16} className="text-accent" aria-hidden="true" />
              Enviar materiais (equipe Écsilab)
            </summary>
            <form onSubmit={enviar} aria-label="Enviar materiais" className="mt-4">
              <p className="text-xs text-paper/60">
                HTML, PDF, TXT ou MD, até 20 MB. O nome do arquivo vira o título para o cliente.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                  name="arquivos"
                  type="file"
                  multiple
                  accept=".html,.pdf,.txt,.md"
                  className="text-sm"
                />
                <button
                  type="submit"
                  disabled={enviando}
                  className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-ink disabled:opacity-60"
                >
                  {enviando ? "Enviando…" : "Enviar"}
                </button>
              </div>
              {aviso ? (
                <p role="status" className="mt-3 text-sm text-paper/80">
                  {aviso}
                </p>
              ) : null}
            </form>
          </details>
        ) : null}

        <section className="mt-10" aria-label="Materiais">
          <h2 className="text-2xl font-bold">Materiais</h2>
          <p className="mt-1 text-sm text-paper/60">Clique em um card para abrir.</p>

          {ordenados.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-paper/70">
              Os primeiros materiais estão a caminho. Assim que a Écsilab publicar, eles aparecem
              aqui.
            </p>
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ordenados.map((d, i) => {
                const amarelo = i % 2 === 0;
                const data = dataCurta(d.atualizadoEm);
                return (
                  <li
                    key={d.caminho}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_60px_-20px_rgba(253,202,10,0.35)]"
                  >
                    <button
                      onClick={() => setAberto(d)}
                      aria-label={`Abrir ${d.titulo}`}
                      className={`relative flex h-40 items-end justify-between overflow-hidden p-4 text-left ${
                        amarelo ? "bg-accent text-ink" : "bg-ink text-paper"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 opacity-30 transition duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: amarelo
                            ? "radial-gradient(circle, rgba(0,0,0,.45) 1px, transparent 1.5px)"
                            : "radial-gradient(circle, rgba(253,202,10,.7) 1px, transparent 1.5px)",
                          backgroundSize: "14px 14px",
                        }}
                      />
                      {!amarelo ? (
                        <span
                          aria-hidden="true"
                          className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-accent/25 blur-3xl"
                        />
                      ) : null}
                      <span
                        className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${
                          amarelo ? "bg-ink text-accent" : "bg-accent text-ink"
                        }`}
                      >
                        {d.formato === "pdf" ? (
                          <FileType2 size={22} aria-hidden="true" />
                        ) : (
                          <FileText size={22} aria-hidden="true" />
                        )}
                      </span>
                      <span className="relative flex gap-2">
                        {ehNovo(d.atualizadoEm) ? (
                          <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink">
                            Novo
                          </span>
                        ) : null}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                            amarelo ? "bg-ink/80 text-accent" : "bg-white/10 text-paper"
                          }`}
                        >
                          {d.formato === "outro" ? "Arquivo" : d.formato}
                        </span>
                      </span>
                    </button>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold leading-snug">{d.titulo}</h3>
                      <p className="mt-1 text-xs text-paper/50">
                        {data ? `Atualizado em ${data}` : "Material da campanha"}
                      </p>
                      <div className="mt-5 flex items-center gap-2">
                        <button
                          onClick={() => setAberto(d)}
                          className="flex-1 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-ink transition hover:opacity-90"
                        >
                          Abrir
                        </button>
                        <button
                          onClick={() => void baixar(d)}
                          aria-label={`Baixar ${d.titulo}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-paper/80 transition hover:border-accent hover:text-accent"
                        >
                          <Download size={15} aria-hidden="true" />
                          Baixar
                        </button>
                      </div>
                      {admin ? (
                        <button
                          onClick={() => void apagar(d)}
                          onBlur={() => setApagando(null)}
                          className="mt-3 self-start text-xs text-red-400 hover:underline"
                        >
                          {apagando === d.caminho ? "Clique de novo para apagar" : "Apagar"}
                        </button>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-paper/50">
          <span>Écsilab · Marketing e Growth</span>
          <span>Área restrita. Não compartilhe seu acesso.</span>
        </footer>
      </main>

      {aberto ? <Leitor doc={aberto} fechar={() => setAberto(null)} /> : null}
    </>
  );
}

function Leitor({ doc, fechar }: { doc: DocPortal; fechar: () => void }) {
  const [html, setHtml] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let ativo = true;
    setHtml(null);
    setPdf(null);
    setFalhou(false);
    if (doc.formato === "html") {
      void lerTexto(doc.caminho).then((t) => {
        if (!ativo) return;
        if (t === null) setFalhou(true);
        else setHtml(t);
      });
    } else {
      void linkTemporario(doc.caminho).then((u) => {
        if (!ativo) return;
        if (u === null) setFalhou(true);
        else setPdf(u);
      });
    }
    return () => {
      ativo = false;
    };
  }, [doc]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={doc.titulo}
      className="fixed inset-0 z-50 flex flex-col bg-ink"
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
        <button
          onClick={fechar}
          className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm text-paper/80 transition hover:border-accent hover:text-accent"
        >
          <X size={15} aria-hidden="true" />
          Voltar aos materiais
        </button>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold">{doc.titulo}</p>
        <button
          onClick={() => void baixar(doc)}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-ink"
        >
          <Download size={15} aria-hidden="true" />
          Baixar
        </button>
      </div>
      <div className="min-h-0 flex-1 bg-white">
        {falhou ? (
          <p className="p-6 text-ink">Não foi possível abrir este material agora.</p>
        ) : doc.formato === "html" ? (
          html === null ? (
            <p className="p-6 text-ink">Carregando…</p>
          ) : (
            <iframe
              title={doc.titulo}
              srcDoc={html}
              sandbox="allow-scripts allow-popups"
              className="h-full w-full"
            />
          )
        ) : pdf === null ? (
          <p className="p-6 text-ink">Carregando…</p>
        ) : (
          <iframe title={doc.titulo} src={pdf} className="h-full w-full" />
        )}
      </div>
    </div>
  );
}
