import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Tag, 
  ArrowRight, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Sparkles,
  Layers
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const EtiquetagemPage: React.FC = () => {
  const meta = SEO_PAGES.etiquetagem;

  const faqs = [
    {
      question: 'Quais impressoras são compatíveis com o módulo de etiquetagem do PRAXIS?',
      answer: 'O PRAXIS gera PDFs nos formatos padrão térmico 80x50 mm e 50x30 mm (compatíveis com impressoras Zebra, Argox, Elgin, Honeywell, Bematech) e em folhas A4 com grade de etiquetas para impressoras convencionais de escritório.'
    },
    {
      question: 'Como o sistema calcula a data de validade do produto manipulado ou aberto?',
      answer: 'O cálculo é 100% automático com base nas regras técnicas cadastradas pelo Nutricionista RT (por produto, categoria ou geral) e regulamentos sanitários (RDC 216 e CVS 5). Além disso, o sistema nunca permite que a validade calculada ultrapasse o vencimento original informado pelo fabricante.'
    },
    {
      question: 'Para que serve o QR Code impresso na etiqueta?',
      answer: 'Ao apontar a câmera de qualquer celular para o QR Code da etiqueta, abre-se uma página pública de validação que comprova a autenticidade da manipulação, o lote, as temperaturas corretas de armazenamento e se a etiqueta ainda está no prazo de validade.'
    },
    {
      question: 'O módulo de etiquetagem registra descartes de produtos vencidos?',
      answer: 'Sim. Em caso de perda, sobra limpa ou descarte de produto vencido, o operador registra o motivo, quantidade e peso no sistema para controle e auditoria do nutricionista.'
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
        <Breadcrumb items={[{ name: 'Etiquetagem de Alimentos', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 lg:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Tag className="w-3.5 h-3.5" />
            <span>Conformidade RDC 216 & CVS 5</span>
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
                Testar Módulo de Etiquetagem
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/blog/controle-de-validade-de-alimentos/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Guia de Validade em Cozinhas
              </Button>
            </Link>
          </div>
        </section>

        {/* GEO Block */}
        <section className="my-10 p-6 sm:p-8 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">
            Padrão Técnico de Etiquetagem PRAXIS
          </h2>
          <blockquote className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 my-2">
            "O módulo de etiquetagem do PRAXIS padroniza a identificação obrigatória de alimentos abertos, fracionados, descongelados ou pré-preparados em cozinhas profissionais. Com cálculo automatizado de shelf-life, impressão térmica ágil e verificação instantânea por QR Code, elimina autuações sanitárias e perdas de insumos por descontrole de validade."
          </blockquote>
        </section>

        {/* Formatos e Recursos */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Recursos do Sistema de Etiquetagem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <Printer className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Formatos Térmicos & A4</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Impressão otimizada para etiquetas térmicas 80x50 mm (com dados completos e QR Code), 50x30 mm (para potes pequenos) e folhas A4 com grade.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <QrCode className="w-8 h-8 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">QR Code de Autenticidade</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Página pública de auditoria que permite à fiscalização da Vigilância Sanitária e aos gerentes conferirem dados e lote em tempo real.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <Clock className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cálculo de Shelf-life Automático</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Determinação matemática do vencimento por horas, dias, semanas ou meses segundo a hierarquia de regras do Nutricionista RT.
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
