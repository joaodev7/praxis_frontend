/**
 * PRAXIS — SEO Canonical URL Manager
 * Garante que todas as URLs canônicas sejam normalizadas para https://praxisnutri.com.br
 * sem www, sem http inseguro, sem barras duplicadas e sem parâmetros de rastreamento.
 */

export const BASE_URL = 'https://praxisnutri.com.br';

export function getCanonicalUrl(path: string = '/'): string {
  // Remove query params e hashes
  const cleanPath = path.split('?')[0].split('#')[0];
  
  // Normaliza barras
  const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  if (normalized === '/' || normalized === '') {
    return `${BASE_URL}/`;
  }

  // Mantém padrão canônico com barra final para URLs de landing page
  const trimmed = normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  return `${BASE_URL}${trimmed}/`;
}
