import { createClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

/** Cliente próprio da área do cliente: guarda a sessão no navegador (o do site não guarda). */
export const portal =
  url && key
    ? createClient(url, key, { auth: { persistSession: true, storageKey: "ecsilab-portal" } })
    : null;

export const BUCKET = "portal";

export type DocPortal = { caminho: string; titulo: string; formato: "html" | "pdf" | "outro" };

/** "01-planejamento-dezembro-janeiro.html" vira "Planejamento dezembro janeiro". */
export function tituloDoArquivo(nome: string): string {
  const base = nome
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : nome;
}

export function formatoDe(nome: string): DocPortal["formato"] {
  const ext = nome.split(".").pop()?.toLowerCase();
  return ext === "html" ? "html" : ext === "pdf" ? "pdf" : "outro";
}

export async function entrar(email: string, senha: string): Promise<string | null> {
  if (!portal) return "O acesso está indisponível no momento. Tente novamente em instantes.";
  const { error } = await portal.auth.signInWithPassword({ email: email.trim(), password: senha });
  return error ? "E-mail ou senha incorretos." : null;
}

export async function sair() {
  await portal?.auth.signOut();
}

/** Confere se o usuário logado tem acesso a este cliente. */
export async function temAcesso(cliente: string): Promise<boolean> {
  if (!portal) return false;
  const { data, error } = await portal
    .from("portal_clientes")
    .select("cliente")
    .eq("cliente", cliente)
    .limit(1);
  return !error && Array.isArray(data) && data.length > 0;
}

export async function listarDocs(cliente: string): Promise<DocPortal[]> {
  if (!portal) return [];
  const { data, error } = await portal.storage.from(BUCKET).list(cliente, {
    limit: 100,
    sortBy: { column: "name", order: "asc" },
  });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && !f.name.startsWith(".") && f.id)
    .map((f) => ({
      caminho: `${cliente}/${f.name}`,
      titulo: tituloDoArquivo(f.name),
      formato: formatoDe(f.name),
    }));
}

export async function lerTexto(caminho: string): Promise<string | null> {
  if (!portal) return null;
  const { data, error } = await portal.storage.from(BUCKET).download(caminho);
  return error || !data ? null : await data.text();
}

export async function linkTemporario(caminho: string, baixarComo?: string): Promise<string | null> {
  if (!portal) return null;
  const { data, error } = await portal.storage
    .from(BUCKET)
    .createSignedUrl(caminho, 600, baixarComo ? { download: baixarComo } : undefined);
  return error || !data ? null : data.signedUrl;
}

/** Equipe Écsilab: pode enviar, substituir e apagar materiais. A regra real fica no banco (RLS). */
export async function ehAdmin(): Promise<boolean> {
  if (!portal) return false;
  const { data, error } = await portal.from("portal_admins").select("user_id").limit(1);
  return !error && Array.isArray(data) && data.length > 0;
}

/** Mantém letras (com acento), números, espaço, ponto, hífen, sublinhado e parênteses. */
export function nomeSeguro(nome: string): string {
  const limpo = nome
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} ._()-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return limpo || "arquivo";
}

const TIPOS: Record<string, string> = {
  html: "text/html",
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
};

export function extensaoPermitida(nome: string): boolean {
  const ext = nome.split(".").pop()?.toLowerCase() ?? "";
  return ext in TIPOS;
}

/** Envia (ou substitui) um arquivo na pasta do cliente. Devolve uma mensagem de erro ou null. */
export async function enviarArquivo(cliente: string, arquivo: File): Promise<string | null> {
  if (!portal) return "O envio está indisponível no momento.";
  const nome = nomeSeguro(arquivo.name);
  const ext = nome.split(".").pop()?.toLowerCase() ?? "";
  if (!(ext in TIPOS)) return `${nome}: use arquivos HTML, PDF, TXT ou MD.`;
  const { error } = await portal.storage
    .from(BUCKET)
    .upload(`${cliente}/${nome}`, arquivo, { upsert: true, contentType: TIPOS[ext] });
  return error ? `${nome}: não foi possível enviar (${error.message}).` : null;
}

export async function apagarArquivo(caminho: string): Promise<string | null> {
  if (!portal) return "A exclusão está indisponível no momento.";
  const { error } = await portal.storage.from(BUCKET).remove([caminho]);
  return error ? `Não foi possível apagar (${error.message}).` : null;
}
