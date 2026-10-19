// Conteúdo aprovado da página do X-Club (porta de entrada da Écsilab: pacote de marketing local).
// Fonte: protótipo "xclub_v2_prototipo", com o nome X-Lab trocado por Écsilab.

export type Segmento = "servicos" | "food";

export type EtapaJornada = { label: string; kicker: string; phone: string; cta: string; note: string; desc: string };

export type DadosSegmento = {
  rotulo: string;
  jornadaTitulo: string;
  jornadaDesc: string;
  etapas: EtapaJornada[];
  browserTitulo: string;
  browserDesc: string;
  browserBtn: string;
  conversaoTitulo: string;
  conversaoTexto: string;
};

export const SEGMENTOS: Record<Segmento, DadosSegmento> = {
  servicos: {
    rotulo: "Serviços",
    jornadaTitulo: "Da pesquisa à solicitação de orçamento.",
    jornadaDesc:
      "Seu cliente tem um problema. Ele precisa encontrar uma empresa, confiar nas informações e saber como solicitar ajuda.",
    etapas: [
      { label: "Procura uma solução", kicker: "Pesquisa local", phone: "Encontre uma solução perto de você.", cta: "Pesquisar serviços →", note: "Tudo começa com a necessidade.", desc: "A pessoa busca alternativas para resolver um problema." },
      { label: "Encontra sua empresa", kicker: "Resultado no Google", phone: "Uma empresa com informações claras.", cta: "Conhecer a empresa →", note: "Estar presente de forma organizada.", desc: "Localização, serviços e contatos ajudam o cliente a entender a oferta." },
      { label: "Avalia e escolhe", kicker: "Site de serviços", phone: "Serviços, diferenciais e confiança.", cta: "Ver serviços →", note: "Informação reduz dúvidas.", desc: "Uma apresentação clara ajuda o visitante a considerar o próximo passo." },
      { label: "Solicita atendimento", kicker: "Ponto de contato", phone: "Pronto para conversar?", cta: "Solicitar orçamento ↗", note: "O interesse encontra um caminho.", desc: "WhatsApp ou formulário facilita a solicitação e o registro do contato." },
    ],
    browserTitulo: "Seu serviço merece ser encontrado.",
    browserDesc: "Informações claras, confiança e atendimento sem complicação.",
    browserBtn: "Solicitar orçamento ↗",
    conversaoTitulo: "WhatsApp + formulário",
    conversaoTexto: "Caminhos mais simples para começar uma conversa e registrar solicitações de atendimento.",
  },
  food: {
    rotulo: "Food",
    jornadaTitulo: "Do desejo à escolha do pedido.",
    jornadaDesc:
      "O cliente vê uma comida que desperta vontade. Ele precisa encontrar o cardápio, decidir e escolher um canal de pedido ou visita.",
    etapas: [
      { label: "Descobre seu prato", kicker: "Descoberta local", phone: "Bateu a fome? Veja essa opção.", cta: "Conhecer o restaurante →", note: "A vontade pode começar em uma imagem.", desc: "Um prato, uma indicação ou uma campanha desperta interesse." },
      { label: "Encontra o cardápio", kicker: "Cardápio digital", phone: "Escolher ficou mais fácil.", cta: "Ver cardápio →", note: "O cardápio precisa estar à mão.", desc: "Produtos, preços e informações ajudam na escolha." },
      { label: "Escolhe o canal", kicker: "Canais disponíveis", phone: "Como prefere pedir?", cta: "WhatsApp · iFood · rota", note: "Menos dúvida no caminho.", desc: "O visitante encontra o canal de pedido, retirada ou visita adequado." },
      { label: "Inicia o pedido", kicker: "Próximo passo", phone: "Tudo pronto para pedir.", cta: "Iniciar pedido ↗", note: "O desejo ganha um destino.", desc: "O X-Club reduz obstáculos digitais. A compra e o atendimento dependem do estabelecimento." },
    ],
    browserTitulo: "Seu cardápio abre o apetite.",
    browserDesc: "Produtos, preços e canais de pedido em um só caminho.",
    browserBtn: "Ver cardápio ↗",
    conversaoTitulo: "Cardápio + canais de pedido",
    conversaoTexto: "Links claros para WhatsApp, iFood, localização, retirada ou reserva, conforme os canais disponíveis.",
  },
};

