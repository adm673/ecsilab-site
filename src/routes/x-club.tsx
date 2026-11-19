import { createFileRoute } from "@tanstack/react-router";

import { XClubPage } from "@/components/xclub-page";
import { FAQ } from "@/lib/xclub";
import { faq, seo, servico } from "@/lib/seo";

export const Route = createFileRoute("/x-club")({
  head: () =>
    seo({
      titulo: "X-Club | Marketing local conectado, da busca ao contato | Écsilab",
      descricao:
        "Site, Google, anúncios e canais de contato conectados em uma operação de marketing local para negócios de serviços e alimentação. A partir de R$ 399/mês, sem promessas de vendas garantidas.",
      caminho: "/x-club",
      nome: "X-Club",
      dados: [
        servico({
          nome: "X-Club",
          descricao:
            "Operação de marketing local com site, presença no Google, anúncios e canais de contato conectados, para negócios de serviços e alimentação.",
          caminho: "/x-club",
          tipo: "Marketing local",
          oferta: { preco: 399, periodo: "MON" },
        }),
        faq(FAQ),
      ],
    }),
  component: XClubPage,
});
