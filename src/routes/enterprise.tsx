import { createFileRoute } from "@tanstack/react-router";

import { EnterprisePage } from "@/components/enterprise-page";
import { seo, servico } from "@/lib/seo";

export const Route = createFileRoute("/enterprise")({
  head: () =>
    seo({
      titulo: "Écsilab Enterprise | Departamentos inteiros operando com IA, com a infraestrutura sua",
      descricao:
        "Implantamos departamentos inteiros com inteligência artificial na sua empresa: pagamento único, infraestrutura em nome da sua empresa e sem mensalidade nossa para continuar funcionando.",
      caminho: "/enterprise",
      nome: "Enterprise",
      dados: [
        servico({
          nome: "Écsilab Enterprise",
          descricao:
            "Implantação de departamentos inteiros operando com inteligência artificial, com pagamento único e infraestrutura em nome da empresa contratante.",
          caminho: "/enterprise",
          tipo: "Implantação de departamentos com inteligência artificial",
        }),
      ],
    }),
  component: EnterprisePage,
});
