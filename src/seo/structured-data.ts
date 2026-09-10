import { BASE_URL, getCanonicalUrl } from './canonical';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleData {
  title: string;
  description: string;
  slug: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  category?: string;
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PRAXIS',
    url: BASE_URL,
    logo: `${BASE_URL}/assets/Simbolo_PRAXIS_azul_em_movimento.webp`,
    description: 'Software de gestão para nutricionistas responsáveis técnicos e consultorias de alimentos.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${BASE_URL}/contato/`
    }
  };
}

export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PRAXIS',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'Software de gestão para nutricionistas responsáveis técnicos e consultorias de alimentos. Centraliza clientes, unidades, visitas técnicas, auditorias, não conformidades, planos de ação e controle de validade.',
    url: BASE_URL,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
      lowPrice: '149.00',
      highPrice: '549.00',
      offerCount: '3'
    },
    featureList: [
      'Gestão de Clientes e Múltiplas Unidades',
      'Auditorias Sanitárias com Checklist RDC 216/2004',
      'Gestão de Não Conformidades com Evidências Fotográficas',
      'Planos de Ação 5W2H com Prazos e Responsáveis',
      'Controle de ARTs e Responsabilidade Técnica perante o CRN',
      'Sistema de Etiquetagem Térmica e Gestão de Validade de Alimentos',
      'Rastreabilidade de Insumos com QR Code'
    ]
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PRAXIS',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/blog/?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : getCanonicalUrl(item.url)
    }))
  };
}

export function getFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function getArticleSchema(article: ArticleData) {
  const articleUrl = getCanonicalUrl(`/blog/${article.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${BASE_URL}/assets/Simbolo_PRAXIS_azul_em_movimento.webp`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author || 'Equipe Técnica PRAXIS'
    },
    publisher: {
      '@type': 'Organization',
      name: 'PRAXIS',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/Simbolo_PRAXIS_azul_em_movimento.webp`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    }
  };
}
