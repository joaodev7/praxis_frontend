import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { StructuredData } from './StructuredData';
import { getOrganizationSchema, getWebSiteSchema } from '../../seo/structured-data';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('praxis_token');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Global Schemas for Public Pages */}
      <StructuredData data={getOrganizationSchema()} id="schema-org" />
      <StructuredData data={getWebSiteSchema()} id="schema-website" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <img 
              src="/assets/Simbolo_PRAXIS_azul_em_movimento.webp" 
              alt="PRAXIS Logo" 
              className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
            />
            <div>
              <div className="flex items-center text-xl font-black tracking-wider leading-none">
                <span className="text-slate-900 dark:text-white">PRAX</span>
                <span className="text-blue-600 dark:text-blue-500">IS</span>
              </div>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mt-0.5">
                INTELIGÊNCIA EM <span className="text-blue-600 dark:text-blue-400">AÇÃO</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/software-para-nutricionistas/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Nutricionistas
            </Link>
            <Link to="/software-para-nutricionista-rt/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Nutricionista RT
            </Link>
            <Link to="/software-para-consultoria-de-alimentos/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Consultorias
            </Link>
            <Link to="/auditoria-de-seguranca-dos-alimentos/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Auditorias
            </Link>
            <Link to="/etiquetagem-de-alimentos/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Etiquetagem
            </Link>
            <Link to="/precos/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Planos
            </Link>
            <Link to="/blog/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-blue-600 dark:text-blue-400">
              Blog
            </Link>
          </nav>

          {/* Actions & Theme */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:white transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {token ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowRight className="w-4 h-4" />}
                className="hidden sm:inline-flex"
              >
                Acessar Painel
              </Button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition-colors"
                >
                  Entrar
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login?register=true')}
                >
                  Testar Grátis
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] px-4 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-3 font-medium text-slate-700 dark:text-slate-200">
              <Link to="/software-para-nutricionistas/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-blue-600">
                Software para Nutricionistas
              </Link>
              <Link to="/software-para-nutricionista-rt/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-blue-600">
                Nutricionista RT
              </Link>
              <Link to="/software-para-consultoria-de-alimentos/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-blue-600">
                Consultoria de Alimentos
              </Link>
              <Link to="/auditoria-de-seguranca-dos-alimentos/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-blue-600">
                Auditoria de Segurança dos Alimentos
              </Link>
              <Link to="/checklist-rdc-216/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-blue-600">
                Checklist RDC 216
              </Link>
              <Link to="/plano-de-acao-5w2h/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-blue-600">
                Plano de Ação 5W2H
              </Link>
              <Link to="/etiquetagem-de-alimentos/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-blue-600">
                Etiquetagem e Validade
              </Link>
              <Link to="/precos/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:text-blue-600">
                Planos & Preços
              </Link>
              <Link to="/blog/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 text-blue-600 font-bold">
                Blog Técnico
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700"
              >
                Já sou cliente / Entrar
              </Link>
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login?register=true');
                }}
              >
                Solicitar Acesso / Testar
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Standardized Public Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Col 1: Brand & Identity */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/Simbolo_PRAXIS_azul_em_movimento.webp" 
                  alt="PRAXIS Símbolo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-2xl font-black text-white tracking-wider">
                  PRAX<span className="text-blue-500">IS</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Software de gestão para nutricionistas responsáveis técnicos e consultorias de alimentos. Centralize clientes, unidades, visitas técnicas, auditorias, não conformidades, planos de ação e controle de validade.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Em total conformidade com a RDC 216/2004 e LGPD.</span>
              </div>
            </div>

            {/* Col 2: Soluções */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Soluções</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/software-para-nutricionistas/" className="hover:text-blue-400 transition-colors">Nutricionistas</Link></li>
                <li><Link to="/software-para-nutricionista-rt/" className="hover:text-blue-400 transition-colors">Nutricionista RT</Link></li>
                <li><Link to="/software-para-consultoria-de-alimentos/" className="hover:text-blue-400 transition-colors">Consultorias de Alimentos</Link></li>
                <li><Link to="/gestao-de-consultoria-de-alimentos/" className="hover:text-blue-400 transition-colors">Gestão Operacional</Link></li>
                <li><Link to="/auditoria-de-seguranca-dos-alimentos/" className="hover:text-blue-400 transition-colors">Auditorias em Campo</Link></li>
                <li><Link to="/checklist-rdc-216/" className="hover:text-blue-400 transition-colors">Checklist RDC 216</Link></li>
                <li><Link to="/plano-de-acao-5w2h/" className="hover:text-blue-400 transition-colors">Plano de Ação 5W2H</Link></li>
                <li><Link to="/etiquetagem-de-alimentos/" className="hover:text-blue-400 transition-colors">Etiquetagem & Validade</Link></li>
              </ul>
            </div>

            {/* Col 3: Conteúdo & Blog */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Blog & Recursos</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/blog/" className="hover:text-blue-400 transition-colors font-semibold text-slate-200">Todos os Artigos</Link></li>
                <li><Link to="/blog/rdc-216-guia-completo/" className="hover:text-blue-400 transition-colors">Guia RDC 216/2004</Link></li>
                <li><Link to="/blog/como-fazer-auditoria-em-servicos-de-alimentacao/" className="hover:text-blue-400 transition-colors">Como Fazer Auditorias</Link></li>
                <li><Link to="/blog/o-que-faz-nutricionista-responsavel-tecnico/" className="hover:text-blue-400 transition-colors">Rotina do Nutricionista RT</Link></li>
                <li><Link to="/blog/plano-de-acao-para-nao-conformidades/" className="hover:text-blue-400 transition-colors">5W2H na Alimentação</Link></li>
                <li><Link to="/blog/controle-de-validade-de-alimentos/" className="hover:text-blue-400 transition-colors">Controle de Validade</Link></li>
                <li><Link to="/blog/como-organizar-consultoria-de-alimentos/" className="hover:text-blue-400 transition-colors">Escalar Consultorias</Link></li>
              </ul>
            </div>

            {/* Col 4: Institucional & Legal */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Institucional</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/sobre/" className="hover:text-blue-400 transition-colors">Sobre o PRAXIS</Link></li>
                <li><Link to="/precos/" className="hover:text-blue-400 transition-colors">Planos & Preços</Link></li>
                <li><Link to="/contato/" className="hover:text-blue-400 transition-colors">Contato & Suporte</Link></li>
                <li><Link to="/seguranca/" className="hover:text-blue-400 transition-colors">Segurança & Confiabilidade</Link></li>
                <li><Link to="/privacidade/" className="hover:text-blue-400 transition-colors">Política de Privacidade</Link></li>
                <li><Link to="/termos/" className="hover:text-blue-400 transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} PRAXIS — Inteligência em Ação. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <Link to="/privacidade/" className="hover:text-slate-300">Privacidade</Link>
              <Link to="/termos/" className="hover:text-slate-300">Termos</Link>
              <Link to="/seguranca/" className="hover:text-slate-300">Segurança</Link>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-slate-300 flex items-center gap-1">
                <span>Sitemap</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
