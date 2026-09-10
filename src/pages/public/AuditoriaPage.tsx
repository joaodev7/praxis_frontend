import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  ArrowRight, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  SearchCheck
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const AuditoriaPage: React.FC = () => {
  const meta = SEO_PAGES.auditoria;

  const faqs = [
    {
      question: 'Como funciona a auditoria digital no PRAXIS?',
      answer: 'O auditor abre a vistoria técnica no celular ou tablet, seleciona o checklist apropriado (como RDC 216 ou formulários customizados) e avalia item por item marcando Conforme, Não Conforme ou Não Aplicável. Para cada inconformidade, anexa fotos e comentários na hora.'
    },
    {
      question: 'O laudo de auditoria calcula a nota ou percentual de conformidade?',
      answer: 'Sim. O cálculo do percentual geral e por bloco (instalações, manipuladores, controle de pragas, matérias-primas, higienização) é automático e instantâneo.'
    },
    {
      question: 'As fotos tiradas ficam anexadas ao relatório final em PDF?',
      answer: 'Sim. Todas as evidências fotográficas são organizadas no documento PDF gerado com alta definição, data, hora e descrição da irregularidade.'
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
        <Breadcrumb items={[{ name: 'Auditoria de Segurança dos Alimentos', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 lg:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <SearchCheck className="w-3.5 h-3.5" />
            <span>Auditorias Higiênico-Sanitárias</span>
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
                Iniciar Auditoria Teste
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/checklist-rdc-216/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Conhecer Checklist RDC 216
              </Button>
            </Link>
          </div>
        </section>

        {/* GEO Block */}
        <section className="my-10 p-6 sm:p-8 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">
            Metodologia de Auditoria
          </h2>
          <blockquote className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 my-2">
            "A auditoria de segurança dos alimentos no PRAXIS conecta a observação direta em campo à geração automatizada de relatórios. Ela permite catalogar evidências fotográficas, classificar não conformidades e vincular planos corretivos antes mesmo do auditor sair do estabelecimento."
          </blockquote>
        </section>

        {/* Ciclo Completo da Auditoria */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Da Inspeção à Correção Comprovada
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">1. Checklist em Campo</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Avaliação ágil setor por setor em dispositivo móvel com interface intuitiva.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">2. Fotos de Evidência</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Captura fotográfica direta no app vinculada à não conformidade específica.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">3. Plano 5W2H</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Atribuição imediata de responsável e prazo para cada ponto de melhoria.</p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">4. Laudo Técnico PDF</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Documento executivo pronto para assinatura digital e entrega ao cliente.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqs} />
      </div>
    </PublicLayout>
  );
};
