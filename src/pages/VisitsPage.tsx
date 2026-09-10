import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Visit, Unit, Nutritionist, Checklist } from '../types';
import { CalendarDays, Plus, Download, FileText, CheckCircle2, Clock, Eye, CalendarX, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const VisitsPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cancel & Delete Modals State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Form
  const [unitId, setUnitId] = useState('');
  const [nutritionistId, setNutritionistId] = useState('');
  const [checklistId, setChecklistId] = useState('');
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resVisits, resUnits, resNutris, resChecklists] = await Promise.all([
        api.get('/visits'),
        api.get('/units'),
        api.get('/nutritionists'),
        api.get('/checklists')
      ]);
      setVisits(resVisits.data);
      setUnits(resUnits.data);
      setNutritionists(resNutris.data);
      setChecklists(resChecklists.data);
    } catch (err) {
      console.error('Erro ao carregar visitas', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/visits', {
        unitId,
        nutritionistId,
        checklistId: checklistId || null,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes
      });
      setShowModal(false);
      loadData();
      setNotes('');
    } catch (err) {
      alert('Erro ao agendar visita.');
    }
  };

  const handleDownloadPdf = async (visitId: string, unitName: string) => {
    try {
      const response = await api.get(`/visits/${visitId}/report`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-visita-${unitName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erro ao gerar relatório PDF da visita.');
    }
  };

  const handleOpenCancel = (visit: Visit) => {
    setSelectedVisit(visit);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;
    setActionLoading(true);
    try {
      await api.post(`/visits/${selectedVisit.id}/cancel`, { reason: cancelReason || null });
      setShowCancelModal(false);
      setSelectedVisit(null);
      await loadData();
    } catch (err) {
      alert('Erro ao desmarcar visita.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDelete = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVisit) return;
    setActionLoading(true);
    try {
      await api.delete(`/visits/${selectedVisit.id}`);
      setShowDeleteModal(false);
      setSelectedVisit(null);
      await loadData();
    } catch (err) {
      alert('Erro ao excluir visita.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Visitas Técnicas & Auditorias</h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Acompanhe as auditorias em campo e gere relatórios técnicos em PDF.</p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Agendar Visita
        </Button>
      </div>

      <div className="bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] rounded-md overflow-hidden shadow-subtle dark:shadow-dark-subtle transition-colors">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#CBD5E1] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] font-bold text-[11px] uppercase tracking-wider">
              <th className="p-4">Estabelecimento / Unidade</th>
              <th className="p-4">Nutricionista</th>
              <th className="p-4">Data / Horário</th>
              <th className="p-4">Status</th>
              <th className="p-4">Conformidade</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#334155]">
            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{visit.unitName}</p>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{visit.clientCompanyName}</p>
                </td>
                <td className="p-4 text-[#334155] dark:text-[#94A3B8] font-medium">
                  {visit.nutritionistName}
                </td>
                <td className="p-4 text-xs text-[#475569] dark:text-slate-400">
                  {new Date(visit.scheduledAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="p-4">
                  <Badge
                    variant={
                      visit.status === 'Finished'
                        ? 'success'
                        : visit.status === 'InProgress'
                        ? 'info'
                        : visit.status === 'Cancelled'
                        ? 'danger'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {visit.status === 'Finished'
                      ? 'Finalizada'
                      : visit.status === 'InProgress'
                      ? 'Em Andamento'
                      : visit.status === 'Cancelled'
                      ? 'Desmarcada'
                      : 'Agendada'}
                  </Badge>
                </td>
                <td className="p-4">
                  {visit.complianceRate !== undefined && visit.complianceRate !== null ? (
                    <Badge variant={visit.complianceRate >= 80 ? 'success' : 'danger'} size="sm">
                      {visit.complianceRate}% ({visit.conformingCount}C / {visit.nonConformingCount}NC)
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {visit.status === 'Finished' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Download className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />}
                        onClick={() => handleDownloadPdf(visit.id, visit.unitName)}
                        className="!text-xs"
                        title="Exportar Relatório em PDF"
                      >
                        PDF
                      </Button>
                    )}
                    {visit.status !== 'Cancelled' && visit.status !== 'Finished' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<CalendarX className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                        onClick={() => handleOpenCancel(visit)}
                        className="!text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        title="Desmarcar visita"
                      >
                        Desmarcar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                      onClick={() => handleOpenDelete(visit)}
                      className="!text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600"
                      title="Excluir visita"
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Agendar Visita */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Agendar Visita Técnica"
        subtitle="Defina o local, nutricionista RT e o checklist da auditoria"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">Unidade a Visitar</label>
            <select
              required
              value={unitId}
              onChange={e => setUnitId(e.target.value)}
              className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-sm text-[#0F172A] dark:text-[#F8FAFC] rounded-sm py-2.5 px-3.5 focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:outline-none"
            >
              <option value="">Selecione a unidade...</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.name} — {u.clientCompanyName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">Nutricionista Responsável</label>
            <select
              required
              value={nutritionistId}
              onChange={e => setNutritionistId(e.target.value)}
              className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-sm text-[#0F172A] dark:text-[#F8FAFC] rounded-sm py-2.5 px-3.5 focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:outline-none"
            >
              <option value="">Selecione o nutricionista...</option>
              {nutritionists.map(n => (
                <option key={n.id} value={n.id}>{n.name} ({n.crn})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">Checklist Aplicável</label>
            <select
              value={checklistId}
              onChange={e => setChecklistId(e.target.value)}
              className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-sm text-[#0F172A] dark:text-[#F8FAFC] rounded-sm py-2.5 px-3.5 focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:outline-none"
            >
              <option value="">Padrão RDC 216 / Boas Práticas</option>
              {checklists.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Data e Horário Previsto"
            type="datetime-local"
            required
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">Observações da Visita</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Instruções para o nutricionista..."
              rows={2}
              className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 rounded-sm py-2 px-3 focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Agendar Visita
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Desmarcar Visita */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          if (!actionLoading) setShowCancelModal(false);
        }}
        title="Desmarcar Visita Técnica"
        subtitle={selectedVisit ? `${selectedVisit.unitName} — ${new Date(selectedVisit.scheduledAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}` : ''}
      >
        <form onSubmit={handleConfirmCancel} className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-sm text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Ao desmarcar esta visita, seu status será alterado para <strong>Desmarcada</strong> e ela não aparecerá mais como pendente para o nutricionista.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">
              Motivo do Cancelamento (opcional)
            </label>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Ex: Imprevisto com o cliente, reagendamento solicitado..."
              rows={3}
              className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 rounded-sm py-2 px-3 focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button
              type="button"
              variant="secondary"
              disabled={actionLoading}
              onClick={() => setShowCancelModal(false)}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant="danger"
              loading={actionLoading}
            >
              Confirmar e Desmarcar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Excluir Visita */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!actionLoading) setShowDeleteModal(false);
        }}
        title="Excluir Visita Técnica"
        subtitle={selectedVisit ? `${selectedVisit.unitName} — ${new Date(selectedVisit.scheduledAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}` : ''}
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-sm text-sm text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-semibold">Tem certeza de que deseja excluir esta visita?</p>
              <p className="text-xs mt-1 text-rose-700 dark:text-rose-400">
                Esta ação removerá a visita do histórico e do painel do nutricionista. Não-conformidades associadas também serão removidas.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button
              type="button"
              variant="secondary"
              disabled={actionLoading}
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={actionLoading}
              onClick={handleConfirmDelete}
            >
              Excluir Definitivamente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};