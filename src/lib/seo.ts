import { RESPONSAVEL } from "./legal";

export const SITE = "https://ecsilab.com.br";

export const TITULO_PADRAO = "Écsilab | Growth, processos e escala comercial";
export const DESCRICAO_PADRAO =
  "A Écsilab é onde Marketing, Engenharia de Processos, Estratégia de Growth e Máquinas de Vendas se unem para tirar o seu negócio do improviso.";

type JsonLd = Record<string, unknown>;

/** Dados estruturados (schema.org) em JSON-LD, no formato que o TanStack Router espera em `scripts`. */
export function jsonLdScript(dados: JsonLd) {
  return {
    type: "application/ld+json",
    // "<" escapado para o JSON nunca poder fechar a tag <script> antes da hora.
    children: JSON.stringify(dados).replace(/</g, "\\u003c"),
  };
}

/** Quem é a Écsilab: usado em todas as páginas (Google, assistentes de IA e prévias de link). */
export const ORGANIZACAO: JsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE}/#organizacao`,
  name: "Écsilab",
  legalName: RESPONSAVEL.razaoSocial,
  url: SITE,
  logo: `${SITE}/logo-ecsilab.png`,
  image: `${SITE}/og-image.jpg`,
  description: DESCRICAO_PADRAO,
  slogan: "Enquanto o mercado segue o rebanho, a gente inventa o pasto.",
  telephone: RESPONSAVEL.whatsapp,
  areaServed: { "@type": "Country", name: "Brasil" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Duque de Caxias, 931, Central",
    addressLocality: "Macapá",
    addressRegion: "AP",
    postalCode: "68900-071",
    addressCountry: "BR",
  },
  founder: { "@type": "Person", name: "Marcelo Teles" },
  knowsAbout: [
    "Marketing",
    "Engenharia de processos",
    "Estratégia de growth",
    "Vendas",
    "Inteligência artificial",
    "Teoria das Restrições",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: RESPONSAVEL.whatsapp,
    availableLanguage: "pt-BR",
  },
};

export const SITE_SCHEMA: JsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#site`,
  url: SITE,
  name: "Écsilab",
  inLanguage: "pt-BR",
  publisher: { "@id": `${SITE}/#organizacao` },
};

/** Trilha de navegação ("Início > Página"), que o Google mostra no lugar da URL nos resultados. */
export function breadcrumb(nome: string, caminho: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE },
      { "@type": "ListItem", position: 2, name: nome, item: `${SITE}${caminho}` },
    ],
  };
}

/** Descreve um serviço oferecido pela Écsilab. `oferta` só entra quando há preço público. */
export function servico({
  nome,
  descricao,
  caminho,
  tipo,
  oferta,
}: {
  nome: string;
  descricao: string;
  caminho: string;
  tipo: string;
  oferta?: { preco: number; periodo?: "MON" };
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nome,
    description: descricao,
    url: `${SITE}${caminho}`,
    serviceType: tipo,
    provider: { "@id": `${SITE}/#organizacao` },
    areaServed: { "@type": "Country", name: "Brasil" },
    ...(oferta && {
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: oferta.preco,
          priceCurrency: "BRL",
          ...(oferta.periodo && { unitCode: oferta.periodo }),
        },
      },
    }),
  };
}

/** Perguntas e respostas que já aparecem na página, no formato de resultado expandido do Google. */
export function faq(itens: { p: string; r: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: itens.map(({ p, r }) => ({
      "@type": "Question",
      name: p,
      acceptedAnswer: { "@type": "Answer", text: r },
    })),
  };
}

/** Etiquetas de busca e de compartilhamento próprias de cada página. */
export function seo({
  titulo,
  descricao,
  caminho,
  nome,
  dados = [],
}: {
  titulo: string;
  descricao: string;
  caminho: string;
  /** Nome curto da página na trilha de navegação. Sem ele (home), não há trilha. */
  nome?: string;
  /** Dados estruturados extras desta página. */
  dados?: JsonLd[];
}) {
  const todos = [...(nome ? [breadcrumb(nome, caminho)] : []), ...dados];
  return {
    meta: [
      { title: titulo },
      { name: "description", content: descricao },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descricao },
      { property: "og:url", content: `${SITE}${caminho}` },
      { name: "twitter:title", content: titulo },
      { name: "twitter:description", content: descricao },
    ],
    links: [{ rel: "canonical", href: `${SITE}${caminho}` }],
    scripts: todos.map(jsonLdScript),
  };
}
