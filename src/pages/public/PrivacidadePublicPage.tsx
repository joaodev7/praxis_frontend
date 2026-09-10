import React from 'react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { SEO_PAGES } from '../../seo/metadata';

export const PrivacidadePublicPage: React.FC = () => {
  const meta = SEO_PAGES.privacidade;

  return (
    <PublicLayout>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonicalPath}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ name: 'Política de Privacidade', url: meta.canonicalPath }]} />

        <section className="py-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            {meta.h1}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-8">
            Última atualização: 10 de setembro de 2026 • Em conformidade com a Lei nº 13.709/2018 (LGPD)
          </p>

          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Introdução e Escopo</h2>
            <p>
              Esta Política de Privacidade descreve como a plataforma PRAXIS coleta, armazena, utiliza e protege os dados cadastrais e operacionais de nutricionistas, consultorias de alimentos e seus respectivos clientes.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Dados Pessoais Coletados</h2>
            <p>
              Coletamos apenas os dados estritamente necessários para a prestação dos serviços: nome, CPF, registro profissional no CRN, e-mail, telefone comercial, dados de clientes atendidos e evidências fotográficas coletadas durante as vistorias técnicas.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Finalidade do Tratamento</h2>
            <p>
              Os dados coletados destinam-se exclusivamente a: emissão de laudos técnicos e relatórios de auditoria, controle de vigência de ARTs, elaboração de planos de ação 5W2H, autenticação de segurança na plataforma e comunicação de suporte técnico.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Não Compartilhamento com Terceiros</h2>
            <p>
              O PRAXIS não comercializa, não aluga e não compartilha dados pessoais ou operacionais com terceiros para fins publicitários.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Direitos do Titular (Art. 18 da LGPD)</h2>
            <p>
              Você pode solicitar a qualquer momento a confirmação da existência de tratamento, acesso aos seus dados, correção de dados incompletos ou a exclusão definitiva da sua conta através do e-mail privacidade@praxisnutri.com.br.
            </p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};
