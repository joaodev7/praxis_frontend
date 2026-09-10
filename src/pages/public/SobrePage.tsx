import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Target, 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const SobrePage: React.FC = () => {
  const meta = SEO_PAGES.sobre;

  return (
    <PublicLayout>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonicalPath}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ name: 'Sobre o PRAXIS', url: meta.canonicalPath }]} />

        <section className="py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>Nossa História e Propósito</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            {meta.h1}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {meta.subheadline}
          </p>
        </section>

        {/* Narrative */}
        <section className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6 text-base leading-relaxed py-6 border-t border-slate-200 dark:border-slate-800">
          <p>
            O <strong>PRAXIS</strong> nasceu da constatação direta de um problema crítico enfrentado diariamente por milhares de nutricionistas no Brasil: a enorme sobrecarga operacional de gerenciar clientes, vistorias em campo, pranchetas de papel e prazos de responsabilidade técnica sem ferramentas tecnológicas adequadas.
          </p>
          <p>
            Enquanto outros setores já utilizavam softwares especializados em nuvem, a segurança dos alimentos e a consultoria nutricional continuavam reféns de planilhas complexas, conversas dispersas em aplicativos de mensagens e relatórios manuais redigidos madrugada adentro.
          </p>
          <p>
            Nossa missão é simples e ambiciosa: <strong>valorizar o trabalho técnico do nutricionista e proteger a saúde da população</strong> através de uma plataforma moderna que une rigor regulatório (ANVISA RDC 216/2004, normas do CFN e vigilâncias sanitárias locais) a uma experiência digital fluida e intuitiva.
          </p>
        </section>

        {/* Valores */}
        <section className="py-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-800">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white mb-2">Rigor Técnico</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Desenvolvido com fundamentação nas legislações sanitárias federais e estaduais vigentes.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white mb-2">Foco no Usuário</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Telas planejadas para execução em segundos em cozinhas agitadas e em trânsito.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white mb-2">Segurança de Dados</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Total isolamento multi-tenant e conformidade irrestrita com a LGPD.</p>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};
