import { createFileRoute } from "@tanstack/react-router";

import { XClubPage } from "@/components/xclub-page";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/x-club")({
  head: () =>
    seo({
      titulo: "X-Club | Marketing local conectado, da busca ao contato | Écsilab",
      descricao:
        "Site, Google, anúncios e canais de contato conectados em uma operação de marketing local para negócios de serviços e alimentação. A partir de R$ 399/mês, sem promessas de vendas garantidas.",
      caminho: "/x-club",
    }),
  component: XClubPage,
});
