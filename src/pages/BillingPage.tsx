import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Building2, 
  Users, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  XCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { billingService, Plan, SubscriptionInfo, PaymentHistory, CheckoutResponse } from '../services/billing';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const BillingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [billingCycle, setBillingCycle] = useState<1 | 2>(1); // 1 = Monthly, 2 = Annual

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<1 | 2>(1); // 1 = Pix, 2 = Credit Card
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Credit Card Form State
  const [cardData, setCardData] = useState({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
    cpfCnpj: '',
    postalCode: '',
    addressNumber: '',
    phone: ''
  });

  // Cancel / Action Modals
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, subData, paymentsData] = await Promise.all([
        billingService.getPlans(),
        billingService.getSubscription(),
        billingService.getPayments()
      ]);
      setPlans(plansData);
      setSubscription(subData);
      setPayments(paymentsData);
    } catch (err) {
      console.error('Erro ao carregar dados de cobrança:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCpfCnpj = (val: string) => {
    // Retém letras e números para suporte total ao novo CNPJ alfanumérico da Receita Federal
    const chars = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 14);
    if (chars.length <= 11 && /^\d+$/.test(chars)) {
      return chars
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return chars
      .replace(/^([A-Z0-9]{2})([A-Z0-9])/, '$1.$2')
      .replace(/^([A-Z0-9]{2})\.([A-Z0-9]{3})([A-Z0-9])/, '$1.$2.$3')
      .replace(/\.([A-Z0-9]{3})([A-Z0-9])/, '.$1/$2')
      .replace(/([A-Z0-9]{4})([A-Z0-9])/, '$1-$2');
  };

  const formatCep = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 8);
    return digits.replace(/^(\d{5})(\d)/, '$1-$2');
  };

  const handleOpenCheckout = (plan: Plan) => {
    setSelectedPlan(plan);
    setCheckoutResult(null);
    setCheckoutError(null);
    setCopiedPix(false);
    setIsCheckoutOpen(true);
  };

  const handleExecuteCheckout = async () => {
    if (!selectedPlan) return;
    try {
      setProcessingCheckout(true);
      setCheckoutError(null);

      const payload: any = {
        planCode: selectedPlan.code,
        billingCycle,
        paymentMethod
      };

      if (paymentMethod === 2) {
        const cleanCard = cardData.number.replace(/\D/g, '');
        const cleanCpfCnpj = cardData.cpfCnpj.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const cleanCvv = cardData.ccv.replace(/\D/g, '');

        if (!cleanCard || !cardData.holderName || !cardData.expiryMonth || !cardData.expiryYear || !cleanCvv || !cleanCpfCnpj) {
          setCheckoutError('Por favor, preencha todos os campos obrigatórios do cartão.');
          setProcessingCheckout(false);
          return;
        }

        if (cleanCpfCnpj.length !== 11 && cleanCpfCnpj.length !== 14) {
          setCheckoutError('O CPF deve conter 11 dígitos ou o CNPJ deve conter 14 caracteres.');
          setProcessingCheckout(false);
          return;
        }

        if (cleanCard.length < 13) {
          setCheckoutError('Número de cartão de crédito inválido.');
          setProcessingCheckout(false);
          return;
        }

        payload.creditCard = {
          holderName: cardData.holderName.trim(),
          number: cleanCard,
          expiryMonth: cardData.expiryMonth.padStart(2, '0'),
          expiryYear: cardData.expiryYear.length === 2 ? `20${cardData.expiryYear}` : cardData.expiryYear,
          ccv: cleanCvv
        };

        payload.creditCardHolderInfo = {
          name: cardData.holderName.trim(),
          email: '', // Backend automatically falls back to tenant email
          cpfCnpj: cleanCpfCnpj,
          postalCode: cardData.postalCode.replace(/\D/g, ''),
          addressNumber: cardData.addressNumber.trim(),
          phone: cardData.phone.replace(/\D/g, '')
        };
      }

      const response = await billingService.createCheckout(payload);
      setCheckoutResult(response);
      
      // Reload subscription data in background
      loadData();
    } catch (err: any) {
      setCheckoutError(err.response?.data?.message || 'Erro ao processar checkout. Verifique os dados e tente novamente.');
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleCopyPix = () => {
    if (checkoutResult?.pix?.copyPasteCode) {
      navigator.clipboard.writeText(checkoutResult.pix.copyPasteCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 3000);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);
      await billingService.cancelSubscription();
      setIsCancelModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cancelar assinatura.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setLoading(true);
      await billingService.reactivateSubscription();
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao reativar assinatura.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && !subscription) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Carregando dados de assinatura...</span>
        </div>
      </div>
    );
  }

  const isCurrentPlan = (planCode: string) => subscription?.planCode === planCode;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Assinatura & Planos
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gerencie seu plano, controle limites da sua consultoria e acompanhe pagamentos.
        </p>
      </div>

      {/* Trial / Status Alert Banner */}
      {subscription && subscription.status === 1 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                Você está no período de avaliação gratuita do Plano {subscription.planName}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Restam <strong className="text-amber-300 font-bold">{subscription.daysRemainingInTrial ?? 14} dias</strong> de acesso completo com todas as funcionalidades liberadas.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const pro = plans.find(p => p.code === 'professional') || plans[0];
              if (pro) handleOpenCheckout(pro);
            }}
            className="!bg-white !text-blue-600 hover:!bg-blue-50 font-bold shrink-0"
          >
            Efetivar Assinatura
          </Button>
        </div>
      )}

      {subscription && subscription.status === 3 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-600 dark:text-amber-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <strong className="font-bold block text-sm">Existe uma fatura pendente</strong>
              Seu acesso permanece liberado até {formatDate(subscription.gracePeriodEndsAt)}. Regularize para evitar suspensão.
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              const current = plans.find(p => p.code === subscription.planCode) || plans[0];
              if (current) handleOpenCheckout(current);
            }}
          >
            Pagar Fatura
          </Button>
        </div>
      )}

      {/* Subscription Summary & Entitlement Limits */}
      {subscription && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Subscription Card */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Plano Atual
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                subscription.status === 2 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                subscription.status === 1 ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                {subscription.statusDescription}
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {subscription.planName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ciclo: <strong>{subscription.billingCycle === 2 ? 'Anual' : 'Mensal'}</strong> • Valor: <strong>{formatCurrency(subscription.currentPrice)}/{subscription.billingCycle === 2 ? 'ano' : 'mês'}</strong>
            </p>

            {subscription.currentPeriodEnd && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Próxima renovação: <strong>{formatDate(subscription.currentPeriodEnd)}</strong>
              </p>
            )}

            {subscription.cancelledAtPeriodEnd ? (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-rose-500 mb-2 font-medium">Cancelamento programado ao fim do ciclo.</p>
                <Button variant="secondary" size="sm" onClick={handleReactivateSubscription} className="w-full">
                  Reativar Assinatura
                </Button>
              </div>
            ) : subscription.status === 2 && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="text-xs text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  Cancelar assinatura
                </button>
              </div>
            )}
          </div>

          {/* Limit: Nutritionists */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Nutricionistas na Equipe</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {subscription.currentNutritionistsCount} / {subscription.maxNutritionists}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Profissionais com login ativo e cadastro de ARTs.
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    subscription.currentNutritionistsCount >= subscription.maxNutritionists ? 'bg-rose-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, (subscription.currentNutritionistsCount / subscription.maxNutritionists) * 100)}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4">
              {subscription.maxNutritionists - subscription.currentNutritionistsCount > 0 
                ? `Você ainda pode cadastrar ${subscription.maxNutritionists - subscription.currentNutritionistsCount} nutricionista(s).` 
                : 'Limite máximo de nutricionistas atingido.'}
            </p>
          </div>

          {/* Limit: Client Companies */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  <span>Empresas Clientes</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {subscription.currentClientCompaniesCount} / {subscription.maxClientCompanies}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Contratos e estabelecimentos atendidos pela consultoria.
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    subscription.currentClientCompaniesCount >= subscription.maxClientCompanies ? 'bg-rose-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, (subscription.currentClientCompaniesCount / subscription.maxClientCompanies) * 100)}%` }}
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-4">
              {subscription.maxClientCompanies - subscription.currentClientCompaniesCount > 0 
                ? `Você ainda pode cadastrar ${subscription.maxClientCompanies - subscription.currentClientCompaniesCount} cliente(s).` 
                : 'Limite máximo de clientes atingido.'}
            </p>
          </div>
        </div>
      )}

      {/* Plan Selection Section */}
      <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Planos Comerciais PRAXIS
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Escolha o plano ideal para a escala da sua empresa de consultoria nutricional.
          </p>

          {/* Billing Cycle Switch */}
          <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mt-4 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBillingCycle(1)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                billingCycle === 1 ? 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Faturamento Mensal
            </button>
            <button
              onClick={() => setBillingCycle(2)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 2 ? 'bg-white dark:bg-[#0F172A] text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Faturamento Anual</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] rounded font-extrabold uppercase">Economize</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = isCurrentPlan(plan.code);
            const isPopular = plan.code === 'professional';
            const price = billingCycle === 2 ? plan.annualPrice / 12 : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`bg-white dark:bg-[#0F172A] rounded-2xl p-6 border flex flex-col justify-between transition-all relative ${
                  isPopular 
                    ? 'border-blue-500 shadow-xl dark:shadow-blue-500/5 ring-2 ring-blue-500/20' 
                    : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    Mais Escolhido
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full">
                        Seu Plano
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 min-h-[32px]">
                    {plan.description}
                  </p>

                  <div className="my-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    {plan.code === 'enterprise' ? (
                      <div className="text-2xl font-black text-slate-900 dark:text-white">Sob Consulta</div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-slate-900 dark:text-white">{formatCurrency(price)}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">/mês</span>
                        </div>
                        {billingCycle === 2 && (
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            Faturado anualmente: {formatCurrency(plan.annualPrice)}/ano
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Limits and features */}
                  <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                      <Users className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>Até {plan.maxNutritionists >= 999 ? 'Ilimitados' : plan.maxNutritionists} Nutricionistas</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                      <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>Até {plan.maxClientCompanies >= 999 ? 'Ilimitadas' : plan.maxClientCompanies} Empresas Clientes</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Checklists RDC 216 e Auditorias</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Laudos Técnicos em PDF</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>App Mobile em Campo</span>
                      </div>
                      {plan.code !== 'essential' && (
                        <>
                          <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                            <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>Indicadores e Gráficos Avançados</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                            <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>Exportação de Relatórios em Excel</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                            <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>Suporte Prioritário</span>
                          </div>
                        </>
                      )}
                      {plan.code === 'enterprise' && (
                        <>
                          <div className="flex items-center gap-2 font-medium text-purple-600 dark:text-purple-400">
                            <Check className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span>Onboarding e Treinamento Dedicado</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium text-purple-600 dark:text-purple-400">
                            <Check className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span>Integrações Customizadas</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  {plan.code === 'enterprise' ? (
                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full"
                      onClick={() => window.open('mailto:contato@praxisnutri.com.br?subject=PRAXIS%20Enterprise', '_blank')}
                    >
                      Falar com Consultor
                    </Button>
                  ) : isCurrent && subscription?.status === 2 ? (
                    <Button variant="secondary" size="md" disabled className="w-full opacity-60">
                      Plano Ativo
                    </Button>
                  ) : (
                    <Button
                      variant={isPopular ? 'primary' : 'secondary'}
                      size="md"
                      className="w-full"
                      onClick={() => handleOpenCheckout(plan)}
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      {subscription?.status === 1 ? 'Contratar Plano' : 'Alterar para este Plano'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Histórico de Faturas & Pagamentos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registros e comprovantes gerados pelo gateway de pagamento Asaas.
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Nenhuma cobrança registrada até o momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Valor</th>
                  <th className="py-3 px-3">Forma</th>
                  <th className="py-3 px-3">Vencimento</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {p.paymentMethod === 1 ? 'PIX' : p.paymentMethod === 2 ? 'Cartão' : 'Boleto'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {formatDate(p.dueDate)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 2 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        p.status === 1 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {p.statusDescription}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {p.invoiceUrl ? (
                        <a
                          href={p.invoiceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          <span>Fatura</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title={checkoutResult ? "Cobrança Gerada" : `Assinar ${selectedPlan?.name}`}
        subtitle={checkoutResult ? "Siga as instruções para concluir o pagamento" : "Selecione o método de pagamento para ativação imediata"}
        maxWidth="lg"
      >
        {checkoutResult ? (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-xs font-semibold">{checkoutResult.message}</span>
            </div>

            {/* If Pix */}
            {checkoutResult.pix && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                  <QrCode className="w-4 h-4" />
                  <span>PIX Instantâneo</span>
                </div>

                {checkoutResult.pix.qrCodeUrl && (
                  <div className="flex justify-center my-2">
                    <img 
                      src={`data:image/png;base64,${checkoutResult.pix.qrCodeUrl}`} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 rounded-lg border border-slate-300 dark:border-slate-600 bg-white p-2" 
                    />
                  </div>
                )}

                <div className="space-y-2 text-left">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Código PIX Copia e Cola
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={checkoutResult.pix.copyPasteCode || ''}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 select-all"
                    />
                    <Button
                      variant={copiedPix ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={handleCopyPix}
                      icon={copiedPix ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      className="shrink-0"
                    >
                      {copiedPix ? 'Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Abra o aplicativo do seu banco, escolha a opção <strong>PIX Copia e Cola</strong> ou <strong>Ler QR Code</strong> e efetue o pagamento.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  loadData();
                }}
              >
                Concluir & Atualizar Status
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Plan Info summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Plano Escolhido</span>
                <strong className="text-sm text-slate-900 dark:text-white font-bold">{selectedPlan?.name}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Valor do Ciclo ({billingCycle === 2 ? 'Anual' : 'Mensal'})</span>
                <strong className="text-sm text-blue-600 dark:text-blue-400 font-black">
                  {formatCurrency(billingCycle === 2 ? (selectedPlan?.annualPrice ?? 0) : (selectedPlan?.monthlyPrice ?? 0))}
                </strong>
              </div>
            </div>

            {checkoutError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Forma de Pagamento
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod(1)}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 1
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <div className="text-left text-xs">
                    <span className="block font-bold">PIX</span>
                    <span className="text-[10px] opacity-75">Aprovação Imediata</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod(2)}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    paymentMethod === 2
                      ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <div className="text-left text-xs">
                    <span className="block font-bold">Cartão de Crédito</span>
                    <span className="text-[10px] opacity-75">Cobrança Recorrente</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Credit Card Fields (If selected) */}
            {paymentMethod === 2 && (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nome no Cartão</label>
                  <input
                    type="text"
                    placeholder="Como impresso no cartão"
                    value={cardData.holderName}
                    onChange={(e) => setCardData({ ...cardData, holderName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mês</label>
                      <input
                        type="text"
                        placeholder="MM"
                        maxLength={2}
                        value={cardData.expiryMonth}
                        onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value.replace(/\D/g, '').substring(0, 2) })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ano</label>
                      <input
                        type="text"
                        placeholder="AAAA"
                        maxLength={4}
                        value={cardData.expiryYear}
                        onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={cardData.ccv}
                        onChange={(e) => setCardData({ ...cardData, ccv: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">CPF/CNPJ do Titular</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      maxLength={18}
                      value={cardData.cpfCnpj}
                      onChange={(e) => setCardData({ ...cardData, cpfCnpj: formatCpfCnpj(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">CEP</label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      maxLength={9}
                      value={cardData.postalCode}
                      onChange={(e) => setCardData({ ...cardData, postalCode: formatCep(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Número</label>
                    <input
                      type="text"
                      placeholder="Nº endereço"
                      value={cardData.addressNumber}
                      onChange={(e) => setCardData({ ...cardData, addressNumber: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" size="md" onClick={() => setIsCheckoutOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleExecuteCheckout}
                loading={processingCheckout}
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                {paymentMethod === 1 ? 'Gerar Cobrança PIX' : 'Confirmar & Pagar'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* CANCEL MODAL */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancelar Assinatura"
        subtitle="Confirmação de cancelamento do plano atual"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Ao cancelar, sua assinatura permanecerá ativa até o final do período já pago (<strong>{formatDate(subscription?.currentPeriodEnd)}</strong>).
          </p>
          <p>
            Após essa data, seu acesso aos módulos operacionais será bloqueado, mas seus dados permanecerão preservados por 90 dias caso decida retornar.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" size="sm" onClick={() => setIsCancelModalOpen(false)}>
              Manter Assinatura
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancelSubscription}
              loading={cancelling}
            >
              Confirmar Cancelamento
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
