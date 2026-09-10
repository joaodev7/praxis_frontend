import React, { useState } from 'react';
import { 
  Mail, 
  PhoneCall, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { PublicLayout } from '../../components/seo/PublicLayout';
import { SEO } from '../../components/seo/SEO';
import { Breadcrumb } from '../../components/seo/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { SEO_PAGES } from '../../seo/metadata';

export const ContatoPage: React.FC = () => {
  const meta = SEO_PAGES.contato;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonicalPath}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ name: 'Contato', url: meta.canonicalPath }]} />

        <div className="py-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {meta.h1}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            {meta.subheadline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16">
          
          {/* Informações Oficiais */}
          <div className="space-y-8">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Canais Oficiais de Atendimento</h2>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">E-mail Comercial & Suporte</h3>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">contato@praxisnutri.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">WhatsApp & Telefone</h3>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">+55 (85) 99876-5432</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Horário de Atendimento</h3>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">Segunda a Sexta, das 08h às 18h (Horário de Brasília)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mensagem Recebida com Sucesso!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  Nossa equipe técnica entrará em contato em menos de 2 horas úteis para atendê-lo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Envie uma Mensagem</h2>
                
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: Dra. Juliana Costa"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">E-mail Profissional</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="seuemail@consultoria.com.br"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Como podemos te ajudar?</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Conte brevemente sobre o número de clientes e principais necessidades da sua consultoria..."
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full justify-center font-bold py-3">
                  Enviar Mensagem
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
