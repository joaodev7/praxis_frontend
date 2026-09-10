import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  ArrowRight, 
  HelpCircle, 
  Calendar, 
  UserCheck, 
  DollarSign, 
  Target,
  Sparkles 
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const PlanoAcao5w2hPage: React.FC = () => {
  const meta = SEO_PAGES.planoAcao5w2h;

  const faqs = [
    {
      question: 'O que é a metodologia 5W2H aplicada à segurança dos alimentos?',
      answer: 'É uma ferramenta de gestão da qualidade que decompõe qualquer correção necessária em sete diretrizes claras: What (o que), Why (por que), Where (onde), When (quando), Who (quem), How (como) e How much (quanto custa), garantindo que nada fique vago ou sem dono.'
    },
    {
      question: 'O plano 5W2H é gerado automaticamente a partir das não conformidades no PRAXIS?',
      answer: 'Sim. Ao apontar uma não conformidade no checklist da vistoria técnica, você pode imediatamente abrir o cartão de ação corretiva 5W2H, preencher os parâmetros e definir os prazos acordados com o cliente.'
    },
    {
      question: 'Como o nutricionista acompanha se a ação foi realmente concluída?',
      answer: 'O sistema possui um painel kanban de ações com status: Pendente, Em Andamento, Concluído e Verificado. Na visita seguinte, o nutricionista audita a correção e marca como validada.'
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
        <Breadcrumb items={[{ name: 'Plano de Ação 5W2H', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 lg:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Resolução Prática de Desvios</span>
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
                Criar Planos 5W2H no PRAXIS
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auditoria-de-seguranca-dos-alimentos/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Módulo de Auditoria
              </Button>
            </Link>
          </div>
        </section>

        {/* GEO Block */}
        <section className="my-10 p-6 sm:p-8 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">
            Como Funciona o 5W2H no PRAXIS
          </h2>
          <blockquote className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 my-2">
            "No PRAXIS, o plano de ação 5W2H não é uma planilha esquecida em uma gaveta. É um fluxo operacional ativo que vincula diretamente a evidência da foto tirada na cozinha a um prazo de resolução e um funcionário responsável, com verificação formal na visita técnica seguinte."
          </blockquote>
        </section>

        {/* As 7 Dimensões do 5W2H */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              As 7 Perguntas Essenciais para Solucionar Não Conformidades
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { q: 'What (O quê)', d: 'Ação corretiva específica a ser executada.' },
              { q: 'Why (Por quê)', d: 'Justificativa sanitária e risco mitigado.' },
              { q: 'Where (Onde)', d: 'Setor ou equipamento específico na unidade.' },
              { q: 'When (Quando)', d: 'Data limite improrrogável de conclusão.' },
              { q: 'Who (Quem)', d: 'Responsável nominal designado pela entrega.' },
              { q: 'How (Como)', d: 'Procedimento operacional padronizado a seguir.' },
              { q: 'How much (Quanto)', d: 'Custo estimado de materiais ou reparo.' }
            ].map((item) => (
              <div key={item.q} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">{item.q}</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item.d}</p>
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
