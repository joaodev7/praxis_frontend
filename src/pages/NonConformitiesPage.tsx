import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { actionPlanService, ActionPlanFilterParams } from '../services/actionPlanService';
import {
  NonConformity,
  ActionPlan,
  ActionPlanStatus,
  ActionPlanPriority,
  ActionPlanDashboardMetrics,
  ActionPlanEvidence
} from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Camera,
  Play,
  CheckCircle,
  RotateCcw,
  Ban,
  FileText,
  DollarSign,
  MapPin,
  HelpCircle,
  User as UserIcon,
  Calendar,
  Eye,
  Trash2,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const NonConformitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'actionPlans' | 'nonConformities'>('actionPlans');

  // Action Plans Data
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [dashboard, setDashboard] = useState<ActionPlanDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Non-Conformities Data
  const [ncItems, setNcItems] = useState<NonConformity[]>([]);
  const [ncStatusFilter, setNcStatusFilter] = useState<string>('');
  const [ncSeverityFilter, setNcSeverityFilter] = useState<string>('');

  // Expanded cards
  const [expandedPlanIds, setExpandedPlanIds] = useState<Record<string, boolean>>({});

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedNcForPlan, setSelectedNcForPlan] = useState<NonConformity | null>(null);

  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [selectedPlanForEvidence, setSelectedPlanForEvidence] = useState<ActionPlan | null>(null);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [viewEvidenceModalOpen, setViewEvidenceModalOpen] = useState(false);
  const [selectedEvidenceUrl, setSelectedEvidenceUrl] = useState<string | null>(null);

  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [selectedPlanForValidation, setSelectedPlanForValidation] = useState<ActionPlan | null>(null);
  const [validationApproved, setValidationApproved] = useState(true);
  const [validationComment, setValidationComment] = useState('');

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedPlanForCancel, setSelectedPlanForCancel] = useState<ActionPlan | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Form State for Creating Action Plan
  const [formNcId, setFormNcId] = useState('');
  const [formWhat, setFormWhat] = useState('');
  const [formWhy, setFormWhy] = useState('');
  const [formWho, setFormWho] = useState('');
  const [formWhen, setFormWhen] = useState('');
  const [formWhere, setFormWhere] = useState('');
  const [formHow, setFormHow] = useState('');
  const [formHowMuch, setFormHowMuch] = useState('');
  const [formPriority, setFormPriority] = useState<ActionPlanPriority>('Media');
  const [submittingPlan, setSubmittingPlan] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadNonConformities();
  }, [ncStatusFilter, ncSeverityFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: ActionPlanFilterParams = {};
      if (statusFilter === 'Atrasada') {
        params.isLate = true;
      } else if (statusFilter) {
        params.status = statusFilter as ActionPlanStatus;
      }
      if (priorityFilter) {
        params.priority = priorityFilter as ActionPlanPriority;
      }

      const [plansData, dashboardData] = await Promise.all([
        actionPlanService.getAll(params),
        actionPlanService.getDashboard()
      ]);

      setActionPlans(plansData);
      setDashboard(dashboardData);
    } catch (err) {
      console.error('Erro ao carregar planos de ação:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadNonConformities = async () => {
    try {
      let url = '/non-conformities?';
      if (ncStatusFilter) url += `status=${ncStatusFilter}&`;
      if (ncSeverityFilter) url += `severity=${ncSeverityFilter}&`;
      const { data } = await api.get(url);
      setNcItems(data);
    } catch (err) {
      console.error('Erro ao carregar não conformidades', err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedPlanIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartExecution = async (plan: ActionPlan) => {
    try {
      await actionPlanService.changeStatus(plan.id, 'EmAndamento');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao iniciar execução do plano.');
    }
  };

  const handleRequestValidation = async (plan: ActionPlan) => {
    try {
      await actionPlanService.changeStatus(plan.id, 'AguardandoValidacao');
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao solicitar validação.');
    }
  };

  const openValidationModal = (plan: ActionPlan, approve: boolean) => {
    setSelectedPlanForValidation(plan);
    setValidationApproved(approve);
    setValidationComment('');
    setValidateModalOpen(true);
  };

  const handleConfirmValidation = async () => {
    if (!selectedPlanForValidation) return;
    if (!validationApproved && !validationComment.trim()) {
      alert('Para reabrir o plano, é obrigatório preencher a justificativa.');
      return;
    }

    try {
      await actionPlanService.validate(
        selectedPlanForValidation.id,
        validationApproved,
        validationComment
      );
      setValidateModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao validar plano.');
    }
  };

  const openCancelModal = (plan: ActionPlan) => {
    setSelectedPlanForCancel(plan);
    setCancellationReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedPlanForCancel) return;
    if (!cancellationReason.trim()) {
      alert('Informe o motivo do cancelamento.');
      return;
    }

    try {
      await actionPlanService.cancel(selectedPlanForCancel.id, cancellationReason);
      setCancelModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cancelar plano.');
    }
  };

  const openCreateModal = (nc?: NonConformity) => {
    if (nc) {
      setSelectedNcForPlan(nc);
      setFormNcId(nc.id);
      setFormWhat(nc.correctiveAction || `Ação para desvio: ${nc.description}`);
      setFormWhen(nc.dueDate ? nc.dueDate.split('T')[0] : '');
    } else {
      setSelectedNcForPlan(null);
      setFormNcId(ncItems.length > 0 ? ncItems[0].id : '');
      setFormWhat('');
      setFormWhen('');
    }
    setFormWhy('');
    setFormWho('');
    setFormWhere('');
    setFormHow('');
    setFormHowMuch('');
    setFormPriority('Media');
    setCreateModalOpen(true);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNcId) {
      alert('Selecione uma Não Conformidade de origem.');
      return;
    }
    if (!formWhat.trim()) {
      alert('Preencha o campo O que será feito (What).');
      return;
    }
    if (!formWhen) {
      alert('Informe a data limite (When).');
      return;
    }

    setSubmittingPlan(true);
    try {
      await actionPlanService.create({
        nonConformityId: formNcId,
        what: formWhat,
        why: formWhy || undefined,
        responsibleName: formWho || undefined,
        dueDate: new Date(formWhen).toISOString(),
        where: formWhere || undefined,
        how: formHow || undefined,
        howMuch: formHowMuch ? parseFloat(formHowMuch) : undefined,
        priority: formPriority
      });

      setCreateModalOpen(false);
      loadData();
      loadNonConformities();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao criar plano de ação.');
    } finally {
      setSubmittingPlan(false);
    }
  };

  const openEvidenceModal = (plan: ActionPlan) => {
    setSelectedPlanForEvidence(plan);
    setSelectedFile(null);
    setFilePreview(null);
    setEvidenceModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleUploadEvidence = async () => {
    if (!selectedPlanForEvidence || !selectedFile) return;

    setUploadingEvidence(true);
    try {
      await actionPlanService.uploadEvidence(selectedPlanForEvidence.id, selectedFile);
      setEvidenceModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao enviar evidência.');
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleDeleteEvidence = async (planId: string, evidenceId: string) => {
    if (!confirm('Deseja realmente remover esta evidência?')) return;
    try {
      await actionPlanService.deleteEvidence(planId, evidenceId);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao remover evidência.');
    }
  };

  // Filtered action plans by search text
  const filteredActionPlans = actionPlans.filter((plan) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      (plan.what && plan.what.toLowerCase().includes(term)) ||
      (plan.description && plan.description.toLowerCase().includes(term)) ||
      (plan.responsibleName && plan.responsibleName.toLowerCase().includes(term)) ||
      (plan.unitName && plan.unitName.toLowerCase().includes(term)) ||
      (plan.clientCompanyName && plan.clientCompanyName.toLowerCase().includes(term))
    );
  });

  const getPriorityBadgeVariant = (priority: ActionPlanPriority) => {
    switch (priority) {
      case 'Critica':
        return 'danger';
      case 'Alta':
        return 'danger';
      case 'Media':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getStatusBadgeVariant = (status: ActionPlanStatus) => {
    switch (status) {
      case 'Concluida':
        return 'success';
      case 'EmAndamento':
        return 'primary';
      case 'AguardandoValidacao':
        return 'warning';
      case 'Cancelada':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: ActionPlanStatus) => {
    switch (status) {
      case 'Pendente':
        return 'Pendente';
      case 'EmAndamento':
        return 'Em Andamento';
      case 'AguardandoValidacao':
        return 'Aguardando Validação';
      case 'Concluida':
        return 'Concluída';
      case 'Cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Não Conformidades & Planos de Ação (5W2H)
          </h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Rastreabilidade completa: Auditoria → Desvio → Ação 5W2H → Execução → Evidências (R2) → Validação.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => openCreateModal()}
          >
            Novo Plano de Ação
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#CBD5E1] dark:border-[#334155] gap-4">
        <button
          onClick={() => setActiveTab('actionPlans')}
          className={`pb-3 font-semibold text-sm transition-colors relative cursor-pointer ${
            activeTab === 'actionPlans'
              ? 'text-[#2563EB] dark:text-[#3B82F6]'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          Planos de Ação 5W2H ({actionPlans.length})
          {activeTab === 'actionPlans' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] dark:bg-[#3B82F6]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('nonConformities')}
          className={`pb-3 font-semibold text-sm transition-colors relative cursor-pointer ${
            activeTab === 'nonConformities'
              ? 'text-[#2563EB] dark:text-[#3B82F6]'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          Não Conformidades Registradas ({ncItems.length})
          {activeTab === 'nonConformities' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] dark:bg-[#3B82F6]" />
          )}
        </button>
      </div>

      {/* Action Plans Tab */}
      {activeTab === 'actionPlans' && (
        <div className="space-y-6">
          {/* Dashboard KPI Cards */}
          {dashboard && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <Card className="!p-3.5 border-l-4 border-l-blue-500">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase">Total Ações</span>
                <p className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">{dashboard.totalActions}</p>
              </Card>

              <Card className="!p-3.5 border-l-4 border-l-slate-400">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase">Pendentes</span>
                <p className="text-2xl font-bold text-slate-600 dark:text-slate-300 mt-1">{dashboard.pendingActions}</p>
              </Card>

              <Card className="!p-3.5 border-l-4 border-l-amber-500">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase">Em Andamento</span>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{dashboard.inProgressActions}</p>
              </Card>

              <Card className="!p-3.5 border-l-4 border-l-purple-500">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase">Aguardando Validação</span>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{dashboard.waitingValidationActions}</p>
              </Card>

              <Card className="!p-3.5 border-l-4 border-l-emerald-500">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase">Concluídas</span>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{dashboard.completedActions}</p>
              </Card>

              <Card className="!p-3.5 border-l-4 border-l-rose-500 bg-rose-50/20 dark:bg-rose-950/20">
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase">Atrasadas</span>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{dashboard.lateActions}</p>
              </Card>
            </div>
          )}

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F8FAFC] dark:bg-[#1E293B] p-3 rounded-lg border border-[#CBD5E1] dark:border-[#334155]">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B] dark:text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Buscar por ação, responsável, local..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] rounded-md text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-[#CBD5E1] dark:border-[#334155] rounded-md px-3 py-1.5 text-xs bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="">Todos os Status</option>
                <option value="Pendente">Pendentes</option>
                <option value="EmAndamento">Em Andamento</option>
                <option value="AguardandoValidacao">Aguardando Validação</option>
                <option value="Concluida">Concluídas</option>
                <option value="Atrasada">Atrasadas</option>
                <option value="Cancelada">Canceladas</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-[#CBD5E1] dark:border-[#334155] rounded-md px-3 py-1.5 text-xs bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="">Todas as Prioridades</option>
                <option value="Baixa">Baixa</option>
                <option value="Media">Média</option>
                <option value="Alta">Alta</option>
                <option value="Critica">Crítica</option>
              </select>
            </div>
          </div>

          {/* Action Plans List */}
          {loading ? (
            <div className="py-12 text-center text-[#64748B] dark:text-[#94A3B8]">Carregando planos de ação...</div>
          ) : filteredActionPlans.length === 0 ? (
            <div className="py-12 text-center bg-[#F8FAFC] dark:bg-[#1E293B] rounded-lg border border-dashed border-[#CBD5E1] dark:border-[#334155]">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">Nenhum plano de ação encontrado.</p>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                Utilize os filtros acima ou crie um novo plano de ação vinculado a uma não conformidade.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActionPlans.map((plan) => {
                const planId = plan.id;
                const isExpanded = !!expandedPlanIds[planId];

                return (
                  <Card
                    key={planId}
                    className={`!p-5 transition-all ${
                      plan.status === 'Concluida'
                        ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/5 dark:bg-emerald-950/10'
                        : plan.isLate
                        ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/15 dark:bg-rose-950/15'
                        : ''
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant={getPriorityBadgeVariant(plan.priority)} size="sm">
                            Prioridade {plan.priority}
                          </Badge>

                          <Badge variant={getStatusBadgeVariant(plan.status)} size="sm">
                            {getStatusLabel(plan.status)}
                          </Badge>

                          {plan.isLate && (
                            <Badge variant="danger" size="sm">
                              <Clock className="w-3 h-3 inline mr-1" /> Atrasada
                            </Badge>
                          )}

                          {plan.evidences && plan.evidences.length > 0 && (
                            <Badge variant="primary" size="sm">
                              <Camera className="w-3 h-3 inline mr-1" /> {plan.evidences.length} Evidência(s)
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
                          {plan.what || plan.description}
                        </h3>

                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                          Estabelecimento: <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{plan.unitName}</span>{' '}
                          {plan.clientCompanyName && `(${plan.clientCompanyName})`}
                        </p>

                        <div className="mt-2 text-xs text-[#475569] dark:text-[#94A3B8] flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                            Responsável: <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{plan.responsibleName || 'Não atribuído'}</span>
                          </span>

                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            Prazo:{' '}
                            <span className={`font-medium ${plan.isLate ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-[#0F172A] dark:text-[#F8FAFC]'}`}>
                              {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo'}
                            </span>
                          </span>

                          {plan.howMuch != null && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                              Custo Estimado: <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">R$ {plan.howMuch.toFixed(2)}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        {plan.status === 'Pendente' && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Play className="w-3.5 h-3.5" />}
                            onClick={() => handleStartExecution(plan)}
                          >
                            Iniciar Execução
                          </Button>
                        )}

                        {plan.status === 'EmAndamento' && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<Camera className="w-3.5 h-3.5" />}
                              onClick={() => openEvidenceModal(plan)}
                            >
                              Anexar Foto
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<CheckCircle className="w-3.5 h-3.5" />}
                              onClick={() => handleRequestValidation(plan)}
                            >
                              Solicitar Validação
                            </Button>
                          </>
                        )}

                        {plan.status === 'AguardandoValidacao' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              onClick={() => openValidationModal(plan, true)}
                            >
                              Validar Correção
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<RotateCcw className="w-3.5 h-3.5" />}
                              onClick={() => openValidationModal(plan, false)}
                            >
                              Reabrir Ação
                            </Button>
                          </>
                        )}

                        {plan.status !== 'Concluida' && plan.status !== 'Cancelada' && (
                          <button
                            onClick={() => openCancelModal(plan)}
                            title="Cancelar plano de ação"
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => toggleExpand(planId)}
                          className="flex items-center gap-1 text-xs text-[#2563EB] dark:text-[#3B82F6] hover:underline px-2 py-1"
                        >
                          {isExpanded ? (
                            <>
                              Ocultar 5W2H <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Ver 5W2H <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Non-Conformity Context Box */}
                    {plan.nonConformityDescription && (
                      <div className="mt-3 p-2.5 bg-amber-50/30 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-md text-xs flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-900 dark:text-amber-300">Desvio Identificado na Auditoria: </span>
                          <span className="text-amber-800 dark:text-amber-200">{plan.nonConformityDescription}</span>
                        </div>
                      </div>
                    )}

                    {/* Expandable 5W2H Details & Evidences */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#334155] space-y-4 text-xs animate-in fade-in duration-200">
                        {/* 5W2H Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-[#F8FAFC] dark:bg-[#0F172A] p-3 rounded-lg border border-[#CBD5E1] dark:border-[#334155]">
                          <div>
                            <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">What (O que)</span>
                            <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">{plan.what || '-'}</p>
                          </div>

                          <div>
                            <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">Why (Por quê)</span>
                            <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">{plan.why || 'Não especificado'}</p>
                          </div>

                          <div>
                            <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">Who (Quem)</span>
                            <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">{plan.responsibleName || 'Não definido'}</p>
                          </div>

                          <div>
                            <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">When (Quando / Prazo)</span>
                            <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">
                              {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString('pt-BR') : '-'}
                            </p>
                          </div>

                          <div>
                            <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">Where (Onde)</span>
                            <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">{plan.where || 'Não especificado'}</p>
                          </div>

                          <div>
                            <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">How (Como)</span>
                            <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">{plan.how || 'Não especificado'}</p>
                          </div>

                          {plan.howMuch != null && (
                            <div>
                              <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">How Much (Quanto / Custo)</span>
                              <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">R$ {plan.howMuch.toFixed(2)}</p>
                            </div>
                          )}

                          {plan.startedAt && (
                            <div>
                              <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">Iniciado em</span>
                              <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">
                                {new Date(plan.startedAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          )}

                          {plan.completedAt && (
                            <div>
                              <span className="font-bold text-[#64748B] dark:text-[#94A3B8] uppercase text-[10px]">Executado em</span>
                              <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">
                                {new Date(plan.completedAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          )}

                          {plan.validatedAt && (
                            <div>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Validado por / em</span>
                              <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">
                                {plan.validatedByUserName || 'Nutricionista RT'} em {new Date(plan.validatedAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Validation or Cancellation Comments */}
                        {plan.validationComment && (
                          <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-md">
                            <span className="font-bold text-blue-900 dark:text-blue-300">Parecer do RT / Validação: </span>
                            <span className="text-blue-800 dark:text-blue-200">{plan.validationComment}</span>
                          </div>
                        )}

                        {plan.cancellationReason && (
                          <div className="p-3 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-md">
                            <span className="font-bold text-rose-900 dark:text-rose-300">Justificativa de Cancelamento: </span>
                            <span className="text-rose-800 dark:text-rose-200">{plan.cancellationReason}</span>
                          </div>
                        )}

                        {/* Evidences Section */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5 text-blue-500" /> Evidências Fotográficas de Correção (Cloudflare R2)
                            </h4>
                            {plan.status !== 'Concluida' && plan.status !== 'Cancelada' && (
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={<UploadCloud className="w-3.5 h-3.5" />}
                                onClick={() => openEvidenceModal(plan)}
                              >
                                Anexar Foto
                              </Button>
                            )}
                          </div>

                          {!plan.evidences || plan.evidences.length === 0 ? (
                            <p className="text-xs text-[#94A3B8] italic">Nenhuma evidência anexada ainda.</p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                              {plan.evidences.map((ev) => (
                                <div
                                  key={ev.id}
                                  className="group relative border border-[#CBD5E1] dark:border-[#334155] rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800"
                                >
                                  {ev.contentType.startsWith('image/') ? (
                                    <img
                                      src={ev.fileUrl}
                                      alt={ev.fileName}
                                      className="w-full h-24 object-cover cursor-pointer transition-transform group-hover:scale-105"
                                      onClick={() => {
                                        setSelectedEvidenceUrl(ev.fileUrl);
                                        setViewEvidenceModalOpen(true);
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className="w-full h-24 flex flex-col items-center justify-center p-2 text-center cursor-pointer"
                                      onClick={() => window.open(ev.fileUrl, '_blank')}
                                    >
                                      <FileText className="w-8 h-8 text-blue-500 mb-1" />
                                      <span className="text-[10px] truncate max-w-full">{ev.fileName}</span>
                                    </div>
                                  )}

                                  <div className="p-1.5 bg-white dark:bg-[#0F172A] text-[10px] border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
                                    <span className="truncate max-w-[80px]" title={ev.fileName}>
                                      {ev.fileName}
                                    </span>
                                    {plan.status !== 'Concluida' && (
                                      <button
                                        onClick={() => handleDeleteEvidence(planId, ev.id)}
                                        className="text-slate-400 hover:text-rose-500"
                                        title="Remover evidência"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Non-Conformities Tab */}
      {activeTab === 'nonConformities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-[#F8FAFC] dark:bg-[#1E293B] p-3 rounded-lg border border-[#CBD5E1] dark:border-[#334155]">
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Desvios registrados diretamente no checklist das visitas técnicas.
            </span>

            <div className="flex items-center gap-2">
              <select
                value={ncStatusFilter}
                onChange={(e) => setNcStatusFilter(e.target.value)}
                className="border border-[#CBD5E1] dark:border-[#334155] rounded-md px-3 py-1.5 text-xs bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="">Todos os Status</option>
                <option value="Aberta">Abertas</option>
                <option value="EmAndamento">Em Andamento</option>
                <option value="Resolvida">Resolvidas</option>
              </select>

              <select
                value={ncSeverityFilter}
                onChange={(e) => setNcSeverityFilter(e.target.value)}
                className="border border-[#CBD5E1] dark:border-[#334155] rounded-md px-3 py-1.5 text-xs bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="">Todas as Gravidades</option>
                <option value="Baixa">Baixa</option>
                <option value="Media">Média</option>
                <option value="Alta">Alta</option>
                <option value="Critica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {ncItems.map((nc) => (
              <Card
                key={nc.id}
                className={`!p-5 ${
                  nc.status === 'Resolvida'
                    ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/10 dark:bg-emerald-950/20'
                    : nc.isLate
                    ? 'border-rose-300 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20'
                    : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <Badge variant="neutral" size="sm">
                        {nc.category}
                      </Badge>
                      <Badge
                        variant={nc.severity === 'Critica' || nc.severity === 'Alta' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        Gravidade {nc.severity}
                      </Badge>
                      {nc.isLate && (
                        <Badge variant="danger" size="sm">
                          <Clock className="w-3 h-3 inline mr-1" /> Atrasada
                        </Badge>
                      )}
                      <Badge variant={nc.status === 'Resolvida' ? 'success' : 'neutral'} size="sm">
                        {nc.status}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base mt-1">{nc.description}</h3>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Estabelecimento: <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{nc.unitName}</span>{' '}
                      ({nc.clientCompanyName})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Plus className="w-4 h-4" />}
                      onClick={() => openCreateModal(nc)}
                    >
                      Criar Plano de Ação
                    </Button>
                  </div>
                </div>

                {nc.correctiveAction && (
                  <div className="mt-4 p-3 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-sm text-xs">
                    <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Ação Corretiva Recomendada: </span>
                    <span className="text-[#334155] dark:text-[#94A3B8]">{nc.correctiveAction}</span>
                    {nc.dueDate && (
                      <p className="text-[#64748B] dark:text-slate-400 mt-1 font-mono text-[11px]">
                        Prazo: {new Date(nc.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Criar Plano de Ação 5W2H */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Criar Plano de Ação (5W2H)"
        subtitle="Defina o planejamento corretivo para a não conformidade identificada."
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              Não Conformidade de Origem *
            </label>
            <select
              value={formNcId}
              onChange={(e) => setFormNcId(e.target.value)}
              className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              required
            >
              <option value="">Selecione a não conformidade...</option>
              {ncItems.map((nc) => (
                <option key={nc.id} value={nc.id}>
                  [{nc.category}] {nc.description} - {nc.unitName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                O que será feito (What) *
              </label>
              <input
                type="text"
                placeholder="Ex: Realizar sanitização completa das bancadas com solução clorada"
                value={formWhat}
                onChange={(e) => setFormWhat(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Por que será feito (Why)
              </label>
              <input
                type="text"
                placeholder="Ex: Eliminar risco de contaminação microbiológica"
                value={formWhy}
                onChange={(e) => setFormWhy(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Quem será responsável (Who)
              </label>
              <input
                type="text"
                placeholder="Ex: Chefe de Cozinha / João Silva"
                value={formWho}
                onChange={(e) => setFormWho(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Quando deverá ser concluído (When) *
              </label>
              <input
                type="date"
                value={formWhen}
                onChange={(e) => setFormWhen(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Onde será executado (Where)
              </label>
              <input
                type="text"
                placeholder="Ex: Área de manipulação de carnes"
                value={formWhere}
                onChange={(e) => setFormWhere(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Como será executado (How)
              </label>
              <input
                type="text"
                placeholder="Ex: Seguir POP 03 de higienização de superfícies"
                value={formHow}
                onChange={(e) => setFormHow(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Custo estimado em R$ (How Much)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 150.00"
                value={formHowMuch}
                onChange={(e) => setFormHowMuch(e.target.value)}
                className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">Prioridade</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as ActionPlanPriority)}
                className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
              >
                <option value="Baixa">Baixa</option>
                <option value="Media">Média</option>
                <option value="Alta">Alta</option>
                <option value="Critica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0] dark:border-[#334155]">
            <Button variant="secondary" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={submittingPlan}>
              Salvar Plano de Ação
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Anexar Evidência (Cloudflare R2) */}
      <Modal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        title="Anexar Evidência da Correção (Cloudflare R2)"
        subtitle="Envie uma foto ou comprovante que ateste a execução do plano de ação."
        maxWidth="md"
      >
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#CBD5E1] dark:border-[#334155] hover:border-[#2563EB] rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#F8FAFC] dark:bg-[#1E293B]"
          >
            {filePreview ? (
              <div className="space-y-2">
                <img src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded-md object-contain" />
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Clique para selecionar outro arquivo</p>
              </div>
            ) : selectedFile ? (
              <div className="space-y-1">
                <FileText className="w-10 h-10 text-blue-500 mx-auto" />
                <p className="text-sm font-semibold">{selectedFile.name}</p>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="space-y-1">
                <UploadCloud className="w-10 h-10 text-[#64748B] dark:text-[#94A3B8] mx-auto" />
                <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  Clique para selecionar uma foto ou arquivo
                </p>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Formatos aceitos: JPG, PNG, WEBP, PDF (Máx. 10MB)
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEvidenceModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              disabled={!selectedFile}
              loading={uploadingEvidence}
              onClick={handleUploadEvidence}
            >
              Confirmar Envio
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Visualizar Evidência em Tela Cheia */}
      <Modal
        isOpen={viewEvidenceModalOpen}
        onClose={() => setViewEvidenceModalOpen(false)}
        title="Visualização da Evidência"
        maxWidth="lg"
      >
        <div className="flex justify-center p-2">
          {selectedEvidenceUrl && (
            <img src={selectedEvidenceUrl} alt="Evidência" className="max-h-[70vh] rounded-md object-contain" />
          )}
        </div>
      </Modal>

      {/* Modal: Validar ou Reabrir Plano */}
      <Modal
        isOpen={validateModalOpen}
        onClose={() => setValidateModalOpen(false)}
        title={validationApproved ? 'Validar e Concluir Correção' : 'Reprovar e Reabrir Plano de Ação'}
        subtitle={
          validationApproved
            ? 'Atestar que a ação corretiva foi executada com eficácia e conformidade técnica.'
            : 'Informar o motivo pelo qual a ação não foi aceita e retornar para execução.'
        }
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              {validationApproved ? 'Parecer Técnico / Observações (Opcional)' : 'Justificativa da Reprovação *'}
            </label>
            <textarea
              rows={3}
              value={validationComment}
              onChange={(e) => setValidationComment(e.target.value)}
              placeholder={
                validationApproved
                  ? 'Ex: Correção validada com sucesso via evidência fotográfica.'
                  : 'Ex: A área indicada ainda apresenta resíduos. Necessário refazer a higienização.'
              }
              className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setValidateModalOpen(false)}>
              Voltar
            </Button>
            <Button
              variant={validationApproved ? 'primary' : 'danger'}
              onClick={handleConfirmValidation}
            >
              {validationApproved ? 'Concluir Validação' : 'Confirmar Reabertura'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Cancelar Plano */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancelar Plano de Ação"
        subtitle="Informe a justificativa para o cancelamento deste plano de ação."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              Motivo do Cancelamento *
            </label>
            <textarea
              rows={3}
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Ex: Equipamento avariado foi substituído por outro fornecedor."
              className="w-full text-xs p-2 rounded-md border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>
              Voltar
            </Button>
            <Button variant="danger" onClick={handleConfirmCancel}>
              Confirmar Cancelamento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};