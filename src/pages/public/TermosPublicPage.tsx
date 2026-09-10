import React from 'react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { SEO_PAGES } from '../../seo/metadata';

export const TermosPublicPage: React.FC = () => {
  const meta = SEO_PAGES.termos;

  return (
    <PublicLayout>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonicalPath}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ name: 'Termos de Uso', url: meta.canonicalPath }]} />

        <section className="py-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            {meta.h1}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
            Última atualização: 10 de setembro de 2026 • Termos e Condições Gerais de Uso
          </p>

          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Objeto</h2>
            <p>
              Estes Termos de Uso regulam o acesso e a utilização do software como serviço (SaaS) PRAXIS, destinado à gestão operacional de consultorias em alimentação, serviços de nutrição e responsabilidade técnica.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Cadastro e Responsabilidade pelo Acesso</h2>
            <p>
              O usuário declara que as informações fornecidas no cadastro são verídicas e assume total responsabilidade pela guarda e confidencialidade de suas credenciais de login.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Natureza dos Serviços (Ferramenta de Gestão)</h2>
            <p>
              O PRAXIS é um sistema de suporte à gestão e automação de processos. A responsabilidade técnica pelas avaliações, pareceres, diagnósticos higiênico-sanitários e prescrições cabe exclusivamente ao Nutricionista habilitado e à consultoria contratante.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Cancelamento e Pagamentos</h2>
            <p>
              Os serviços são cobrados em regime de assinatura mensal ou anual. O usuário pode cancelar a renovação automática a qualquer momento através do painel de cobrança, sem multas rescisórias nos planos mensais.
            </p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};
