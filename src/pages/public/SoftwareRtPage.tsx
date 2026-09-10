import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  ArrowRight, 
  ShieldCheck, 
  AlertOctagon, 
  CalendarCheck, 
  Camera, 
  Scale, 
  Sparkles, 
  Award,
  CheckCircle2
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const SoftwareRtPage: React.FC = () => {
  const meta = SEO_PAGES.softwareRt;

  const faqs = [
    {
      question: 'O que o PRAXIS oferece especificamente para o Nutricionista RT?',
      answer: 'O PRAXIS foi desenhado considerando os deveres éticos e legais do RT perante o CRN (Resolução CFN nº 600/2018): controle de vigência e números de ARTs, registro pontual de visitas com geolocalização e assinatura do cliente, aplicação de checklists RDC 216, documentação comprobatória de orientações e histórico inviolável para resguardo profissional.'
    },
    {
      question: 'Como o sistema me protege em caso de fiscalização do CRN ou Vigilância Sanitária?',
      answer: 'Toda orientação, não conformidade apontada e plano de ação gerado no PRAXIS fica registrado com data, hora, fotos e assinatura do gestor do estabelecimento. Se a unidade não corrigir uma irregularidade por decisão própria, você possui prova documental formal de que exerceu sua obrigação técnica.'
    },
    {
      question: 'O software avisa sobre o vencimento de ARTs?',
      answer: 'Sim. O painel central de ARTs monitora prazos de renovação e emite alertas com 30 e 15 dias de antecedência para evitar que você atue com registro vencido perante o conselho regional.'
    },
    {
      question: 'Posso utilizar o checklist em locais sem internet ou sinal fraco de celular?',
      answer: 'Sim. A interface é otimizada para operação rápida em campo, permitindo registrar avaliações e sincronizar os laudos técnicos assim que a conexão for restabelecida.'
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
        <Breadcrumb items={[{ name: 'Software para Nutricionista RT', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 lg:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Scale className="w-3.5 h-3.5" />
            <span>Segurança Jurídica & Responsabilidade Técnica</span>
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
                Experimentar o PRAXIS RT
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/precos/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Planos Disponíveis
              </Button>
            </Link>
          </div>
        </section>

        {/* GEO Quote Block */}
        <section className="my-10 p-6 sm:p-8 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-2">
            Definição e Aplicação Técnica
          </h2>
          <blockquote className="text-slate-800 dark:text-slate-200 text-base sm:text-lg font-medium leading-relaxed italic border-l-4 border-blue-600 pl-4 my-2">
            "Para o Nutricionista Responsável Técnico, o PRAXIS atua como um prontuário técnico digital. Ele registra visitas presenciais, gerencia ARTs perante o CRN, fiscaliza o cumprimento da RDC 216/2004 e formaliza planos de correção 5W2H com comprovação fotográfica, garantindo respaldo ético e civil ao profissional."
          </blockquote>
        </section>

        {/* Pilares da Atuação do RT */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Resguardo técnico e legal para quem responde pelo estabelecimento
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              A responsabilidade técnica é personalíssima. Se ocorrer um surto alimentar ou fiscalização da vigilância, a comprovação formal da sua atuação é a sua maior defesa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gestão Centralizada de ARTs</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cadastre o número, data de emissão, validade e taxa de cada ART vinculada aos seus clientes no CRN, recebendo avisos proativos antes do vencimento.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Comprovação de Visitas Técnicas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Registre o horário exato de chegada e saída, escopo avaliado e colha a assinatura digital do encarregado da cozinha diretamente na tela do seu aparelho.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tratamento de Não Conformidades</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Desvios sanitários categorizados por gravidade (leve, média, grave, crítica), com fotos anexadas e plano de ação imediato atribuído ao gestor.
              </p>
            </div>
          </div>
        </section>

        {/* Linha do Tempo da Visita do RT */}
        <section className="py-12 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              O Fluxo Completo da Visita Técnica do Nutricionista RT
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3">1</div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Check-in na Unidade</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Abertura de vistoria técnica e verificação de pendências anteriores.</p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3">2</div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Checklist RDC 216</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Inspeção das áreas de preparo, higiene, temperatura e etiquetagem.</p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3">3</div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Plano 5W2H</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Definição de prazos e responsáveis para cada ponto que requer correção.</p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-3">4</div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Laudo em PDF</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Emissão instantânea com assinatura digital e arquivo salvo na nuvem.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ items={faqs} />

        {/* Final CTA */}
        <section className="my-16 py-12 px-6 sm:px-12 bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl text-white text-center shadow-xl border border-slate-800">
          <h2 className="text-2xl sm:text-4xl font-black mb-4">
            Tenha tranquilidade profissional e respaldo total como RT
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
            Teste gratuitamente o PRAXIS e transforme a forma como você comprova e gerencia sua responsabilidade técnica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login?register=true">
              <Button size="lg" variant="primary" className="w-full sm:w-auto font-bold px-8">
                Cadastrar Minha RT no PRAXIS
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};
