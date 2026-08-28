import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Users, 
  FileSpreadsheet, 
  Clock, 
  EyeOff, 
  Layers, 
  Sparkles, 
  Sun, 
  Moon, 
  ListChecks, 
  Camera, 
  BarChart3, 
  SlidersHorizontal, 
  FileCheck2, 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  Target, 
  ChevronRight,
  Shield,
  PhoneCall,
  Mail,
  Compass
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
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/assets/Simbolo_PRAXIS_azul_em_movimento.png" 
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
            <a href="#problema" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">O Desafio</a>
            <a href="#solucao" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">A Solução</a>
            <a href="#funcionalidades" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Funcionalidades</a>
            <a href="#beneficios" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Benefícios</a>
            <a href="#como-funciona" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Como Funciona</a>
            <a href="#para-quem" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Para Quem É</a>
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
                  Solicitar Demonstração
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 1. HERO — A PRIMEIRA IMPRESSÃO */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Título Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-tight">
            Gestão inteligente para empresas de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">consultoria nutricional</span>.
          </h1>

          {/* Subtítulo */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Centralize clientes, equipes, avaliações e dados da sua operação em uma única plataforma. Tenha mais controle, padronize processos e transforme informações em decisões melhores.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(token ? '/dashboard' : '/login?register=true')}
              className="w-full sm:w-auto !py-4 !px-8 text-base shadow-xl shadow-blue-500/20 font-bold"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Solicitar uma demonstração
            </Button>
            <a
              href="#funcionalidades"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-md text-base font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700"
            >
              Conhecer a plataforma
            </a>
          </div>

          {/* Texto de Apoio */}
          <p className="mt-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Feito para empresas que gerenciam múltiplos clientes e precisam crescer sem aumentar a complexidade da operação.
          </p>
        </div>
      </section>

      {/* 2. SEÇÃO DE IDENTIFICAÇÃO — O PROBLEMA */}
      <section id="problema" className="py-20 bg-slate-50 dark:bg-[#0B1120] border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              A gestão da sua operação está preparada para crescer?
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Quanto maior a consultoria, mais difícil fica manter tudo sob controle.
            </h2>
            <div className="mt-6 space-y-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed text-left sm:text-center">
              <p>
                Planilhas, documentos, mensagens, fotos, relatórios e informações espalhadas fazem parte da rotina de muitas empresas de consultoria nutricional.
              </p>
              <p>
                No início, esses processos funcionam. Mas, conforme a operação cresce, acompanhar clientes, equipes e resultados se torna cada vez mais complexo.
              </p>
              <p className="font-semibold text-slate-800 dark:text-white pt-2">
                O problema não é a falta de dados. <span className="text-blue-600 dark:text-blue-400">É a dificuldade de transformar esses dados em uma visão clara da operação.</span>
              </p>
            </div>
          </div>

          {/* Cards de Dores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Informações descentralizadas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Dados importantes ficam espalhados entre planilhas, arquivos e diferentes ferramentas.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Processos difíceis de acompanhar</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sem uma visão centralizada, acompanhar o andamento das atividades e dos clientes exige mais esforço do que deveria.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Relatórios manuais e demorados</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Grande parte do tempo é consumida organizando informações antes de conseguir analisar os resultados.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Pouca visibilidade da operação</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tomar decisões se torna mais difícil quando as informações importantes não estão disponíveis no momento certo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRANSIÇÃO — APRESENTAÇÃO DA SOLUÇÃO */}
      <section id="solucao" className="py-20 bg-white dark:bg-[#020617]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Uma plataforma. Uma visão da sua operação.
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            O PRAXIS transforma a complexidade da operação em organização e clareza.
          </h2>
          <div className="mt-8 max-w-3xl mx-auto space-y-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              O PRAXIS foi criado para empresas de consultoria nutricional que precisam gerenciar múltiplos clientes e profissionais sem depender de processos descentralizados.
            </p>
            <p>
              Em uma única plataforma, sua empresa pode organizar informações, acompanhar atividades e ter uma visão mais clara do que acontece em toda a operação.
            </p>
            <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 pt-4">
              Menos tempo procurando informações. Mais tempo tomando decisões.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FUNCIONALIDADES — O QUE A PLATAFORMA ENTREGA */}
      <section id="funcionalidades" className="py-20 bg-slate-50 dark:bg-[#0F172A]/70 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Tudo conectado à sua operação
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              As informações certas, no lugar certo.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
              O PRAXIS conecta as principais áreas da sua operação para que clientes, profissionais e informações trabalhem juntos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gestão de Clientes */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-7 shadow-sm hover:shadow-md transition-all hover:border-blue-400/50">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Gestão de clientes</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Tenha uma visão completa dos seus clientes.</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Organize as empresas atendidas, acompanhe informações importantes e mantenha o histórico da operação acessível para sua equipe.
              </p>
            </div>

            {/* Gestão de Profissionais */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-7 shadow-sm hover:shadow-md transition-all hover:border-blue-400/50">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Gestão de profissionais</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Gerencie sua equipe com mais clareza.</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tenha uma visão centralizada dos profissionais que fazem parte da sua operação e facilite a organização das responsabilidades.
              </p>
            </div>

            {/* Avaliações e Registros */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-7 shadow-sm hover:shadow-md transition-all hover:border-blue-400/50">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-5">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Avaliações e registros</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Transforme atividades em dados estruturados.</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Registre informações importantes diretamente na plataforma e reduza a dependência de processos manuais e documentos dispersos.
              </p>
            </div>

            {/* Fotos e Evidências */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-7 shadow-sm hover:shadow-md transition-all hover:border-blue-400/50">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Fotos e evidências</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Organize evidências sem perder o contexto.</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Centralize registros e evidências vinculadas às atividades e aos clientes certos.
              </p>
            </div>

            {/* Relatórios e Indicadores */}
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-xl p-7 shadow-sm hover:shadow-md transition-all hover:border-blue-400/50 md:col-span-2 lg:col-span-2">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Relatórios e indicadores</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Veja além dos dados brutos.</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Transforme informações da operação em indicadores e relatórios que ajudam sua empresa a acompanhar resultados e identificar oportunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFÍCIOS — A TRANSFORMAÇÃO */}
      <section id="beneficios" className="py-20 bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Mais do que organização
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Uma operação melhor organizada gera decisões melhores.
            </h2>
            <div className="mt-4 space-y-2 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              <p>O PRAXIS não foi criado apenas para substituir planilhas.</p>
              <p>Ele foi pensado para ajudar empresas de consultoria nutricional a criar processos mais consistentes, ter mais visibilidade e acompanhar o crescimento da operação com segurança.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Mais controle</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Saiba o que está acontecendo em diferentes clientes e áreas da operação.</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Mais padronização</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Crie processos mais consistentes para que sua equipe trabalhe com as mesmas informações e referências.</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-1">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Mais visibilidade</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tenha uma visão mais clara dos dados e resultados que realmente importam.</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-1">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Menos trabalho manual</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Reduza o tempo gasto procurando, organizando e consolidando informações.</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4 md:col-span-2 lg:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 mt-1">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Decisões baseadas em dados</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tenha informações mais acessíveis para tomar decisões com mais segurança.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-slate-50 dark:bg-[#0B1120] border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Simples para a equipe. Poderoso para a gestão.
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Do registro à decisão, tudo em um só fluxo.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Passo 01 */}
            <div className="bg-white dark:bg-[#1E293B] p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-6 shadow-md shadow-blue-500/30">
                01
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Passo 01</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Organize sua operação</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cadastre clientes, organize profissionais e estruture as informações que fazem parte da rotina da sua empresa.
              </p>
            </div>

            {/* Passo 02 */}
            <div className="bg-white dark:bg-[#1E293B] p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-6 shadow-md shadow-blue-500/30">
                02
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Passo 02</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Registre o que acontece em campo</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Sua equipe registra avaliações, informações e evidências diretamente no fluxo de trabalho.
              </p>
            </div>

            {/* Passo 03 */}
            <div className="bg-white dark:bg-[#1E293B] p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-6 shadow-md shadow-blue-500/30">
                03
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Passo 03</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Acompanhe os resultados</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Tenha uma visão consolidada dos dados para acompanhar a operação e tomar decisões com mais clareza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PARA QUEM É O PRAXIS */}
      <section id="para-quem" className="py-20 bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Construído para operações que precisam de escala
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Feito para empresas que levam a gestão nutricional a sério.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
              O PRAXIS foi desenvolvido especialmente para organizações que precisam administrar uma operação nutricional com múltiplos clientes, profissionais e processos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Empresas de consultoria nutricional</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Que atendem diferentes empresas e precisam centralizar a gestão da operação.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-1">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Consultorias e assessorias em alimentação</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Que realizam acompanhamento técnico e precisam organizar dados, avaliações e evidências.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-1">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Equipes de nutricionistas</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Que precisam trabalhar com processos mais organizados e informações centralizadas.
                </p>
              </div>
            </div>

            <div className="p-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-1">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Operações em crescimento</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Que querem reduzir a dependência de processos manuais antes que a complexidade se torne um problema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. POSICIONAMENTO DA MARCA */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-blue-900/30 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Sua empresa entende de nutrição. O PRAXIS ajuda você a dominar a operação.
          </h2>
          <div className="mt-8 space-y-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            <p>
              A tecnologia deve facilitar o trabalho da sua equipe, não criar mais uma ferramenta para administrar.
            </p>
            <p>
              Por isso, o PRAXIS foi pensado para acompanhar a realidade das empresas de consultoria nutricional e transformar informações dispersas em uma operação mais organizada.
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-blue-400 pt-4 tracking-wide">
              Dados organizados. Processos mais claros. Decisões melhores.
            </p>
          </div>
        </div>
      </section>

      {/* 9. CTA FINAL */}
      <section className="py-20 bg-white dark:bg-[#020617]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-slate-900 rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">
              PRONTO PARA EVOLUIR SUA OPERAÇÃO?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight max-w-2xl mx-auto">
              Sua consultoria cresceu. Sua gestão também precisa acompanhar.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Descubra como o PRAXIS pode ajudar sua empresa a centralizar processos, acompanhar informações e ter mais controle sobre toda a operação.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(token ? '/dashboard' : '/login?register=true')}
                className="w-full sm:w-auto !bg-white !text-blue-600 hover:!bg-slate-100 font-extrabold !py-4 !px-8 text-base shadow-lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Solicitar uma demonstração
              </Button>
            </div>

            <p className="mt-6 text-xs text-blue-200">
              Conheça a plataforma e veja como ela pode se adaptar à realidade da sua empresa.
            </p>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-slate-100 dark:bg-[#080D1A] border-t border-slate-200 dark:border-slate-800 py-14 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            {/* Brand and Tagline */}
            <div className="flex items-center gap-3">
              <img 
                src="/assets/Simbolo_PRAXIS_azul_em_movimento.png" 
                alt="PRAXIS" 
                className="w-8 h-8 object-contain" 
              />
              <div>
                <div className="flex items-center text-lg font-black tracking-wider leading-none">
                  <span className="text-slate-900 dark:text-white">PRAX</span>
                  <span className="text-blue-600 dark:text-blue-500">IS</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                  Gestão inteligente para consultorias nutricionais.
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Plataforma</Link>
              <a href="#funcionalidades" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Funcionalidades</a>
              <a href="#solucao" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sobre o PRAXIS</a>
              <button onClick={() => setShowContactModal(true)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Contato</button>
              <button onClick={() => setShowPrivacyModal(true)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Política de Privacidade</button>
              <button onClick={() => setShowTermsModal(true)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Termos de Uso</button>
            </div>
          </div>

          <div className="pt-8 text-center text-xs text-slate-500 dark:text-slate-400">
            <p>© 2026 PRAXIS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal Contato / Demonstração */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Fale com a Equipe PRAXIS"
        subtitle="Agende uma demonstração personalizada da plataforma"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Nossa equipe de especialistas está pronta para apresentar como o PRAXIS pode estruturar a operação da sua consultoria nutricional.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>contato@praxisnutri.com.br</span>
            </div>
            <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>(11) 98765-4321</span>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setShowContactModal(false);
              navigate('/login?register=true');
            }}
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Cadastrar Minha Empresa Agora
          </Button>
        </div>
      </Modal>

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
            O PRAXIS é um software como serviço (SaaS) B2B destinado à gestão de consultorias nutricionais, acompanhamento de Boas Práticas e emissão de registros técnicos para empresas e profissionais de nutrição.
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">2. Responsabilidade Profissional</h4>
          <p>
            O preenchimento de checklists, anotações de ART e laudos técnicos é de inteira responsabilidade técnica do profissional nutricionista devidamente habilitado junto ao Conselho Regional de Nutricionistas (CRN).
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">3. Segurança e Acesso</h4>
          <p>
            O usuário é responsável pela guarda e sigilo de suas credenciais de acesso. O PRAXIS adota protocolos de criptografia e isolamento multi-tenant para proteção dos registros.
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
            Coletamos apenas dados cadastrais necessários à execução do serviço: Nome, E-mail corporativo, Telefone, registro no CRN e dados comerciais dos estabelecimentos atendidos. <strong>Não coletamos dados pessoais sensíveis de saúde individual.</strong>
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">2. Bases Legais e Finalidade</h4>
          <p>
            O tratamento é fundamentado na <strong>Execução de Contrato</strong> (Art. 7º, V) e no <strong>Cumprimento de Obrigação Legal e Regulatória</strong> (Art. 7º, II), conforme exigido pelas resoluções do CFN/CRN e normas da ANVISA para guarda de ARTs e relatórios de vistorias técnicas.
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">3. Direitos do Titular (Art. 18 da LGPD)</h4>
          <p>
            Você pode a qualquer momento visualizar, corrigir ou solicitar a exportação de seus dados (portabilidade) diretamente no painel do sistema.
          </p>
        </div>
      </Modal>

    </div>
  );
};
