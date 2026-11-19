import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal-page";
import { seo } from "@/lib/seo";
import { TERMOS } from "@/lib/legal";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => seo({ titulo: "Termos de Uso | Écsilab", descricao: "As regras para usar o site da Écsilab e as ferramentas gratuitas, como a autoavaliação de maturidade e a calculadora de CAC × LTV, e os limites de responsabilidade.", caminho: "/termos-de-uso", nome: "Termos de Uso" }),
  component: () => (
    <LegalPage doc={TERMOS} outro={{ to: "/politica-de-privacidade", rotulo: "Política de Privacidade" }} />
  ),
});
