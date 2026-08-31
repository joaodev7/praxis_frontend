import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { billingService, SubscriptionInfo } from '../services/billing';

export const BillingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const sub = await billingService.getSubscription();
      setSubscription(sub);
      return sub;
    } catch (err) {
      console.error('Erro ao verificar assinatura:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let count = 0;
    
    fetchSubscription().then((sub) => {
      // If not yet active, poll up to 6 times (every 3 seconds)
      if (sub && sub.status !== 2) {
        interval = setInterval(async () => {
          count++;
          const updated = await fetchSubscription();
          if ((updated && updated.status === 2) || count >= 6) {
            if (interval) clearInterval(interval);
          }
        }, 3000);
      }
    });

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const isActive = subscription?.status === 2;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        {isActive ? (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={40} />
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={40} className="animate-spin" />
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isActive ? 'Assinatura Ativada com Sucesso!' : 'Pagamento em Processamento'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {isActive
            ? `Seu plano ${subscription?.planName || 'PRAXIS'} já está 100% ativo. Todos os recursos e limites foram liberados para sua equipe.`
            : 'Recebemos a confirmação do checkout do Asaas. O webhook de pagamento está sincronizando os dados com a sua conta.'}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-200/60 dark:border-slate-700/60 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Plano Contratado:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {subscription?.planName || 'Plano Profissional'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Status do Acesso:</span>
            <span className={`font-semibold px-2 py-0.5 rounded-full ${
              isActive 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
            }`}>
              {subscription?.statusDescription || (isActive ? 'Ativo' : 'Confirmando...')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Ciclo:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {subscription?.billingCycle === 2 ? 'Anual' : 'Mensal'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Pagamento processado com segurança via Asaas</span>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center"
            onClick={() => navigate('/dashboard')}
          >
            <span>Acessar Painel PRAXIS</span>
            <ArrowRight size={18} className="ml-2" />
          </Button>

          {!isActive && (
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center"
              onClick={fetchSubscription}
              disabled={loading}
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span>Verificar Novamente</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingSuccessPage;
