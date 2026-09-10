import { BASE_URL, getCanonicalUrl } from './canonical';

export interface PageSeoMeta {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  image?: string;
  h1: string;
  subheadline?: string;
  noindex?: boolean;
}

export const SEO_PAGES: Record<string, PageSeoMeta> = {
  home: {
    title: 'PRAXIS | Software para Nutricionistas e Consultorias de Alimentos',
    description: 'Gerencie clientes, unidades, auditorias, visitas técnicas, não conformidades e planos de ação em um só lugar. Software para nutricionistas e consultorias de alimentos.',
    canonicalPath: '/',
    keywords: [
      'software para nutricionista',
      'software consultoria de alimentos',
      'nutricionista responsavel tecnico',
      'sistema consultoria alimentos',
      'gestao de consultoria de alimentos',
      'auditoria de alimentos',
      'checklist rdc 216',
      'plano de acao 5w2h',
      'etiquetagem de alimentos'
    ],
    h1: 'Gestão completa para nutricionistas e consultorias de alimentos',
    subheadline: 'O PRAXIS centraliza clientes, unidades, visitas técnicas, auditorias, não conformidades, planos de ação e documentos em uma única plataforma.'
  },
  softwareNutricionistas: {
    title: 'Software para Nutricionistas | PRAXIS',
    description: 'Software de gestão operacional para nutricionistas que atuam com consultoria, responsabilidade técnica e auditorias higiênico-sanitárias.',
    canonicalPath: '/software-para-nutricionistas/',
    keywords: [
      'software para nutricionista',
      'sistema para nutricionista',
      'software gestao nutricionista',
      'sistema gestao nutricionista',
      'software para consultoria nutricional',
      'gestao de clientes nutricionista'
    ],
    h1: 'Software para Nutricionistas com Foco em Gestão e Operação',
    subheadline: 'Substitua planilhas avulsas e pastas desorganizadas por uma plataforma estruturada para gerenciar clientes, visitas, laudos e prazos.'
  },
  softwareRt: {
    title: 'Software para Nutricionista RT | Gestão de Consultoria e Auditorias',
    description: 'Sistema completo para nutricionistas Responsáveis Técnicos (RT). Acompanhe ARTs, vistorias em campo, conformidade sanitária e planos de correção.',
    canonicalPath: '/software-para-nutricionista-rt/',
    keywords: [
      'software nutricionista RT',
      'sistema nutricionista responsavel tecnico',
      'software responsavel tecnico',
      'gestao RT nutricionista',
      'sistema para RT'
    ],
    h1: 'Software Especializado para Nutricionista Responsável Técnico',
    subheadline: 'Segurança jurídica, padronização técnica e histórico completo para o profissional responsável pela garantia da qualidade alimentar.'
  },
  softwareConsultoria: {
    title: 'Software para Consultoria de Alimentos | PRAXIS',
    description: 'A plataforma definitiva para empresas de consultoria de alimentos. Múltiplos clientes, múltiplas unidades, equipe de nutricionistas e relatórios gerenciais.',
    canonicalPath: '/software-para-consultoria-de-alimentos/',
    keywords: [
      'software consultoria de alimentos',
      'sistema consultoria de alimentos',
      'gestao consultoria de alimentos',
      'software seguranca dos alimentos',
      'sistema seguranca alimentar'
    ],
    h1: 'Software para Consultoria de Alimentos e Gestão de Múltiplos Clientes',
    subheadline: 'Escale sua empresa de consultoria mantendo o padrão técnico em todas as unidades e clientes atendidos.'
  },
  gestaoConsultoria: {
    title: 'Gestão de Consultoria de Alimentos | Produtividade e Padronização',
    description: 'Descubra como organizar e profissionalizar a gestão da sua consultoria de alimentos: controle de equipe, produtividade em visitas e retenção de clientes.',
    canonicalPath: '/gestao-de-consultoria-de-alimentos/',
    keywords: [
      'gestao consultoria alimentos',
      'produtividade consultoria nutricional',
      'como gerenciar consultoria de alimentos',
      'indicadores consultoria alimentos'
    ],
    h1: 'Gestão Eficiente de Consultoria de Alimentos',
    subheadline: 'Padronize rotinas, centralize evidências e gere relatórios de alto valor percebido pelos seus clientes.'
  },
  auditoria: {
    title: 'Auditoria de Segurança dos Alimentos | PRAXIS',
    description: 'Realize auditorias sanitárias completas com apontamento imediato de não conformidades, registro fotográfico de evidências e geração de laudos técnicos.',
    canonicalPath: '/auditoria-de-seguranca-dos-alimentos/',
    keywords: [
      'auditoria seguranca alimentos',
      'auditoria sanitária',
      'sistema de auditoria de alimentos',
      'checklist de auditoria alimentar'
    ],
    h1: 'Auditoria de Segurança dos Alimentos em Campo',
    subheadline: 'Do checklist no celular ao relatório executivo em PDF em poucos minutos, com total embasamento técnico.'
  },
  checklistRdc216: {
    title: 'Checklist RDC 216 para Serviços de Alimentação | PRAXIS',
    description: 'Aplique o checklist da RDC ANVISA 216/2004 de forma ágil e digital. Edificação, manipuladores, higienização, controle de pragas e registros obrigatórios.',
    canonicalPath: '/checklist-rdc-216/',
    keywords: [
      'checklist rdc 216',
      'rdc 216 anvisa',
      'auditoria rdc 216',
      'boas praticas servicos de alimentacao'
    ],
    h1: 'Checklist RDC 216 para Serviços de Alimentação',
    subheadline: 'Estruture vistorias técnicas rigorosas e monitore a conformidade sanitária de restaurantes, cozinhas industriais e UANs.'
  },
  planoAcao5w2h: {
    title: 'Plano de Ação 5W2H para Não Conformidades | PRAXIS',
    description: 'Conecte cada não conformidade identificada na auditoria a um plano de ação 5W2H com responsável, prazo, método e acompanhamento de eficácia.',
    canonicalPath: '/plano-de-acao-5w2h/',
    keywords: [
      'plano de acao 5w2h',
      '5w2h seguranca dos alimentos',
      'resolucao de nao conformidades',
      'acao corretiva nutricao'
    ],
    h1: 'Plano de Ação 5W2H para Resolução de Não Conformidades',
    subheadline: 'Metodologia clara para transformar problemas apontados na auditoria em soluções práticas e comprovadas.'
  },
  etiquetagem: {
    title: 'Sistema de Etiquetagem e Controle de Validade de Alimentos | PRAXIS',
    description: 'Etiquetagem profissional de alimentos conforme a RDC 216/2004. Impressão térmica 80x50 e 50x30, cálculo de validade e verificação rápida por QR Code.',
    canonicalPath: '/etiquetagem-de-alimentos/',
    keywords: [
      'etiquetagem alimentos',
      'controle validade alimentos',
      'sistema etiqueta cozinha industrial',
      'etiqueta rdc 216',
      'etiquetagem data de abertura'
    ],
    h1: 'Sistema de Etiquetagem e Controle de Validade de Alimentos',
    subheadline: 'Elimine erros operacionais e multas da vigilância sanitária com etiquetas térmicas padronizadas e rastreabilidade por QR Code.'
  },
  precos: {
    title: 'Planos do PRAXIS | Investimento Transparente para sua Consultoria',
    description: 'Planos flexíveis para nutricionistas autônomos, RTs e consultorias em expansão. Sem taxa de adesão, sem surpresas e com garantia de satisfação.',
    canonicalPath: '/precos/',
    keywords: ['planos praxis', 'preco software nutricionista', 'software consultoria preco'],
    h1: 'Planos do PRAXIS',
    subheadline: 'Escolha a opção ideal para o momento da sua consultoria e comece a operar hoje mesmo.'
  },
  sobre: {
    title: 'Sobre o PRAXIS | Nossa Missão e Compromisso com a Segurança dos Alimentos',
    description: 'Conheça o PRAXIS: tecnologia desenvolvida especificamente para valorizar a atuação do nutricionista responsável técnico e potencializar consultorias.',
    canonicalPath: '/sobre/',
    h1: 'Inteligência em Ação na Segurança dos Alimentos',
    subheadline: 'Acreditamos que a tecnologia deve simplificar a complexidade regulatória e dar visibilidade ao trabalho do nutricionista.'
  },
  contato: {
    title: 'Contato e Demonstração | Fale com a Equipe PRAXIS',
    description: 'Entre em contato com nossa equipe para agendar uma demonstração guiada, tirar dúvidas comerciais ou solicitar suporte técnico especializado.',
    canonicalPath: '/contato/',
    h1: 'Fale Conosco',
    subheadline: 'Estamos prontos para entender os desafios da sua consultoria e mostrar como o PRAXIS resolve sua rotina.'
  },
  seguranca: {
    title: 'Segurança, Privacidade e LGPD | PRAXIS',
    description: 'Compromisso com a proteção de dados da sua consultoria e clientes. Isolamento multi-tenant, criptografia SSL/TLS e conformidade com a LGPD.',
    canonicalPath: '/seguranca/',
    h1: 'Segurança e Confiabilidade Empresarial',
    subheadline: 'A segurança dos seus laudos, evidências e dados de clientes tratada com os mais altos padrões da tecnologia em nuvem.'
  },
  privacidade: {
    title: 'Política de Privacidade | PRAXIS',
    description: 'Informações detalhadas sobre como coletamos, tratamos e protegemos os dados pessoais dos usuários da plataforma PRAXIS nos termos da LGPD.',
    canonicalPath: '/privacidade/',
    h1: 'Política de Privacidade',
    subheadline: 'Transparência no tratamento de dados conforme a Lei nº 13.709/2018 (LGPD).'
  },
  termos: {
    title: 'Termos de Uso | PRAXIS',
    description: 'Condições gerais de contratação e uso dos serviços e módulos da plataforma PRAXIS.',
    canonicalPath: '/termos/',
    h1: 'Termos de Uso do PRAXIS',
    subheadline: 'Direitos, deveres e parâmetros de utilização da plataforma SaaS.'
  },
  blog: {
    title: 'Blog PRAXIS | Gestão, RDC 216 e Segurança dos Alimentos',
    description: 'Conteúdo técnico de alto valor para nutricionistas RTs e consultores: guias da ANVISA, boas práticas, rotinas de auditoria e gestão empresarial.',
    canonicalPath: '/blog/',
    keywords: [
      'blog nutricao rt',
      'artigos rdc 216',
      'consultoria de alimentos dicas',
      'auditoria seguranca alimentar'
    ],
    h1: 'Conhecimento Técnico e Estratégico para Nutricionistas',
    subheadline: 'Artigos práticos fundamentados na legislação sanitária brasileira e na realidade de cozinhas e consultorias.'
  }
};
