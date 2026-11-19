/**
 * Cabeçalhos de segurança das páginas do site.
 *
 * - CSP: só carrega scripts, estilos, imagens e conexões das origens que o site realmente usa
 *   (próprio domínio, Supabase, Cloudflare Web Analytics e Google Fonts da página /callim).
 *   'unsafe-inline' é necessário porque o TanStack Start injeta scripts de hidratação no HTML.
 * - HSTS: o navegador passa a usar sempre HTTPS. Sem includeSubDomains/preload de propósito.
 * - O restante bloqueia clickjacking, detecção errada de tipo de arquivo e vazamento de URL completa.
 *
 * A área interna /callim abre documentos enviados pela equipe (HTML e PDF) em iframes; por isso
 * ela, e a API, ficam sem CSP, só com os demais cabeçalhos.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cloudflareinsights.com",
  "frame-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const FIXOS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

export function aplicarCabecalhosDeSeguranca(request: Request, response: Response): Response {
  const { pathname } = new URL(request.url);
  const semCsp = pathname.startsWith("/callim") || pathname.startsWith("/api/");
  const nova = new Response(response.body, response);
  for (const [nome, valor] of Object.entries(FIXOS)) nova.headers.set(nome, valor);
  if (!semCsp && (nova.headers.get("content-type") ?? "").includes("text/html")) {
    nova.headers.set("Content-Security-Policy", CSP);
  }
  return nova;
}
