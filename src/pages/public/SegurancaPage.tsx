import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  KeyRound, 
  Server, 
  FileCheck 
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { SEO_PAGES } from '../../seo/metadata';

export const SegurancaPage: React.FC = () => {
  const meta = SEO_PAGES.seguranca;

  return (
    <PublicLayout>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonicalPath}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ name: 'Segurança & LGPD', url: meta.canonicalPath }]} />

        <section className="py-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Proteção Empresarial de Dados</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            {meta.h1}
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {meta.subheadline}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-t border-slate-200 dark:border-slate-800">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Criptografia de Ponta a Ponta</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Todos os dados transmitidos entre seu navegador e nossos servidores utilizam criptografia TLS 1.3 com certificados SSL modernos. Em repouso, os bancos de dados utilizam criptografia AES-256.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <Database className="w-6 h-6 text-emerald-600" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Isolamento Multi-Tenant Rigoroso</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Os dados da sua consultoria são segregados por TenantId no nível da arquitetura de banco de dados e consultas EF Core. Um usuário jamais tem acesso a informações de outra organização.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <Server className="w-6 h-6 text-purple-600" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Backups Diários e Redundância</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Realizamos cópias de segurança automatizadas e diárias dos dados em servidores geograficamente distribuídos, garantindo proteção contra perda acidental e recuperação rápida de desastres.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
            <FileCheck className="w-6 h-6 text-amber-600" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Conformidade com a LGPD</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Operamos em estrita observância à Lei Geral de Proteção de Dados (Lei nº 13.709/2018), com controle de consentimento, portabilidade e direito de exclusão de dados pessoais.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
