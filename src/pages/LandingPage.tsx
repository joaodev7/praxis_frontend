import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck2, 
  CalendarDays, 
  Smartphone, 
  Building2, 
  FileText, 
  Sparkles, 
  Sun, 
  Moon, 
  ChevronRight, 
  AlertTriangle,
  Lock,
  Award,
  Users
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const LandingPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('praxis_token');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const features = [
    {
      icon: FileCheck2,
      title: 'Controle Total de ARTs',
      description: 'Acompanhe emissões, vigências e renovações de Anotações de Responsabilidade Técnica junto ao CRN sem risco de prazos expirados.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: CalendarDays,
      title: 'Checklists RDC 216 em Campo',
      description: 'Auditorias sanitárias estruturadas com registro fotográfico de evidências e plano de ação imediato para cada não conformidade.',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      icon: FileText,
      title: 'Laudos Técnicos em PDF',
      description: 'Geração automatizada de relatórios em formato executivo e regulatório prontos para entrega aos clientes e vigilâncias sanitárias.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Smartphone,
      title: 'Aplicativo Mobile Ágil',
      description: 'App dedicado para os nutricionistas em campo executarem visitas técnicas mesmo em cozinhas e áreas de manipulação com rapidez.',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      icon: Building2,
      title: 'Multi-unidade & Multi-cliente',
      description: 'Centralize a gestão de dezenas de restaurantes, buffets, hospitais e UANs em um painel unificado com indicadores em tempo real.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      icon: ShieldCheck,
      title: 'Segurança & LGPD Nativa',
      description: 'Isolamento estrito de dados por empresa (multi-tenant), criptografia de ponta a ponta e total conformidade com a Lei nº 13.709/2018.',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src={isDark ? "/assets/Simbolo_PRAXIS_azul_em_movimento.png" : "/assets/Simbolo_PRAXIS_azul_em_movimento.png"} 
              alt="PRAXIS Logo" 
              className="h-9 w-9 object-contain"
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
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Funcionalidades</a>
            <a href="#compliance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Regulatório & LGPD</a>
            <a href="#audience" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Para quem é</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {token ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Ir para o Painel
              </Button>
            ) : (
              <>
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
                  Cadastrar Empresa
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Software SaaS B2B para Consultorias de Nutrição
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Gestão Inteligente de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Responsabilidade Técnica</span> & Segurança Alimentar
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Automatize o acompanhamento de ARTs no CRN, execute vistorias técnicas com checklists RDC 216 em campo e emita laudos periciais profissionais instantâneos.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(token ? '/dashboard' : '/login?register=true')}
              className="w-full sm:w-auto !py-3.5 !px-8 text-base shadow-lg shadow-blue-500/20"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {token ? 'Acessar Meu Painel' : 'Criar Conta da Consultoria'}
            </Button>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-md text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700"
            >
              Acesso Demo Inicial
            </Link>
          </div>

          {/* Quick trust badges */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Adequado à LGPD</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-blue-500" /> Padrão ANVISA RDC 216</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-purple-500" /> Multi-tenant Isolado</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-amber-500" /> App Mobile em Campo</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-[#0F172A]/50 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Funcionalidades Integradas</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Tudo que uma Responsável Técnica precisa em um só lugar</p>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">Elimine papéis, planilhas manuais e o risco de autuações por falta de registro comprobatório.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, index) => {
              const Icon = f.icon;
              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-[#1E293B]/70 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-400/50"
                >
                  <div className={`w-12 h-12 rounded-lg ${f.bgColor} ${f.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section id="audience" className="py-20 bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Público-Alvo</h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Projetado sob medida para o setor de alimentação</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Empresas de Consultoria</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Gerencie sua equipe de nutricionistas, distribua unidades e monitore métricas de conformidade dos clientes.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Nutricionistas RT Autônomos</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Padronize seus laudos, organize seu portfólio de ARTs e entregue relatórios com visual de alto nível técnico.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A]">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Redes & Cozinhas Industriais</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Controle rigoroso de segurança de alimentos em todas as suas filiais com rastreabilidade completa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Regulatory Banner */}
      <section id="compliance" className="py-16 bg-blue-600 dark:bg-blue-900/40 text-white border-y border-blue-700 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-white/10 rounded-md text-xs font-bold uppercase tracking-wider mb-4">
                Rigigora Legal & Segurança
              </span>
              <h2 className="text-3xl font-extrabold leading-tight">Total Conformidade com ANVISA, CFN/CRN e LGPD</h2>
              <p className="mt-4 text-blue-100 text-sm leading-relaxed">
                Nossa arquitetura técnica segue os parâmetros de governança sanitária da Resolução CFN nº 600/2018 e RDC ANVISA 216/2004, além de aplicar blindagem de privacidade de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-blue-200">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-white" /> Trilha de Auditoria (AuditLogs)</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-white" /> Portabilidade de Dados</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-white" /> Criptografia de Dados</span>
              </div>
            </div>

            <div className="bg-white/10 dark:bg-slate-950/60 p-8 rounded-2xl border border-white/20 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Comece a usar o PRAXIS hoje</h3>
              <p className="text-xs text-blue-100 mb-6">Cadastre sua empresa de nutrição e tenha acesso instantâneo ao painel operacional e ao modelo pré-configurado da Dra. Jamily Pinto.</p>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/login?register=true')}
                className="w-full !bg-white !text-blue-600 hover:!bg-slate-100 font-bold"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Cadastrar Minha Empresa
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/Simbolo_PRAXIS_azul_em_movimento.png" 
              alt="PRAXIS" 
              className="w-6 h-6 object-contain" 
            />
            <span>© 2026 PRAXIS — Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button 
              onClick={() => setShowTermsModal(true)} 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Termos de Uso
            </button>
            <button 
              onClick={() => setShowPrivacyModal(true)} 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Política de Privacidade (LGPD)
            </button>
            <Link 
              to="/login" 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Acesso ao Sistema
            </Link>
          </div>
        </div>
      </footer>

      {/* Modal Termos de Uso */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Termos de Uso — PRAXIS"
        subtitle="Condições gerais de prestação de serviços e utilização da plataforma"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">1. Objeto do Serviço</h4>
          <p>
            O PRAXIS é um software como serviço (SaaS) B2B destinado à gestão de Responsabilidade Técnica (RT),
            acompanhamento de Boas Práticas (RDC ANVISA 216/2004) e emissão de laudos para empresas e profissionais de nutrição.
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">2. Responsabilidade Profissional</h4>
          <p>
            O preenchimento de checklists, anotações de ART e laudos técnicos é de inteira responsabilidade técnica do
            profissional nutricionista devidamente habilitado junto ao Conselho Regional de Nutricionistas (CRN).
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">3. Segurança e Acesso</h4>
          <p>
            O usuário é responsável pela guarda e sigilo de suas credenciais de acesso. O PRAXIS adota protocolos de
            criptografia e isolamento multi-tenant para proteção dos registros.
          </p>
        </div>
      </Modal>

      {/* Modal Política de Privacidade e LGPD */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Política de Privacidade & LGPD"
        subtitle="Conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center gap-3 text-blue-400">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Seus dados são tratados em conformidade estrita com os Artigos 6º, 7º e 18 da LGPD.</span>
          </div>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">1. Dados Pessoais Coletados</h4>
          <p>
            Coletamos apenas dados cadastrais necessários à execução do serviço: Nome, E-mail corporativo, Telefone,
            registro no CRN e dados comerciais dos estabelecimentos atendidos. <strong>Não coletamos dados pessoais sensíveis de saúde individual.</strong>
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">2. Bases Legais e Finalidade</h4>
          <p>
            O tratamento é fundamentado na <strong>Execução de Contrato</strong> (Art. 7º, V) e no <strong>Cumprimento de Obrigação Legal e Regulatória</strong> (Art. 7º, II),
            conforme exigido pelas resoluções do CFN/CRN e normas da ANVISA para guarda de ARTs e relatórios de vistorias técnicas.
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">3. Direitos do Titular (Art. 18 da LGPD)</h4>
          <p>
            Você pode a qualquer momento visualizar, corrigir ou solicitar a exportação de seus dados (portabilidade) diretamente
            no painel do sistema ou contatando o encarregado de dados (DPO) através dos canais de suporte.
          </p>
        </div>
      </Modal>

    </div>
  );
};