export const DORES = [
  { n: "01 / DESCOBERTA", t: "Você não aparece como deveria.", d: "Informações dispersas ou incompletas dificultam que novas pessoas descubram seu negócio." },
  { n: "02 / CONFIANÇA", t: "O cliente encontra dúvidas.", d: "Faltam serviços claros, fotos, cardápio, horários ou sinais de confiança." },
  { n: "03 / AÇÃO", t: "Não está claro como comprar.", d: "Um link escondido, formulário confuso ou canal desatualizado aumenta o esforço do cliente." },
  { n: "04 / LEITURA", t: "Você não sabe onde perdeu.", d: "Sem acompanhar sinais dos canais, fica mais difícil decidir o que melhorar." },
];

export const ENTREGAS_PEQUENAS = [
  { n: "05 / X CONTENT", t: "Conteúdo que ajuda a decidir.", d: "Rotina editorial definida por segmento, conforme as entregas e limites do plano contratado." },
  { n: "06 / X INTELLIGENCE", t: "Leitura para melhorar.", d: "Acompanhamento mensal de sinais de busca, cliques, campanhas e contatos, conforme disponibilidade dos dados." },
];

export const RESULTADOS = [
  { i: "⌕", t: "Ser encontrado" },
  { i: "◈", t: "Gerar confiança" },
  { i: "↗", t: "Facilitar a ação" },
  { i: "▤", t: "Aprender com dados" },
];

export const ROADMAP = [
  { dias: "DIAS 01—30", t: "Fundação.", d: "Informações, acessos, site, Google e estrutura dos canais de contato ou pedido." },
  { dias: "DIAS 31—60", t: "Ativação.", d: "Campanhas, conteúdo e rotina de acompanhamento previstos no plano." },
  { dias: "DIAS 61—90", t: "Aprendizado.", d: "Leitura dos sinais iniciais e identificação dos próximos ajustes prioritários." },
  { dias: "90 DIAS +", t: "Evolução.", d: "Otimizações, melhoria contínua e eventual expansão do escopo." },
];

export const EXTENSOES = [
  { t: "X Ads Pro", d: "Campanhas avançadas, novas segmentações e testes adicionais." },
  { t: "X Search", d: "Google Ads para ampliar as estratégias de aquisição paga." },
  { t: "X CRM", d: "Estrutura comercial para acompanhar oportunidades." },
  { t: "X Lead Agent", d: "Automação e IA para atendimento ou qualificação, mediante projeto." },
];

export const FAQ = [
  { p: "O X-Club é uma agência de marketing?", r: "O X-Club é uma solução padronizada da Écsilab. Em vez de contratar site, presença local e campanhas isoladamente, sua empresa passa a ter uma operação coordenada, dentro do escopo definido no plano." },
  { p: "A mensalidade inclui o investimento em anúncios?", r: "Não. A mensalidade de R$ 399 refere-se à operação recorrente. O dinheiro investido nas plataformas de publicidade é separado e pago conforme o orçamento aprovado pelo cliente." },
  { p: "Preciso ter um site antes de começar?", r: "Não. O projeto de site pode fazer parte da contratação com valor próprio. Se você já possui um, avaliamos a possibilidade de utilizar ou adequar a estrutura existente, mediante definição de escopo." },
  { p: "Google Ads está incluído?", r: "O plano-base contempla organização da presença local no Google e campanhas Meta Ads dentro do escopo. Google Ads é uma contratação complementar." },
  { p: "O X-Club garante mais clientes ou pedidos?", r: "Não. Nossa entrega é estruturar e operar os canais previstos no plano para facilitar descoberta, confiança e contato. Vendas dependem também da oferta, preço, atendimento, concorrência e capacidade da empresa." },
  { p: "O que acontece depois dos 12 meses?", r: "O parcelamento do desenvolvimento do site se encerra conforme o contrato. A operação X-Club poderá continuar pelo valor recorrente estipulado. Hospedagem, manutenção e outras condições técnicas são tratadas separadamente na proposta." },
  { p: "Qual a diferença entre Serviços e Food?", r: "Serviços prioriza descoberta, credibilidade e solicitação de orçamento. Food prioriza desejo, cardápio e acesso aos canais de pedido, retirada, reserva ou visita, conforme o negócio." },
  { p: "Existe fidelidade mínima ou multa de cancelamento?", r: "As regras de permanência e cancelamento precisam constar expressamente na contratação. O projeto de site possui obrigações próprias, distintas da operação mensal." },
];

export const DESAFIOS = [
  "Ser encontrado por novos clientes",
  "Receber mais contatos ou pedidos",
  "Organizar meu marketing atual",
  "Entender por onde começar",
];
