import { createFileRoute } from "@tanstack/react-router";

import { SolucoesPage } from "@/components/solucoes-page";
import { seo, servico } from "@/lib/seo";

export const Route = createFileRoute("/solucoes")({
  head: () =>
    seo({
      titulo: "Soluções | Serviços e soluções de IA da Écsilab",
      descricao:
        "Serviços conduzidos pela Écsilab e soluções de inteligência artificial prontas para implantar na sua operação: vendas, atendimento, finanças e gestão.",
      caminho: "/solucoes",
      nome: "Soluções",
      dados: [
        servico({
          nome: "Serviços e soluções de inteligência artificial",
          descricao:
            "Serviços de marketing, growth e processos conduzidos pela Écsilab e soluções de IA prontas para implantar em vendas, atendimento, finanças e gestão.",
          caminho: "/solucoes",
          tipo: "Marketing, growth e inteligência artificial",
        }),
      ],
    }),
  component: SolucoesPage,
});
