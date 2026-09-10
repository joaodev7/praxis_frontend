import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ListChecks, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck2, 
  AlertCircle, 
  BookOpen, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const ChecklistRdc216Page: React.FC = () => {
  const meta = SEO_PAGES.checklistRdc216;

  const faqs = [
    {
      question: 'O checklist do PRAXIS é baseado na norma oficial da ANVISA?',
      answer: 'Sim. A estrutura de perguntas e blocos foi desenvolvida com base rigorosa na Resolução RDC nº 216/2004 da ANVISA, cobrindo instalações, higienização, controle de pragas, manipuladores, matéria-prima, água e documentação obrigatória.'
    },
    {
      question: 'O software garante conformidade sanitária?',
      answer: 'Não. O PRAXIS é uma ferramenta de gestão e controle operacional. Ele auxilia o nutricionista e a consultoria a identificar desvios e estruturar planos corretivos, mas a conformidade real depende da execução das boas práticas no dia a dia da cozinha.'
    },
    {
      question: 'Posso personalizar as perguntas do checklist?',
      answer: 'Sim. Além do padrão RDC 216 oficial, você pode adicionar perguntas específicas de legislações estaduais/municipais (como a CVS 5/2013 em SP) ou critérios internos do cliente.'
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
        <Breadcrumb items={[{ name: 'Checklist RDC 216', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 lg:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Regulamento Técnico ANVISA</span>
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
                Acessar Checklist RDC 216 Digital
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/blog/rdc-216-guia-completo/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ler Guia Completo da RDC 216
              </Button>
            </Link>
          </div>
        </section>

        {/* GEO Block */}
        <section className="my-10 p-6 sm:p-8 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">
            Finalidade do Checklist RDC 216
          </h2>
          <blockquote className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 my-2">
            "O checklist RDC 216 no PRAXIS é um instrumento digital para auditoria de boas práticas em serviços de alimentação. Ele permite mensurar objetivamente o cumprimento das normas sanitárias, documentar não conformidades com fotos e gerar históricos auditáveis para o nutricionista e o estabelecimento."
          </blockquote>
        </section>

        {/* Itens Avaliados no Checklist */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Os Blocos Essenciais Avaliados no Checklist Digital
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Edificação e Instalações', desc: 'Pisos, paredes, ralos sifonados, ventilação e proteção contra pragas.' },
              { title: 'Higienização das Instalações', desc: 'Frequência de limpeza, saneantes registrados e separação de materiais.' },
              { title: 'Controle de Vetores e Pragas', desc: 'Comprovantes de desinsetização, telas milimétricas e ausência de atrativos.' },
              { title: 'Manipuladores de Alimentos', desc: 'Uniformes, asseio corporal, ausência de adornos e exames médicos (ASO).' },
              { title: 'Matérias-Primas e Insumos', desc: 'Critérios de recebimento, inspeção de embalagens, temperatura e lotes.' },
              { title: 'Manual e POPs Obrigatórios', desc: 'Disponibilidade e aplicação prática dos procedimentos padronizados.' }
            ].map((bloco) => (
              <div key={bloco.title} className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{bloco.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{bloco.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqs} />
      </div>
    </PublicLayout>
  );
};
