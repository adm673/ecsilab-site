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

export async function linkTemporario(
  caminho: string,
  baixarComo?: string,
): Promise<string | null> {
  if (!portal) return null;
  const { data, error } = await portal.storage
    .from(BUCKET)
    .createSignedUrl(caminho, 600, baixarComo ? { download: baixarComo } : undefined);
  return error || !data ? null : data.signedUrl;
}
