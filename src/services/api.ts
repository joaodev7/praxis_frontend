import axios from 'axios';

/**
 * Resolve a URL base da API garantindo que o frontend utilize sempre o subdomínio api.*
 * e nunca chame a si próprio (sandbox.praxisnutri.com.br/api).
 */
function resolveApiBaseUrl(): string {
  let envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Se a variável foi erroneamente configurada com a URL do frontend sem o prefixo 'api.'
    if (envUrl && envUrl.includes('//sandbox.praxisnutri.com.br') && !envUrl.includes('api.sandbox')) {
      envUrl = envUrl.replace('//sandbox.praxisnutri.com.br', '//api.sandbox.praxisnutri.com.br');
    }

    // Fallback inteligente para ambiente Cloudflare Pages Sandbox
    if (!envUrl) {
      if (hostname === 'sandbox.praxisnutri.com.br' || hostname.endsWith('.sandbox.praxisnutri.com.br')) {
        envUrl = 'https://api.sandbox.praxisnutri.com.br';
      } else if (hostname === 'praxisnutri.com.br' || hostname === 'www.praxisnutri.com.br') {
        envUrl = 'https://api.praxisnutri.com.br';
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        envUrl = 'http://localhost:5000';
      }
    }
  }

  const rawUrl = envUrl || 'https://api.sandbox.praxisnutri.com.br';
  const cleanUrl = rawUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
}

const baseURL = resolveApiBaseUrl();

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('praxis_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('praxis_token');
      localStorage.removeItem('praxis_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
