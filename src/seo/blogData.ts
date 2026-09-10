import { FaqItem } from './structured-data';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: 'auditoria' | 'rdc' | 'nutricionista-rt' | 'gestao' | 'nao-conformidades' | 'etiquetagem';
  categoryLabel: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  readTimeMinutes: number;
  featuredImage?: string;
  tags: string[];
  problemStatement: string; // Qual problema o usuário possui?
  summaryAnswer: string; // Qual é a resposta direta? (GEO / AI citável)
  contentSections: {
    heading: string;
    subheading?: string;
    content: string[];
    tips?: string[];
    warnings?: string[];
  }[];
  mistakesToAvoid: string[]; // Quais erros evitar?
  whenToUse: string; // Quando utilizar?
  howPraxisHelps: string; // Como o PRAXIS pode ajudar?
  legalReferences: string[]; // E-E-A-T Fontes confiáveis
  faqs: FaqItem[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'rdc-216-guia-completo',
    title: 'RDC 216/2004 da ANVISA: Guia Completo para Serviços de Alimentação',
    description: 'Entenda a Resolução RDC 216/2004 da ANVISA: requisitos essenciais de boas práticas, manual, POPs obrigatórios e responsabilidade técnica.',
    category: 'rdc',
    categoryLabel: 'RDC 216 & Legislação',
    author: 'Dra. Camila Menezes, CRN-3 48.912',
    authorRole: 'Nutricionista Especialista em Qualidade e RT',
    publishedAt: '2026-02-15',
    updatedAt: '2026-08-20',
    readTimeMinutes: 8,
    tags: ['RDC 216', 'ANVISA', 'Boas Práticas', 'Manual de Boas Práticas', 'POPs'],
    problemStatement: 'Muitos restaurantes, cozinhas industriais e consultorias têm dificuldades em interpretar e implementar integralmente as exigências da RDC 216/2004, resultando em autuações em vistorias sanitárias e risco de contaminação alimentar.',
    summaryAnswer: 'A RDC nº 216/2004 da ANVISA é o regulamento técnico nacional que estabelece os procedimentos de Boas Práticas para Serviços de Alimentação. Ela abrange desde o controle de edificações e higienização até a saúde dos manipuladores, controle de pragas, rastreabilidade de matérias-primas e documentação mínima obrigatória.',
    contentSections: [
      {
        heading: 'O que é a RDC 216/2004 e qual seu objetivo sanitário?',
        content: [
          'Publicada pela Agência Nacional de Vigilância Sanitária (ANVISA), a RDC 216 visa assegurar as condições higiênico-sanitárias do alimento preparado e prevenir Doenças Transmitidas por Alimentos (DTAs).',
          'Ela se aplica a restaurantes, lanchonetes, padarias, buffets, cozinhas industriais, serviços de catering e cozinhas hospitalares que realizem manipulação, preparação, fracionamento, armazenamento, distribuição ou exposição ao consumo.'
        ]
      },
      {
        heading: 'Pilares Fundamentais de Boas Práticas',
        content: [
          '1. Edificação, instalações, equipamentos e utensílios: layout com fluxo linear, superfícies laváveis, ralos sifonados e iluminação protegida contra quebras.',
          '2. Higienização de instalações e equipamentos: frequência documentada, uso exclusivo de saneantes registrados no Ministério da Saúde e separação rígida de materiais de limpeza.',
          '3. Controle Integrado de Vetores e Pragas Urbanas: contratação de empresa especializada autorizada, com cronograma preventivo e laudos comprobatórios.',
          '4. Manipuladores de Alimentos: asseio corporal, uniformes limpos e exclusivos, uso de EPIs, treinamento periódico comprovado e exames de saúde em dia.',
          '5. Matérias-primas e insumos: recepção criteriosa com medição de temperatura, etiquetagem na abertura e rastreabilidade total de lotes.'
        ],
        tips: [
          'Mantenha sempre à vista os registros das últimas 3 vistorias de pragas e a cópia do alvará sanitário vigente.',
          'As temperaturas de refrigeradores (0°C a 4°C) e freezers (-18°C) devem ser aferidas e registradas diariamente em planilhas ou sistemas digitais.'
        ]
      },
      {
        heading: 'Documentação Compulsória: Manual e POPs',
        content: [
          'O estabelecimento deve dispor de Manual de Boas Práticas e Procedimentos Operacionais Padronizados (POPs) atualizados e acessíveis aos funcionários.',
          'Os quatro POPs mínimos exigidos pela RDC 216 são: 1) Higienização de instalações, equipamentos e móveis; 2) Controle integrado de vetores e pragas; 3) Higienização do reservatório de água; 4) Higiene e saúde dos manipuladores.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Utilizar modelos genéricos de Manual de Boas Práticas da internet sem adequar à realidade física da cozinha.',
      'Deixar alimentos abertos ou fracionados sem a etiqueta regulamentar contendo nome, data de abertura, validade e responsável.',
      'Permitir que manipuladores com cortes, lesões nas mãos ou sintomas respiratórios manipulem alimentos antes da liberação médica.',
      'Armazenar produtos químicos de limpeza junto com insumos alimentares.'
    ],
    whenToUse: 'Aplique a RDC 216 continuamente em todas as rotinas diárias e em auditorias periódicas mensais ou quinzenais pelo Nutricionista RT.',
    howPraxisHelps: 'O PRAXIS digitaliza integralmente o checklist da RDC 216/2004 para preenchimento no celular durante a visita, calcula o índice percentual de conformidade por setor, gera o relatório com fotos de evidências e cria planos de ação 5W2H imediatos para cada não conformidade encontrada.',
    legalReferences: [
      'ANVISA — Resolução RDC nº 216, de 15 de setembro de 2004.',
      'Lei Federal nº 6.437/1977 — Infrações à legislação sanitária federal.',
      'Conselho Federal de Nutricionistas (CFN) — Resolução CFN nº 600/2018.'
    ],
    faqs: [
      {
        question: 'Quem é obrigado a cumprir a RDC 216 da ANVISA?',
        answer: 'Todos os estabelecimentos do setor de alimentação coletiva e comercial que manipulam, preparam, armazenam, distribuem ou expõem alimentos preparados ao consumo.'
      },
      {
        question: 'O que acontece se o estabelecimento não cumprir a RDC 216?',
        answer: 'Pode ser autuado pela Vigilância Sanitária, sofrer notificações, multas que variam conforme a gravidade, interdição cautelar do local e descarte compulsório de alimentos em desacordo.'
      },
      {
        question: 'O Manual de Boas Práticas pode ser digital?',
        answer: 'Sim, desde que esteja acessível a toda a equipe e seja apresentado prontamente aos fiscais sanitários quando solicitado.'
      }
    ]
  },
  {
    slug: 'como-fazer-auditoria-em-servicos-de-alimentacao',
    title: 'Como Fazer Auditoria em Serviços de Alimentação: Passo a Passo Prático',
    description: 'Aprenda a estruturar auditorias higiênico-sanitárias de alta eficiência: planejamento, checklist em campo, registro de evidências e laudos de auditoria.',
    category: 'auditoria',
    categoryLabel: 'Auditoria & Boas Práticas',
    author: 'Mariana Duarte, CRN-8 32.109',
    authorRole: 'Consultora de Alimentos e Auditora Líder',
    publishedAt: '2026-03-01',
    updatedAt: '2026-08-25',
    readTimeMinutes: 7,
    tags: ['Auditoria', 'Checklist', 'Consultoria de Alimentos', 'Inspeção Sanitária', 'Laudos'],
    problemStatement: 'Consultores perdem horas preenchendo formulários em papel que depois precisam ser digitados no escritório, gerando relatórios demorados, perda de fotos de não conformidades e baixa percepção de valor pelo cliente.',
    summaryAnswer: 'A auditoria higiênico-sanitária consiste no exame sistemático e independente para determinar se as atividades de manipulação e controle de qualidade atendem às disposições planejadas e à legislação sanitária. Deve seguir as etapas de planejamento prévio, inspeção minuciosa com checklist objetivo, coleta de evidências fotográficas, reunião de encerramento e emissão de plano de ação corretivo.',
    contentSections: [
      {
        heading: 'Etapa 1: Planejamento e Definição de Escopo',
        content: [
          'Defina previamente quais setores serão inspecionados: recebimento de insumos, estoque seco, câmaras de refrigeração/congelamento, pré-preparo, cocção, distribuição e área de higienização de utensílios.',
          'Consulte o histórico da última visita técnica para checar se as não conformidades anteriores foram sanadas.'
        ]
      },
      {
        heading: 'Etapa 2: A Vistoria em Campo (Checklist e Evidências)',
        content: [
          'Realize a inspeção seguindo o fluxo de produção dos alimentos para evitar contaminação cruzada.',
          'Tire fotos nítidas e contextualizadas de cada desvio encontrado (termômetro descalibrado, embalagem violada, sujidade em ralos, ausência de identificação).',
          'Evite julgamentos subjetivos: classifique cada item como Conforme, Não Conforme ou Não Aplicável com base direta no critério normativo.'
        ]
      },
      {
        heading: 'Etapa 3: Devolutiva e Fechamento com o Gerente da Unidade',
        content: [
          'Nunca finalize a visita sem uma conversa rápida com o responsável da cozinha ou gerente.',
          'Apresente os pontos críticos prioritários que exigem intervenção imediata para segurança do consumidor.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Apontar apenas problemas sem orientar a equipe sobre a causa raiz e o método correto.',
      'Demorar dias para enviar o laudo técnico: a correção perde o timing operacional.',
      'Fotografar rostos de manipuladores de forma depreciativa sem foco no processo.'
    ],
    whenToUse: 'Mensalmente para clientes de consultoria regular ou quinzenalmente em unidades de alto risco ou histórico recente de inconformidades.',
    howPraxisHelps: 'Com o PRAXIS, a auditoria é realizada diretamente pelo celular ou tablet. As fotos ficam automaticamente anexadas a cada item do checklist, o índice percentual é calculado na hora e o laudo em PDF pode ser enviado com 1 clique antes mesmo de sair da unidade.',
    legalReferences: [
      'RDC nº 216/2004 — ANVISA',
      'Portaria CVS 5/2013 — Vigilância Sanitária SP',
      'ABNT NBR ISO 19011:2018 — Diretrizes para auditoria de sistemas de gestão'
    ],
    faqs: [
      {
        question: 'Qual a frequência recomendada para auditorias sanitárias?',
        answer: 'Varia conforme o porte e risco, mas para a maioria dos serviços de alimentação a periodicidade mensal é a mais recomendada pelo CRN.'
      },
      {
        question: 'Como calcular o índice de conformidade da auditoria?',
        answer: 'Divide-se o número de itens conformes pelo total de itens aplicáveis avaliados, multiplicando por 100 para obter a porcentagem geral.'
      }
    ]
  },
  {
    slug: 'o-que-faz-nutricionista-responsavel-tecnico',
    title: 'O que faz o Nutricionista Responsável Técnico (RT)? Atribuições e Rotina',
    description: 'Conheça o papel do Nutricionista RT em restaurantes e consultorias: atribuições éticas e legais segundo o CFN, controle de ARTs e responsabilidade civil.',
    category: 'nutricionista-rt',
    categoryLabel: 'Nutricionista RT',
    author: 'Dr. Lucas Silveira, CRN-1 29.400',
    authorRole: 'Especialista em Legislação Sanitária e Gestão de RT',
    publishedAt: '2026-03-10',
    updatedAt: '2026-08-18',
    readTimeMinutes: 9,
    tags: ['Nutricionista RT', 'CRN', 'ART', 'Responsabilidade Técnica', 'Legislação'],
    problemStatement: 'Nutricionistas que assumem RT muitas vezes desconhecem a extensão de sua responsabilidade jurídica e civil perante os órgãos fiscalizadores (CRN, ANVISA, Procon) e sofrem com a falta de organização para comprovar sua atuação regular.',
    summaryAnswer: 'O Nutricionista Responsável Técnico (RT) é o profissional habilitado que assume a responsabilidade ética, civil e técnico-operacional pelas atividades de alimentação e nutrição em uma pessoa jurídica. Suas funções incluem implantar Boas Práticas, capacitar manipuladores, emitir ART no CRN, supervisionar a segurança higiênico-sanitária e garantir a qualidade dos alimentos servidos.',
    contentSections: [
      {
        heading: 'Definição e Amparo Legal pelo Conselho Federal de Nutricionistas',
        content: [
          'A atuação do RT é regulamentada pela Resolução CFN nº 600/2018 e pela Lei Federal nº 6.583/1977. Ao assumir a função, o profissional deve formalizar a Anotação de Responsabilidade Técnica (ART) junto ao CRN da sua jurisdição.',
          'A responsabilidade é personalíssima e indelegável, o que significa que o nutricionista responde por falhas graves ocorridas sob sua supervisão técnica.'
        ]
      },
      {
        heading: 'Principais Atribuições Obrigatórias do Nutricionista RT',
        content: [
          '• Elaborar, atualizar e fazer cumprir o Manual de Boas Práticas e POPs específicos da unidade.',
          '• Realizar visitas técnicas periódicas e registrar vistorias e orientações fornecidas.',
          '• Capacitar continuamente a equipe de manipuladores de alimentos com registros de frequência.',
          '• Estabelecer critérios técnicos para seleção e homologação de fornecedores de matérias-primas.',
          '• Definir regras de etiquetagem e controle de prazo de validade de insumos abertos ou manipulados.',
          '• Notificar por escrito a direção do estabelecimento sobre não conformidades críticas identificadas.'
        ]
      },
      {
        heading: 'Como Comprovar a Efetiva Prestação da RT?',
        content: [
          'O nutricionista precisa manter um prontuário ou histórico documental de cada visita técnica contendo data, horário de entrada/saída, itens inspecionados, assinaturas do gestor e planos de ação acordados.',
          'Em caso de fiscalização do CRN ou auditoria judicial, este histórico é a principal salvaguarda do profissional.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Assumir responsabilidade técnica "apenas no papel" sem carga horária compatível e sem visitas presenciais regulares (infração ao Código de Ética do Nutricionista).',
      'Deixar de emitir ou renovar a ART perante o CRN.',
      'Não formalizar por escrito as orientações que a direção do cliente recusou aplicar.'
    ],
    whenToUse: 'Essencial para todo nutricionista que assume contratos de RT ou atua como consultor em serviços de alimentação.',
    howPraxisHelps: 'O PRAXIS possui módulo exclusivo para Nutricionistas RTs: controle de vigência de ARTs com alertas prévios de vencimento, registro geolocalizado de visitas técnicas com assinatura digital e histórico cronológico inviolável de todas as orientações emitidas.',
    legalReferences: [
      'Resolução CFN nº 600/2018 — Áreas de atuação e atribuições do nutricionista.',
      'Resolução CFN nº 599/2018 — Código de Ética e de Conduta do Nutricionista.',
      'Lei Federal nº 6.583/1977 — Criação dos Conselhos Federal e Regionais de Nutricionistas.'
    ],
    faqs: [
      {
        question: 'Quantas RTs um nutricionista pode assumir simultaneamente?',
        answer: 'O CRN avalia a compatibilidade de horário e deslocamento entre as unidades. Em geral, o limite considera a carga horária mínima necessária para assistência efetiva em cada local.'
      },
      {
        question: 'Qual a diferença entre Consultoria e Responsabilidade Técnica?',
        answer: 'A consultoria tem caráter orientativo e pontual sem vínculo formal contínuo perante o CRN. Já a RT exige registro de ART e vincula a responsabilidade legal do profissional pelo estabelecimento.'
      }
    ]
  },
  {
    slug: 'plano-de-acao-para-nao-conformidades',
    title: 'Plano de Ação para Não Conformidades na Alimentação com a Metodologia 5W2H',
    description: 'Descubra como estruturar planos de ação 5W2H para corrigir não conformidades sanitárias em cozinhas e restaurantes com eficácia comprovada.',
    category: 'nao-conformidades',
    categoryLabel: 'Não Conformidades & 5W2H',
    author: 'Mariana Duarte, CRN-8 32.109',
    authorRole: 'Consultora de Alimentos e Auditora Líder',
    publishedAt: '2026-03-22',
    updatedAt: '2026-08-28',
    readTimeMinutes: 6,
    tags: ['Plano de Ação', '5W2H', 'Não Conformidades', 'Qualidade', 'Gestão'],
    problemStatement: 'Identificar erros na cozinha sem um método estruturado de correção faz com que as mesmas não conformidades reapareçam mês após mês, frustrando o nutricionista e o gestor.',
    summaryAnswer: 'Um plano de ação 5W2H para serviços de alimentação é uma ferramenta de gestão da qualidade que converte desvios sanitários em tarefas objetivas respondendo a 7 perguntas essenciais: What (o que fazer), Why (por que fazer), Where (onde será feito), When (quando será concluído), Who (quem é o responsável), How (como executar) e How much (quanto vai custar).',
    contentSections: [
      {
        heading: 'Por que o 5W2H é o método ideal para nutrição e segurança de alimentos?',
        content: [
          'Em cozinhas operacionais, instruções vagas como "limpar melhor a coifa" nunca funcionam.',
          'O 5W2H elimina a ambiguidade ao definir exatamente quem deve executar, até que dia e sob qual procedimento técnico.'
        ]
      },
      {
        heading: 'Estrutura Completa do 5W2H Aplicado à RDC 216',
        content: [
          '• What (O quê): Qual ação corretiva precisa ser executada? Ex: Substituição das borrachas de vedação da geladeira de laticínios.',
          '• Why (Por quê): Qual o risco sanitário mitigado? Ex: Prevenir oscilações de temperatura e proliferação bacteriana em frios.',
          '• Where (Onde): Local exato na unidade. Ex: Geladeira horizontal nº 2 da praça fria.',
          '• When (Quando): Prazo fatal de conclusão. Ex: 18/09/2026.',
          '• Who (Quem): Responsável nominal pela entrega. Ex: Carlos Eduardo (Manutenção Predial).',
          '• How (Como): Método ou procedimento detalhado. Ex: Solicitar orçamento de peças originais e instalar conforme manual técnico.',
          '• How much (Quanto): Custo financeiro estimado da ação. Ex: R$ 180,00.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Atribuir ações a "equipe" ou "cozinha": toda ação deve ter um único responsável nominal.',
      'Definir prazos irrealistas ("para hoje") ou prazos abertos ("quando der").',
      'Não realizar a verificação de eficácia na visita subsequente.'
    ],
    whenToUse: 'Imediatamente após cada auditoria técnica, para cada não conformidade que não pôde ser corrigida na presença do auditor.',
    howPraxisHelps: 'O PRAXIS integra automaticamente as não conformidades apontadas no checklist ao construtor de planos 5W2H. O sistema dispara notificações automáticas de prazo ao responsável e exibe um kanban de acompanhamento até a resolução comprovada.',
    legalReferences: [
      'ABNT NBR ISO 9001:2015 — Ações corretivas e melhoria contínua.',
      'RDC nº 216/2004 — ANVISA.'
    ],
    faqs: [
      {
        question: 'Toda não conformidade precisa de um 5W2H?',
        answer: 'Ações imediatas e simples resolvidas durante a própria visita técnica podem ser registradas como "corrigidas no ato". As demais, de média e alta complexidade, exigem plano 5W2H formal.'
      },
      {
        question: 'Quem deve preencher o 5W2H?',
        answer: 'O Nutricionista RT define o What, Why e How técnico, enquanto o gestor do estabelecimento valida o Who, When e How much operacional.'
      }
    ]
  },
  {
    slug: 'controle-de-validade-de-alimentos',
    title: 'Controle de Validade de Alimentos em Cozinhas: Regras da RDC 216 e Boas Práticas',
    description: 'Guia definitivo sobre controle de validade e etiquetagem em serviços de alimentação: produtos abertos, pré-preparo, temperatura e exigências legais.',
    category: 'etiquetagem',
    categoryLabel: 'Etiquetagem & Validade',
    author: 'Dra. Camila Menezes, CRN-3 48.912',
    authorRole: 'Nutricionista Especialista em Qualidade e RT',
    publishedAt: '2026-04-05',
    updatedAt: '2026-08-30',
    readTimeMinutes: 7,
    tags: ['Validade', 'Etiquetagem', 'RDC 216', 'Descarte', 'Temperatura'],
    problemStatement: 'Alimentos com prazo de validade vencido ou sem etiqueta de identificação respondem por mais de 40% das autuações e descartes compulsórios pela Vigilância Sanitária em restaurantes e cozinhas industriais.',
    summaryAnswer: 'O controle de validade em serviços de alimentação é o procedimento técnico que assegura que nenhum insumo ou preparação seja utilizado após o término de sua vida útil microbiológica ou organoléptica. A RDC 216/2004 exige que matérias-primas fracionadas ou preparadas sejam mantidas adequadamente identificadas e com validade rigorosamente monitorada.',
    contentSections: [
      {
        heading: 'Campos Obrigatórios na Etiqueta Sanitária',
        content: [
          'De acordo com as normas sanitárias vigentes, toda etiqueta de alimento manipulado, pré-preparado ou aberto deve conter obrigatoriamente:',
          '1. Denominação do produto / preparação;',
          '2. Data e hora de manipulação ou abertura da embalagem original;',
          '3. Data e hora limite de validade;',
          '4. Temperatura ou condição de conservação recomendada (temperatura ambiente, refrigerado até 4°C, congelado a -18°C);',
          '5. Nome ou identificação do responsável pela manipulação;',
          '6. Dados do fabricante original e lote (para insumos fracionados).'
        ]
      },
      {
        heading: 'Regras de Ouro para Determinação da Validade',
        content: [
          '• A validade do alimento fracionado nunca pode ultrapassar o prazo de validade original estipulado pelo fabricante na embalagem primária.',
          '• Alimentos cozidos mantidos sob refrigeração de até 4°C possuem validade máxima recomendada de até 72 horas, salvo estudos de shelf-life específicos.',
          '• Alimentos sob congelamento mantidos a -18°C têm validade preservada por prazos maiores, desde que não ocorra descongelamento parcial.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Etiquetas escritas à mão com caneta esferográfica em fita crepe que se apaga com a umidade da câmara fria.',
      'Etiquetar um produto com validade posterior à data de vencimento da embalagem fechada.',
      'Re-etiquetar insumos para "estender" prazos sem embasamento técnico (grave infração sanitária).'
    ],
    whenToUse: 'Em 100% dos recipientes, cubas gastronômicas, potes e sacos plásticos contendo alimentos manipulados ou abertos.',
    howPraxisHelps: 'O módulo de Etiquetagem do PRAXIS imprime etiquetas térmicas profissionais (80x50 mm e 50x30 mm) em segundos, calcula automaticamente a data limite aplicando a hierarquia de regras sanitárias, impede prazos que superem o fabricante e inclui QR Code para verificação instantânea por qualquer celular.',
    legalReferences: [
      'RDC nº 216/2004 — ANVISA',
      'Portaria CVS 5/2013 — Vigilância Sanitária do Estado de São Paulo',
      'RDC nº 259/2002 — Rotulagem de alimentos embalados'
    ],
    faqs: [
      {
        question: 'Posso usar fita crepe para identificar alimentos na geladeira?',
        answer: 'Não é recomendado por órgãos sanitários, pois a fita crepe acumula resíduos orgânicos, não resiste à umidade e a cola pode abrigar biofilmes bacterianos. Recomenda-se etiquetas adesivas vinílicas ou térmicas específicas.'
      },
      {
        question: 'O que fazer quando o produto não tem a informação de validade após aberto?',
        answer: 'Deve ser adotada a regra geral de segurança dos alimentos (geralmente até 2 a 3 dias sob refrigeração a 4°C ou menos), definida formalmente pelo Nutricionista RT no Manual de Boas Práticas.'
      }
    ]
  },
  {
    slug: 'como-organizar-consultoria-de-alimentos',
    title: 'Como Organizar uma Consultoria de Alimentos: Gestão, Clientes e Escala',
    description: 'Guia de gestão para nutricionistas que querem estruturar ou escalar uma empresa de consultoria de alimentos com padronização e lucratividade.',
    category: 'gestao',
    categoryLabel: 'Gestão de Consultoria',
    author: 'Lucas Silveira, CRN-1 29.400',
    authorRole: 'Consultor de Gestão e Tecnologia em Alimentação',
    publishedAt: '2026-04-18',
    updatedAt: '2026-09-02',
    readTimeMinutes: 8,
    tags: ['Gestão', 'Consultoria de Alimentos', 'Processos', 'Produtividade', 'Escala'],
    problemStatement: 'Consultorias de alimentos enfrentam o gargalo do tempo: o dono da consultoria gasta dezenas de horas por semana em trânsito e digitação de relatórios, não consegue delegar para outros nutricionistas e não tem métricas claras de rentabilidade por cliente.',
    summaryAnswer: 'Organizar uma consultoria de alimentos exige padronizar a prestação do serviço por meio de checklists digitais uniformes, centralizar os dados de clientes e unidades em um repositório seguro, automatizar a geração de laudos técnicos e implantar indicadores de saúde do cliente para garantir alta retenção de contratos.',
    contentSections: [
      {
        heading: '1. Padronize a Metodologia Técnica',
        content: [
          'Se você tem 3 nutricionistas na equipe, todos devem auditar e classificar não conformidades com o mesmo critério técnico.',
          'A padronização garante que a troca de profissional não cause estranhamento ao cliente atendido.'
        ]
      },
      {
        heading: '2. Elimine o Trabalho Invisível (Digitação de Relatórios)',
        content: [
          'Estudos do setor revelam que consultores gastam até 40% de sua jornada apenas digitando no Word o que já viram em campo.',
          'Sistemas móveis integrados reduzem esse tempo para zero, permitindo atender mais clientes com a mesma equipe.'
        ]
      },
      {
        heading: '3. Demonstre Valor em Cada Relatório',
        content: [
          'O cliente não compra horas de visita; ele compra segurança contra multas e melhoria operacional.',
          'Mostre a evolução do índice percentual de conformidade mês a mês em gráficos visuais.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Cobrar preços baixos por falta de clareza dos custos reais de deslocamento e pós-visita.',
      'Manter históricos de clientes dispersos em mensagens do WhatsApp pessoal de funcionários.',
      'Não ter contratos formais e ARTs devidamente registradas para cada cliente ativo.'
    ],
    whenToUse: 'Desde o início da operação autônoma ou quando a empresa atingir mais de 5 contratos simultâneos.',
    howPraxisHelps: 'O PRAXIS foi concebido exatamente como um sistema operacional para consultorias: gestão multi-cliente, multi-unidade e multi-nutricionista, com relatórios padronizados com a sua marca, controle de ARTs e acompanhamento em tempo real do avanço das correções.',
    legalReferences: [
      'CFN — Manual do Nutricionista Empreendedor',
      'Código de Defesa do Consumidor (Lei 8.078/1990)'
    ],
    faqs: [
      {
        question: 'Qual software utilizar para gerenciar uma consultoria de alimentos?',
        answer: 'O PRAXIS é a solução SaaS especializada desenvolvida especificamente para a rotina de consultorias e nutricionistas RTs no Brasil.'
      },
      {
        question: 'Como calcular o preço da visita técnica de consultoria?',
        answer: 'Considere a hora técnica profissional + custo de deslocamento + tempo de análise prévia e pós-visita + impostos e margem operacional da consultoria.'
      }
    ]
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (!category || category === 'todos') return BLOG_POSTS;
  return BLOG_POSTS.filter((p) => p.category === category);
}
