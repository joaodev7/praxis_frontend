import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag,
  Plus,
  Printer,
  Ban,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  QrCode,
  SlidersHorizontal,
  FileText,
  Calendar,
  Layers,
  Thermometer
} from 'lucide-react';
import { foodLabelService } from '../services/foodLabelService';
import api from '../services/api';
import {
  FoodLabelListDto,
  FoodLabelDto,
  FoodLabelDashboardDto,
  LabelStatus
} from '../types/foodLabel';
import { Unit } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const FoodLabelsPage: React.FC = () => {
  const navigate = useNavigate();

  const [labels, setLabels] = useState<FoodLabelListDto[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [dashboard, setDashboard] = useState<FoodLabelDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyExpired, setOnlyExpired] = useState(false);
  const [onlyExpiringSoon, setOnlyExpiringSoon] = useState(false);

  // Modals & Selected Label
  const [selectedLabel, setSelectedLabel] = useState<FoodLabelDto | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showReprintModal, setShowReprintModal] = useState(false);

  // Modal form states
  const [cancelReason, setCancelReason] = useState('');
  const [discardReason, setDiscardReason] = useState('');
  const [discardQuantity, setDiscardQuantity] = useState<number>(1);
  const [discardUnit, setDiscardUnit] = useState('un');
  const [reprintCopies, setReprintCopies] = useState<number>(1);
  const [reprintTemplate, setReprintTemplate] = useState('Thermal80x50');
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    loadUnits();
    loadDashboard();
    loadLabels();
  }, [selectedUnitId, selectedStatus, onlyExpired, onlyExpiringSoon]);

  const loadUnits = async () => {
    try {
      const res = await api.get<Unit[]>('/units');
      setUnits(res.data);
    } catch (err) {
      console.error('Erro ao carregar unidades:', err);
    }
  };

  const loadDashboard = async () => {
    try {
      const stats = await foodLabelService.getDashboardStats(selectedUnitId || undefined);
      setDashboard(stats);
    } catch (err) {
      console.error('Erro ao carregar dashboard de etiquetas:', err);
    }
  };

  const loadLabels = async () => {
    setLoading(true);
    try {
      const data = await foodLabelService.getLabels({
        unitId: selectedUnitId || undefined,
        status: selectedStatus || undefined,
        batchCode: searchQuery || undefined,
        onlyExpired: onlyExpired || undefined,
        onlyExpiringSoon: onlyExpiringSoon || undefined,
      });
      setLabels(data);
    } catch (err) {
      console.error('Erro ao carregar etiquetas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLabels();
  };

  const handleOpenDetail = async (id: string) => {
    try {
      const label = await foodLabelService.getLabelById(id);
      setSelectedLabel(label);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Erro ao carregar detalhes da etiqueta:', err);
    }
  };

  const handlePrintPdf = async (id: string, templateType = 'Thermal80x50', copies = 1) => {
    try {
      const blob = await foodLabelService.downloadLabelPdf(id, templateType, copies);
      const url = window.URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) {
        // Fallback para download direto caso pop-up seja bloqueado
        const a = document.createElement('a');
        a.href = url;
        a.download = `etiqueta-${id}.pdf`;
        a.click();
      }
    } catch (err) {
      alert('Erro ao gerar PDF da etiqueta para impressão.');
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedLabel) return;
    if (!cancelReason.trim()) {
      alert('Informe o motivo do cancelamento.');
      return;
    }

    setSubmittingAction(true);
    try {
      await foodLabelService.cancelLabel(selectedLabel.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      loadDashboard();
      loadLabels();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cancelar etiqueta.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleConfirmDiscard = async () => {
    if (!selectedLabel) return;
    if (!discardReason.trim()) {
      alert('Informe o motivo do descarte.');
      return;
    }

    setSubmittingAction(true);
    try {
      await foodLabelService.discardLabel(selectedLabel.id, {
        reason: discardReason,
        quantity: discardQuantity,
        unit: discardUnit,
      });
      setShowDiscardModal(false);
      setDiscardReason('');
      loadDashboard();
      loadLabels();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao registrar descarte.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleConfirmReprint = async () => {
    if (!selectedLabel) return;
    setSubmittingAction(true);
    try {
      await foodLabelService.reprintLabel(selectedLabel.id, reprintCopies, reprintTemplate);
      setShowReprintModal(false);
      handlePrintPdf(selectedLabel.id, reprintTemplate, reprintCopies);
      loadDashboard();
      loadLabels();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao registrar reimpressão.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const getStatusBadge = (status: LabelStatus, isExpired: boolean) => {
    if (status === 'Cancelled') {
      return <Badge variant="neutral">Cancelada</Badge>;
    }
    if (status === 'Discarded') {
      return <Badge variant="danger">Descartada</Badge>;
    }
    if (isExpired || status === 'Expired') {
      return <Badge variant="danger">Vencida</Badge>;
    }
    return <Badge variant="success">Ativa</Badge>;
  };

  const formatOperation = (op: string) => {
    switch (op) {
      case 'Preparation': return 'Preparo';
      case 'Opening': return 'Abertura';
      case 'Portioning': return 'Fracionamento';
      case 'Defrosting': return 'Descongelamento';
      case 'PrePreparation': return 'Pré-preparo';
      case 'Storage': return 'Armazenamento';
      default: return op;
    }
  };

  const formatStorage = (cond: string, tempMax?: number | null) => {
    let name = 'Ambiente';
    if (cond === 'Refrigerated') name = 'Refrigerado';
    if (cond === 'Frozen') name = 'Congelado';
    if (cond === 'Heated') name = 'Aquecido';
    if (tempMax !== undefined && tempMax !== null) {
      return `${name} (≤ ${tempMax}°C)`;
    }
    return name;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-8 h-8 text-[#2563EB]" />
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Etiquetagem e Gestão de Validade
            </h1>
          </div>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
            Controle rastreável de alimentos manipulados, cálculo regulatório de validade (RDC 216) e emissão de etiquetas com QR Code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/etiquetagem/regras')}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Regras de Validade
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate('/etiquetagem/nova')}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8]"
          >
            <Plus className="w-4 h-4" />
            Nova Etiqueta
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {dashboard && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card
            className={`p-4 cursor-pointer transition border-l-4 border-l-emerald-500 ${
              selectedStatus === 'Active' && !onlyExpired && !onlyExpiringSoon
                ? 'ring-2 ring-emerald-500'
                : ''
            }`}
            onClick={() => {
              setSelectedStatus('Active');
              setOnlyExpired(false);
              setOnlyExpiringSoon(false);
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Ativos</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {dashboard.totalActive}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Dentro do prazo</div>
          </Card>

          <Card
            className={`p-4 cursor-pointer transition border-l-4 border-l-amber-500 ${
              onlyExpiringSoon ? 'ring-2 ring-amber-500' : ''
            }`}
            onClick={() => {
              setOnlyExpiringSoon(!onlyExpiringSoon);
              setOnlyExpired(false);
              setSelectedStatus('Active');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Vence Hoje</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">
              {dashboard.expiresToday}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Atenção prioritária</div>
          </Card>

          <Card
            className="p-4 cursor-pointer transition border-l-4 border-l-blue-500"
            onClick={() => {
              setSelectedStatus('Active');
              setOnlyExpired(false);
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Amanhã</span>
              <Calendar className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {dashboard.expiresTomorrow}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Próximos a vencer</div>
          </Card>

          <Card
            className={`p-4 cursor-pointer transition border-l-4 border-l-rose-500 ${
              onlyExpired ? 'ring-2 ring-rose-500' : ''
            }`}
            onClick={() => {
              setOnlyExpired(!onlyExpired);
              setOnlyExpiringSoon(false);
              setSelectedStatus('');
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Vencidos</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
              {dashboard.expired}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Descarte imediato</div>
          </Card>

          <Card
            className="p-4 cursor-pointer transition border-l-4 border-l-slate-400"
            onClick={() => {
              setSelectedStatus('Cancelled');
              setOnlyExpired(false);
              setOnlyExpiringSoon(false);
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Canceladas</span>
              <Ban className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-300 mt-2">
              {dashboard.cancelled}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Auditadas</div>
          </Card>

          <Card
            className="p-4 transition border-l-4 border-l-purple-500"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">Impressões</span>
              <Printer className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {dashboard.totalPrinted}
            </div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Total emitidas</div>
          </Card>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Unidade */}
            <div className="w-full sm:w-56">
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2 text-[#0F172A] dark:text-[#F8FAFC]"
              >
                <option value="">Todas as Unidades</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="w-full sm:w-44">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setOnlyExpired(false);
                  setOnlyExpiringSoon(false);
                }}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2 text-[#0F172A] dark:text-[#F8FAFC]"
              >
                <option value="">Todos os Status</option>
                <option value="Active">Ativas</option>
                <option value="Expired">Vencidas</option>
                <option value="Cancelled">Canceladas</option>
                <option value="Discarded">Descartadas</option>
              </select>
            </div>

            {(selectedStatus || selectedUnitId || onlyExpired || onlyExpiringSoon) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedStatus('');
                  setSelectedUnitId('');
                  setOnlyExpired(false);
                  setOnlyExpiringSoon(false);
                }}
                className="text-xs"
              >
                Limpar Filtros
              </Button>
            )}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 w-full md:w-72">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Buscar por lote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>
            <Button type="submit" variant="outline" size="sm" className="p-2">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Labels List Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#64748B]">Carregando etiquetas...</div>
        ) : labels.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag className="w-12 h-12 text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Nenhuma etiqueta encontrada
            </h3>
            <p className="text-sm text-[#64748B] max-w-md mx-auto">
              Cadastre a primeira etiqueta operacional ou ajuste os filtros selecionados acima.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/etiquetagem/nova')}
              className="mt-2 bg-[#2563EB]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Criar Primeira Etiqueta
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0F172A] dark:text-[#F8FAFC]">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-xs font-semibold uppercase text-[#64748B] border-b border-[#CBD5E1] dark:border-[#334155]">
                <tr>
                  <th className="py-3 px-4">Alimento / Descrição</th>
                  <th className="py-3 px-4">Lote Interno</th>
                  <th className="py-3 px-4">Operação</th>
                  <th className="py-3 px-4">Manipulado Em</th>
                  <th className="py-3 px-4">Validade</th>
                  <th className="py-3 px-4">Conservação</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#334155]">
                {labels.map((lbl) => {
                  const expDate = new Date(lbl.effectiveExpirationDate);
                  const isExp = lbl.isExpired;
                  const isToday =
                    expDate.toDateString() === new Date().toDateString() && lbl.status === 'Active';

                  return (
                    <tr
                      key={lbl.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-4 font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        <div>{lbl.productName}</div>
                        <div className="text-[11px] font-normal text-[#64748B]">{lbl.unitName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[#2563EB] dark:text-blue-400">
                          {lbl.internalBatchCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">{formatOperation(lbl.operationType)}</td>
                      <td className="py-3 px-4 text-xs text-[#64748B]">
                        {new Date(lbl.validityStartAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`font-semibold text-xs ${
                            isExp
                              ? 'text-rose-600 dark:text-rose-400 font-bold'
                              : isToday
                              ? 'text-amber-600 dark:text-amber-400 font-bold'
                              : 'text-[#0F172A] dark:text-[#F8FAFC]'
                          }`}
                        >
                          {expDate.toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#64748B]">
                        {formatStorage(lbl.storageCondition, lbl.storageTemperatureMax)}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(lbl.status, lbl.isExpired)}</td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        {/* Imprimir Direto */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintPdf(lbl.id)}
                          title="Imprimir Etiqueta Térmica"
                          className="p-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Button>

                        {/* Detalhes & QR Code */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDetail(lbl.id)}
                          title="Visualizar QR Code e Detalhes"
                          className="p-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </Button>

                        {/* Reimprimir */}
                        {lbl.status === 'Active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLabel({ ...lbl } as any);
                              setReprintCopies(1);
                              setShowReprintModal(true);
                            }}
                            title="Reimprimir Etiqueta"
                            className="p-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        {/* Cancelar */}
                        {lbl.status === 'Active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLabel({ ...lbl } as any);
                              setShowCancelModal(true);
                            }}
                            title="Cancelar Etiqueta"
                            className="p-1.5 text-slate-500 hover:text-amber-600"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        {/* Descartar */}
                        {lbl.status === 'Active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLabel({ ...lbl } as any);
                              setShowDiscardModal(true);
                            }}
                            title="Registrar Descarte de Alimento"
                            className="p-1.5 text-slate-500 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Detalhes & QR Code */}
      <Modal
        isOpen={showDetailModal && !!selectedLabel}
        onClose={() => setShowDetailModal(false)}
        title="Detalhes da Etiqueta Operacional"
      >
        {selectedLabel && (
          <div className="space-y-4 text-sm">
            {/* Visual Sticker Mockup */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-4 rounded-xl bg-white dark:bg-slate-900 text-black dark:text-white shadow-sm">
              <div className="flex justify-between items-start border-b pb-2 border-slate-200 dark:border-slate-800">
                <div>
                  <div className="font-black text-xs text-[#2563EB]">PRAXIS • SEGURANÇA ALIMENTAR</div>
                  <div className="text-xs text-slate-500">{selectedLabel.unitName}</div>
                </div>
                <Badge variant="primary" size="sm">
                  {formatOperation(selectedLabel.operationType)}
                </Badge>
              </div>

              <div className="py-2">
                <div className="text-base font-bold uppercase">{selectedLabel.productName}</div>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  Lote: <span className="font-bold text-black dark:text-white">{selectedLabel.internalBatchCode}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg text-xs">
                <div>
                  <div className="text-slate-500">Manipulado em:</div>
                  <div className="font-semibold">
                    {new Date(selectedLabel.validityStartAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Prazo de Validade:</div>
                  <div className="font-bold text-rose-600 dark:text-rose-400">
                    {new Date(selectedLabel.effectiveExpirationDate).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-500">Conservação:</div>
                  <div className="font-semibold">
                    {formatStorage(selectedLabel.storageCondition, selectedLabel.storageTemperatureMax)}
                  </div>
                </div>
              </div>

              {/* QR Code link representation */}
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold">Token de Validação Pública:</div>
                  <div className="font-mono text-[11px] text-slate-500">{selectedLabel.publicToken}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`/public/labels/${selectedLabel.publicToken}`, '_blank')}
                  className="text-xs"
                >
                  Abrir Página Pública
                </Button>
              </div>
            </div>

            {/* Informações Técnicas */}
            <div className="space-y-1 text-xs text-[#64748B] dark:text-[#94A3B8] bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
              <div>
                <strong>Origem da Validade:</strong> {selectedLabel.validitySource}
              </div>
              {selectedLabel.validityRuleName && (
                <div>
                  <strong>Regra Aplicada:</strong> {selectedLabel.validityRuleName}
                </div>
              )}
              {selectedLabel.validityJustification && (
                <div>
                  <strong>Justificativa / Base:</strong> {selectedLabel.validityJustification}
                </div>
              )}
              <div>
                <strong>Responsável pelo Registro:</strong> {selectedLabel.createdByUserName}
              </div>
              <div>
                <strong>Histórico de Impressões:</strong> {selectedLabel.printCount} cópia(s)
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Fechar
              </Button>
              <Button
                variant="primary"
                onClick={() => handlePrintPdf(selectedLabel.id, 'Thermal80x50')}
                className="bg-[#2563EB] flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Imprimir 80x50 mm
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Cancelamento */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancelar Etiqueta"
      >
        <div className="space-y-4 text-sm">
          <p className="text-[#64748B]">
            O cancelamento invalida a etiqueta e registra a ocorrência para auditoria. Uma etiqueta cancelada não é excluída do histórico.
          </p>
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
              Motivo do Cancelamento *
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex.: Alimento preparado com erro de pesagem, etiqueta impressa em duplicidade..."
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2 text-[#0F172A] dark:text-[#F8FAFC]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Voltar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmCancel}
              disabled={submittingAction}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {submittingAction ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Descarte */}
      <Modal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        title="Registrar Descarte de Alimento"
      >
        <div className="space-y-4 text-sm">
          <p className="text-[#64748B]">
            O registro de descarte alimenta as métricas de desperdício da consultoria e assegura que o alimento vencido foi retirado de circulação.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                Quantidade Descartada
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={discardQuantity}
                onChange={(e) => setDiscardQuantity(parseFloat(e.target.value))}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                Unidade de Medida
              </label>
              <select
                value={discardUnit}
                onChange={(e) => setDiscardUnit(e.target.value)}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              >
                <option value="kg">kg (Quilogramas)</option>
                <option value="g">g (Gramas)</option>
                <option value="L">L (Litros)</option>
                <option value="un">un (Unidades)</option>
                <option value="porcao">Porções</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
              Motivo do Descarte *
            </label>
            <textarea
              rows={3}
              value={discardReason}
              onChange={(e) => setDiscardReason(e.target.value)}
              placeholder="Ex.: Prazo de validade expirado, contaminação acidental, alteração sensorial..."
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowDiscardModal(false)}>
              Voltar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmDiscard}
              disabled={submittingAction}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {submittingAction ? 'Registrando...' : 'Confirmar Descarte'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Reimpressão */}
      <Modal
        isOpen={showReprintModal}
        onClose={() => setShowReprintModal(false)}
        title="Reimprimir Etiqueta"
      >
        <div className="space-y-4 text-sm">
          <p className="text-[#64748B]">
            A reimpressão gera novas vias da mesma etiqueta sem alterar o lote interno ou criar duplicatas no banco.
          </p>

          <div>
            <label className="block text-xs font-semibold mb-1">Formato da Etiqueta</label>
            <select
              value={reprintTemplate}
              onChange={(e) => setReprintTemplate(e.target.value)}
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
            >
              <option value="Thermal80x50">Térmica 80x50 mm (Padrão com QR Code)</option>
              <option value="Thermal50x30">Térmica 50x30 mm (Compacta)</option>
              <option value="SheetA4">Folha A4 (Grade de Etiquetas)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Quantidade de Cópias</label>
            <input
              type="number"
              min="1"
              max="50"
              value={reprintCopies}
              onChange={(e) => setReprintCopies(parseInt(e.target.value) || 1)}
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowReprintModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmReprint}
              disabled={submittingAction}
              className="bg-[#2563EB] flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              {submittingAction ? 'Processando...' : 'Reimprimir Agora'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
