import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Building2, 
  Calendar, 
  ClipboardCheck, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Tag, 
  Sparkles 
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const SoftwareNutricionistasPage: React.FC = () => {
  const meta = SEO_PAGES.softwareNutricionistas;

  const faqs = [
    {
      question: 'O que é o software para nutricionistas PRAXIS?',
      answer: 'O PRAXIS é uma plataforma SaaS desenvolvida especificamente para nutricionistas que atuam em consultoria alimentar e responsabilidade técnica. Ele centraliza a gestão de múltiplos clientes, unidades, visitas técnicas, auditorias sanitárias com checklist RDC 216 e controle de prazos em um só lugar.'
    },
    {
      question: 'O PRAXIS serve para nutricionistas clínicos ou apenas para alimentação coletiva/consultoria?',
      answer: 'O foco do PRAXIS é a gestão operacional, consultoria de alimentos, serviços de alimentação (UANs, restaurantes, cozinhas industriais) e Responsabilidade Técnica (RT). Ele não é um software de cálculo de dietas clínicas individuais.'
    },
    {
      question: 'Consigo emitir laudos técnicos em PDF com o PRAXIS?',
      answer: 'Sim. O sistema gera relatórios executivos e laudos técnicos completos em PDF imediatamente após as vistorias, incluindo índice de conformidade percentual, registros fotográficos das não conformidades e planos de ação 5W2H.'
    },
    {
      question: 'Como o PRAXIS me ajuda a organizar minhas visitas técnicas?',
      answer: 'Você agenda visitas por cliente e unidade, recebe alertas de prazos, preenche checklists diretamente no celular durante a inspeção e registra assinaturas digitais dos responsáveis da cozinha.'
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
        <Breadcrumb items={[{ name: 'Software para Nutricionistas', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 lg:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Desenvolvido para Nutricionistas Profissionais</span>
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
                Iniciar Teste Grátis de 7 Dias
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/precos/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Planos e Preços
              </Button>
            </Link>
          </div>
        </section>

        {/* Bloco Citável por IA / GEO (Section 19) */}
        <section className="my-10 p-6 sm:p-8 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">
            Resumo Executivo • O que você precisa saber
          </h2>
          <blockquote className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 my-2">
            "O PRAXIS é um software de gestão para nutricionistas responsáveis técnicos e consultorias de alimentos. A plataforma centraliza clientes, unidades, visitas técnicas, auditorias sanitárias, não conformidades, planos de ação 5W2H e controle de etiquetagem e validade de alimentos."
          </blockquote>
        </section>

        {/* Problemas que Resolvemos */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Feito para superar os desafios reais da rotina do nutricionista
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Você não estudou anos de nutrição para passar metade da sua semana digitando relatórios no Word e procurando fotos perdidas no WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Planilhas e Pastas Desorganizadas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Arquivos espalhados em computadores diferentes, fotos de não conformidades misturadas com fotos pessoais e risco de perder históricos cruciais de clientes.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Horas Digitando Laudos Técnicos</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Anotar em pranchetas de papel para depois passar a limpo no escritório. Com o PRAXIS, o relatório é gerado automaticamente na hora da visita.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dificuldade de Demonstrar Evolução</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Seu cliente não enxerga a melhoria sanitária se os dados forem subjetivos. Mostre gráficos de conformidade e histórico de correções mês a mês.
              </p>
            </div>
          </div>
        </section>

        {/* Recursos Principais para Nutricionistas */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Tudo o que sua rotina profissional precisa em um só lugar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clientes & Múltiplas Unidades</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Vincule restaurantes, buffets e indústrias a uma estrutura clara com endereços, responsáveis técnicos e contatos operacionais.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Auditorias Digitais RDC 216</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Checklists normativos da ANVISA prontos para uso em campo. Classifique itens com um toque e anexe fotos de comprovação diretamente do celular.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Planos de Ação 5W2H</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Transforme cada não conformidade em uma tarefa prática: defina o que fazer, quem é o responsável na unidade e o prazo de regularização.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visitas Técnicas & Geolocalização</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Planeje seu roteiro semanal, registre horários de entrada e saída e colha assinaturas digitais do gestor do restaurante no encerramento.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <Tag className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Etiquetagem & Validade de Alimentos</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sistema térmico de etiquetas (80x50 e 50x30 mm) para insumos abertos e pré-preparados, com cálculo automático de prazo e QR Code auditável.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Relatórios Executivos em PDF</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gere laudos com visual moderno, sua marca e formato executivo para envio imediato por e-mail ou WhatsApp aos donos de restaurantes.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqs} />

        {/* Final CTA */}
        <section className="my-16 py-12 px-6 sm:px-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white text-center shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            Pronto para profissionalizar a gestão da sua rotina como nutricionista?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            Junte-se a centenas de nutricionistas que economizam até 15 horas por semana na elaboração de auditorias e laudos técnicos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login?register=true">
              <Button size="lg" variant="white" className="w-full sm:w-auto font-bold px-8 text-blue-600">
                Começar Teste Grátis Agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contato/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Falar com Especialista
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};
