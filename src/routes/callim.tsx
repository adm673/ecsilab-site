import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

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

  async function recarregarDocs() {
    setDocs(await listarDocs(CLIENTE));
  }

  async function carregar() {
    if (!portal) return setEstado("login");
    const { data } = await portal.auth.getSession();
    if (!data.session) return setEstado("login");
    const adm = await ehAdmin();
    if (!adm && !(await temAcesso(CLIENTE))) return setEstado("sem-acesso");
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
        <p className="text-paper/60">Carregando…</p>
      </Tela>
    );
  }
  if (estado === "login") return <Login />;
  if (estado === "sem-acesso") {
    return (
      <Tela>
        <h1 className="text-2xl font-bold">Sem acesso a esta área</h1>
        <p className="mt-3 text-paper/70">
          Esta conta não tem acesso aos materiais da Callim. Fale com a Écsilab.
        </p>
        <button
          onClick={() => void sair()}
          className="mt-6 rounded-md bg-accent px-4 py-2 font-medium text-ink"
        >
          Sair
        </button>
      </Tela>
    );
  }
  return <Materiais docs={docs} admin={admin} recarregar={recarregarDocs} />;
}

function Tela({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="w-full max-w-md">{children}</div>
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
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Écsilab · Área do cliente
      </p>
      <h1 className="mt-3 text-3xl font-bold">Callim</h1>
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
            className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-paper outline-none focus:border-accent"
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
            className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-paper outline-none focus:border-accent"
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
          className="w-full rounded-md bg-accent px-4 py-2 font-semibold text-ink disabled:opacity-60"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </Tela>
  );
}

function Materiais({
  docs,
  admin,
  recarregar,
}: {
  docs: DocPortal[];
  admin: boolean;
  recarregar: () => Promise<void>;
}) {
  const [aberto, setAberto] = useState<DocPortal | null>(docs[0] ?? null);
  const [apagando, setApagando] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // Mantém o material aberto coerente depois de enviar ou apagar.
    setAberto((atual) => docs.find((d) => d.caminho === atual?.caminho) ?? docs[0] ?? null);
  }, [docs]);

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

  const [html, setHtml] = useState<string | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    setHtml(null);
    setFalhou(false);
    if (!aberto) return;
    let ativo = true;
    if (aberto.formato === "html") {
      void lerTexto(aberto.caminho).then((t) => {
        if (!ativo) return;
        if (t === null) setFalhou(true);
        else setHtml(t);
      });
    }
    return () => {
      ativo = false;
    };
  }, [aberto]);

  async function abrir(doc: DocPortal) {
    const url = await linkTemporario(doc.caminho);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function baixar(doc: DocPortal, conteudo: string | null) {
    const nomeDoArquivo = doc.caminho.split("/").pop() ?? doc.titulo;
    if (doc.formato === "html" && conteudo !== null) {
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
    const url = await linkTemporario(doc.caminho, nomeDoArquivo);
    if (url) window.location.assign(url);
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Écsilab · Área do cliente
          </p>
          <h1 className="text-2xl font-bold">Callim</h1>
        </div>
        <button
          onClick={() => void sair()}
          className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-accent"
        >
          Sair
        </button>
      </header>

      {admin ? (
        <form
          onSubmit={enviar}
          className="mt-6 rounded-lg border border-line p-4"
          aria-label="Enviar materiais"
        >
          <p className="text-sm font-semibold">Enviar materiais (equipe Écsilab)</p>
          <p className="mt-1 text-xs text-paper/60">
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
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-ink disabled:opacity-60"
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
      ) : null}

      {docs.length === 0 ? (
        <p className="mt-10 text-paper/70">Ainda não há materiais publicados.</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Materiais" className="space-y-2">
            {docs.map((d) => (
              <div key={d.caminho}>
                <button
                  onClick={() => setAberto(d)}
                  className={`block w-full rounded-md border px-3 py-2 text-left text-sm ${
                    aberto?.caminho === d.caminho
                      ? "border-accent bg-accent/10"
                      : "border-line hover:border-accent/60"
                  }`}
                >
                  {d.titulo}
                  <span className="ml-2 text-xs uppercase text-paper/50">{d.formato}</span>
                </button>
                {admin ? (
                  <button
                    onClick={() => void apagar(d)}
                    onBlur={() => setApagando(null)}
                    className="mt-1 text-xs text-red-400 hover:underline"
                  >
                    {apagando === d.caminho ? "Clique de novo para apagar" : "Apagar"}
                  </button>
                ) : null}
              </div>
            ))}
          </nav>

          <section className="min-h-[70vh] overflow-hidden rounded-lg border border-line bg-white">
            {aberto ? (
              <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-2 text-ink">
                <p className="truncate text-sm font-semibold">{aberto.titulo}</p>
                <button
                  onClick={() => void baixar(aberto, html)}
                  disabled={aberto.formato === "html" && html === null}
                  className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-ink disabled:opacity-60"
                >
                  Baixar arquivo
                </button>
              </div>
            ) : null}
            {!aberto ? null : aberto.formato === "html" ? (
              falhou ? (
                <p className="p-6 text-ink">Não foi possível abrir este material agora.</p>
              ) : html === null ? (
                <p className="p-6 text-ink">Carregando…</p>
              ) : (
                <iframe
                  title={aberto.titulo}
                  srcDoc={html}
                  sandbox="allow-scripts allow-popups"
                  className="h-[75vh] w-full"
                />
              )
            ) : (
              <div className="p-6 text-ink">
                <p className="font-semibold">{aberto.titulo}</p>
                <button
                  onClick={() => void abrir(aberto)}
                  className="mt-4 rounded-md bg-ink px-4 py-2 text-paper"
                >
                  Abrir arquivo
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
