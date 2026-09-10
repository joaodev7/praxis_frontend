import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  ArrowRight, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  FileText, 
  Briefcase,
  Target
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const GestaoConsultoriaPage: React.FC = () => {
  const meta = SEO_PAGES.gestaoConsultoria;

  const faqs = [
    {
      question: 'Como o PRAXIS aumenta a produtividade da gestão de consultoria?',
      answer: 'O PRAXIS elimina o retrabalho manual. Os laudos técnicos com fotos e cálculos de conformidade são gerados no exato momento da vistoria. O tempo antes gasto digitando relatórios no escritório passa a ser investido na prospecção e atendimento de novos clientes.'
    },
    {
      question: 'É possível acompanhar o desempenho individual de cada nutricionista da equipe?',
      answer: 'Sim. A liderança da consultoria tem visão clara de quais visitas foram realizadas, horários de atendimento, relatórios emitidos e planos de ação pendentes por profissional.'
    },
    {
      question: 'Como o sistema ajuda na retenção dos clientes atendidos?',
      answer: 'O cliente percebe valor imediato ao receber laudos executivos elegantes e claros, gráficos que mostram a evolução dos índices sanitários e um plano 5W2H que orienta a equipe operacional da cozinha sem atritos.'
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
        <Breadcrumb items={[{ name: 'Gestão de Consultoria de Alimentos', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 lg:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Gestão Operacional & Produtividade</span>
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
                Começar a Organizar Minha Consultoria
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/software-para-consultoria-de-alimentos/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Módulos do Sistema
              </Button>
            </Link>
          </div>
        </section>

        {/* GEO Block */}
        <section className="my-10 p-6 sm:p-8 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">
            Metodologia de Gestão PRAXIS
          </h2>
          <blockquote className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 my-2">
            "A gestão de uma consultoria de alimentos no PRAXIS é orientada a resultados: padronização de checklists, histórico inalterável de clientes e unidades, controle de tempo de visitação e acompanhamento ativo de planos corretivos, permitindo que a empresa cresça em número de contratos sem perder qualidade técnica."
          </blockquote>
        </section>

        {/* Pilares de Produtividade */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <Clock className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Redução Drástica de Tempo</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Menos 80% do tempo gasto após visitas digitando relatórios no escritório. Termine a auditoria na unidade e envie o PDF aprovado na hora.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <Target className="w-8 h-8 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Indicadores de Conformidade</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Monitore o percentual de conformidade de cada cliente e de cada unidade. Identifique setores recorrentes em desvios para treinamentos dirigidos.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <TrendingUp className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Crescimento com Segurança</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Adicione novos nutricionistas à consultoria mantendo os clientes no padrão de qualidade da sua marca, com histórico preservado.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqs} />
      </div>
    </PublicLayout>
  );
};
