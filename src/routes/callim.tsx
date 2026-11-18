import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import {
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

  async function carregar() {
    if (!portal) return setEstado("login");
    const { data } = await portal.auth.getSession();
    if (!data.session) return setEstado("login");
    if (!(await temAcesso(CLIENTE))) return setEstado("sem-acesso");
    setDocs(await listarDocs(CLIENTE));
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
  return <Materiais docs={docs} />;
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

function Materiais({ docs }: { docs: DocPortal[] }) {
  const [aberto, setAberto] = useState<DocPortal | null>(docs[0] ?? null);
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

  async function baixar(doc: DocPortal) {
    const url = await linkTemporario(doc.caminho);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
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

      {docs.length === 0 ? (
        <p className="mt-10 text-paper/70">Ainda não há materiais publicados.</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Materiais" className="space-y-2">
            {docs.map((d) => (
              <button
                key={d.caminho}
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
            ))}
          </nav>

          <section className="min-h-[70vh] overflow-hidden rounded-lg border border-line bg-white">
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
                  className="h-[80vh] w-full"
                />
              )
            ) : (
              <div className="p-6 text-ink">
                <p className="font-semibold">{aberto.titulo}</p>
                <button
                  onClick={() => void baixar(aberto)}
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
