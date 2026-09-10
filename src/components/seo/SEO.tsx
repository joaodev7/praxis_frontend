import React, { useEffect } from 'react';
import { BASE_URL, getCanonicalUrl } from '../../seo/canonical';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  image?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
}

function updateMetaTag(nameOrProperty: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${nameOrProperty}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(nameOrProperty, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonicalLink(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  keywords,
  image = `${BASE_URL}/assets/Logo_PRAXIS_com_fluxo_azul.webp`,
  ogType = 'website',
  noindex = false
}) => {
  const canonicalUrl = canonical ? (canonical.startsWith('http') ? canonical : getCanonicalUrl(canonical)) : getCanonicalUrl(window.location.pathname);

  useEffect(() => {
    // 1. Page Title
    document.title = title;

    // 2. Canonical
    updateCanonicalLink(canonicalUrl);

    // 3. Primary Meta Tags
    updateMetaTag('name', 'description', description);
    if (keywords && keywords.length > 0) {
      updateMetaTag('name', 'keywords', keywords.join(', '));
    }

    // 4. Robots
    const robotsContent = noindex 
      ? 'noindex, nofollow' 
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    updateMetaTag('name', 'robots', robotsContent);

    // 5. Open Graph
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:site_name', 'PRAXIS');
    updateMetaTag('property', 'og:locale', 'pt_BR');

    // 6. Twitter / X Card
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

  }, [title, description, canonicalUrl, keywords, image, ogType, noindex]);

  return null;
};
