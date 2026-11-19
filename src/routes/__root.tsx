import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Mascote } from "../components/animated-icons";
import { ConsentBanner } from "../components/consent-banner";
import { WhatsAppFlutuante } from "../components/whatsapp-flutuante";
import {
  DESCRICAO_PADRAO,
  ORGANIZACAO,
  SITE,
  SITE_SCHEMA,
  TITULO_PADRAO,
  jsonLdScript,
} from "../lib/seo";
import appCss from "../styles.css?url";

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Mascote className="h-28 w-28" />
      <h1 className="text-6xl font-bold text-accent">404</h1>
      <p className="text-paper/70">Esta página não existe ou foi movida.</p>
      <Link to="/" className="rounded-md bg-accent px-4 py-2 font-medium text-ink">
        Voltar ao início
      </Link>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITULO_PADRAO },
      { name: "description", content: DESCRICAO_PADRAO },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "theme-color", content: "#0b0b0c" },
      // Prévia ao compartilhar o link (WhatsApp, LinkedIn, Facebook, X): o que vale para o site todo
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Écsilab" },
      { property: "og:image", content: `${SITE}/og-image.jpg` },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Écsilab: enquanto o mercado segue o rebanho, a gente inventa o pasto." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE}/og-image.jpg` },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/ovelha.png" },
      { rel: "apple-touch-icon", href: "/ovelha.png" },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [jsonLdScript(ORGANIZACAO), jsonLdScript(SITE_SCHEMA)],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <WhatsAppFlutuante />
      <ConsentBanner />
    </QueryClientProvider>
  );
}
