import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  Users, 
  Layers, 
  FileSpreadsheet, 
  BarChart3, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const SoftwareConsultoriaPage: React.FC = () => {
  const meta = SEO_PAGES.softwareConsultoria;

  const faqs = [
    {
      question: 'O PRAXIS permite gerenciar múltiplos clientes e várias unidades simultaneamente?',
      answer: 'Sim. A arquitetura do PRAXIS foi construída exatamente para consultorias de alimentos. Você cadastra cada cliente corporativo e vincula quantas filiais ou unidades de alimentação ele possuir, mantendo o histórico de auditorias e visitas separado ou consolidado.'
    },
    {
      question: 'Posso cadastrar outros nutricionistas da minha equipe no sistema?',
      answer: 'Sim. Você pode convidar e gerenciar nutricionistas consultores, atribuir clientes específicos a cada profissional e acompanhar a produtividade e os relatórios emitidos por toda a equipe.'
    },
    {
      question: 'Os relatórios saem com a logomarca da minha consultoria?',
      answer: 'Sim. Os laudos técnicos e relatórios de auditoria em PDF são totalmente personalizados com o logotipo, cores e dados cadastrais da sua empresa de consultoria.'
    },
    {
      question: 'Como funciona a transição de planilhas de Excel para o PRAXIS?',
      answer: 'A implantação é simples e imediata. A equipe de suporte do PRAXIS auxilia na importação da sua base atual de clientes e unidades para que seus consultores possam ir a campo já no primeiro dia.'
    }
  ];

  return (
    <PublicLayout>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonicalPath}
        keywords={meta.keywords}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ name: 'Software para Consultoria de Alimentos', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 lg:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Workflow className="w-3.5 h-3.5" />
            <span>Escala & Gestão de Consultorias</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            {meta.h1}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-3xl mx-auto">
            {meta.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login?register=true">
              <Button size="lg" variant="primary" className="w-full sm:w-auto font-bold px-8 shadow-lg shadow-blue-500/20">
                Agendar Demonstração ou Testar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/precos/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Conhecer Planos Empresariais
              </Button>
            </Link>
          </div>
        </section>

        {/* GEO Quote Block (Section 19) */}
        <section className="my-10 p-6 sm:p-8 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">
            Visão Geral da Solução para Consultorias
          </h2>
          <blockquote className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 my-2">
            "O PRAXIS é um sistema de gestão para consultorias de alimentos que permite controlar múltiplos clientes, redes com dezenas de unidades e equipes de nutricionistas. Ele padroniza as auditorias higiênico-sanitárias, automatiza a geração de laudos em PDF e gerencia não conformidades através de planos 5W2H rastreáveis."
          </blockquote>
        </section>

        {/* O Fluxo Operacional da Consultoria no PRAXIS (Section 11) */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Da Consultoria ao Relatório Final: Fluxo 100% Integrado
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Veja como o PRAXIS conecta cada ponta da sua operação de consultoria nutricional e sanitária:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            {[
              { label: 'Consultoria', desc: 'Central' },
              { label: 'Clientes', desc: 'Contratos' },
              { label: 'Unidades', desc: 'Filiais/UANs' },
              { label: 'Nutricionistas', desc: 'Equipe RT' },
              { label: 'Visitas', desc: 'Roteiros' },
              { label: 'Auditorias', desc: 'RDC 216' },
              { label: 'Não Conf.', desc: 'Evidências' },
              { label: 'Laudo PDF', desc: 'Executivo' }
            ].map((step, idx) => (
              <div key={step.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col items-center justify-center relative">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 mb-1">0{idx + 1}</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{step.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{step.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Benefícios Empresariais */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Por que grandes consultorias de alimentos escolhem o PRAXIS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Padronização da Equipe</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Garante que todos os nutricionistas da consultoria avaliem cozinhas com os mesmos critérios técnicos e rigor normativo, sem variações individuais.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <BarChart3 className="w-8 h-8 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Retenção de Contratos</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Apresente relatórios com gráficos executivos de evolução sanitária nas reuniões com os proprietários dos estabelecimentos atendidos.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <Layers className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ganho de Escala</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ao eliminar o retrabalho manual de digitação de laudos, cada consultor consegue atender até 40% mais unidades com o mesmo padrão de qualidade.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqs} />

        {/* Final CTA */}
        <section className="my-16 py-12 px-6 sm:px-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            Escale sua empresa de consultoria de alimentos com o PRAXIS
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            Tenha total visibilidade das vistorias, da equipe e da satisfação dos seus clientes em um único painel inteligente.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login?register=true">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-bold px-8">
                Criar Conta de Consultoria
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contato/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Falar com Nossos Especialistas
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};
