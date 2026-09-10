import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { FAQ } from '../../components/seo/FAQ';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const PrecosPublicPage: React.FC = () => {
  const meta = SEO_PAGES.precos;
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Profissional Autônomo',
      desc: 'Ideal para nutricionistas RTs autônomos que atendem até 5 estabelecimentos.',
      priceMonthly: 149,
      priceAnnual: 119,
      features: [
        'Até 5 clientes ativos',
        'Até 15 unidades de atendimento',
        'Checklist RDC 216 completo',
        'Relatórios e laudos em PDF com sua marca',
        'Controle de ARTs com alertas de vencimento',
        'Módulo de Etiquetagem Térmica (80x50 e 50x30)',
        'Suporte prioritário via WhatsApp'
      ],
      cta: 'Começar com Plano Autônomo',
      popular: false
    },
    {
      id: 'growth',
      name: 'Consultoria Pro',
      desc: 'Para consultorias em expansão com múltiplos clientes e equipe de nutricionistas.',
      priceMonthly: 299,
      priceAnnual: 239,
      features: [
        'Até 25 clientes ativos',
        'Até 60 unidades de atendimento',
        'Até 5 nutricionistas na equipe',
        'Planos de ação 5W2H automatizados',
        'Geolocalização de visitas e check-in em campo',
        'Etiquetagem com QR Code público de validação',
        'Histórico ilimitado de auditorias e fotos',
        'Onboarding personalizado da equipe'
      ],
      cta: 'Escolher Consultoria Pro',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Consultoria Escala',
      desc: 'Para grandes consultorias, redes de franquias e empresas de alimentação coletiva.',
      priceMonthly: 549,
      priceAnnual: 439,
      features: [
        'Clientes e unidades ilimitados',
        'Nutricionistas ilimitados',
        'API de integração de dados',
        'Dashboards executivos consolidados',
        'Gestor de conta e suporte 24/7',
        'Treinamento presencial/remoto de equipe',
        'SLA de 99.9% de disponibilidade'
      ],
      cta: 'Falar com Consultor Corporativo',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'O PRAXIS possui período de teste gratuito?',
      answer: 'Sim! Você pode testar todos os recursos do PRAXIS gratuitamente por 7 dias, sem compromisso e sem precisar cadastrar cartão de crédito.'
    },
    {
      question: 'Existe fidelidade ou multa de cancelamento?',
      answer: 'Não. Nos planos mensais, você pode cancelar a qualquer momento sem custos adicionais ou multas.'
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos cartão de crédito (com liberação imediata), Pix e boleto bancário.'
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
        <Breadcrumb items={[{ name: 'Planos & Preços', url: meta.canonicalPath }]} />

        {/* Hero Section */}
        <section className="py-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Preços Transparentes Sem Pegadinhas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {meta.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {meta.subheadline}
          </p>

          {/* Toggle Mensal / Anual */}
          <div className="inline-flex items-center p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-12">
            <button
              onClick={() => setCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                cycle === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Faturamento Mensal
            </button>
            <button
              onClick={() => setCycle('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                cycle === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>Faturamento Anual</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full">
                20% OFF
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((p) => {
            const price = cycle === 'annual' ? p.priceAnnual : p.priceMonthly;
            return (
              <div
                key={p.id}
                className={`relative rounded-2xl border p-8 flex flex-col justify-between transition-all ${
                  p.popular
                    ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-900 shadow-xl'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Mais Escolhido por Consultorias
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{p.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 h-10">{p.desc}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">R$ {price}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium"> / mês</span>
                    {cycle === 'annual' && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                        Faturado anualmente com desconto
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link to="/login?register=true">
                  <Button
                    variant={p.popular ? 'primary' : 'outline'}
                    className="w-full justify-center font-bold"
                  >
                    {p.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <FAQ items={faqs} />
      </div>
    </PublicLayout>
  );
};
