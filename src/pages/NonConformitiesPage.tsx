import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { NonConformity } from '../types';
import { AlertTriangle, CheckCircle2, Clock, Plus, Filter, MessageSquare, Camera } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const NonConformitiesPage: React.FC = () => {
  const [items, setItems] = useState<NonConformity[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [statusFilter, severityFilter]);

  const loadData = async () => {
    try {
      let url = '/non-conformities?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (severityFilter) url += `severity=${severityFilter}&`;
      const { data } = await api.get(url);
      setItems(data);
    } catch (err) {
      console.error('Erro ao carregar não conformidades', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, currentItem: NonConformity) => {
    try {
      await api.put(`/non-conformities/${id}`, {
        category: currentItem.category,
        description: currentItem.description,
        severity: currentItem.severity,
        status: 'Resolvida',
        dueDate: currentItem.dueDate,
        correctiveAction: currentItem.correctiveAction
      });
      loadData();
    } catch (err) {
      alert('Erro ao atualizar status da não conformidade.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Não Conformidades & Planos de Ação</h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Tratamento e resolução de desvios identificados durante as visitas técnicas.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-[#CBD5E1] dark:border-[#334155] rounded-sm px-3 py-1.5 text-xs bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6]"
          >
            <option value="">Todos os Status</option>
            <option value="Aberta">Abertas</option>
            <option value="EmAndamento">Em Andamento</option>
            <option value="Resolvida">Resolvidas</option>
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="border border-[#CBD5E1] dark:border-[#334155] rounded-sm px-3 py-1.5 text-xs bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB] dark:focus:border-[#3B82F6]"
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
        {items.map((nc) => (
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
                    variant={
                      nc.severity === 'Critica' || nc.severity === 'Alta'
                        ? 'danger'
                        : 'warning'
                    }
                    size="sm"
                  >
                    Gravidade {nc.severity}
                  </Badge>
                  {nc.isLate && (
                    <Badge variant="danger" size="sm">
                      <Clock className="w-3 h-3 inline mr-1" /> Atrasada
                    </Badge>
                  )}
                  <Badge
                    variant={nc.status === 'Resolvida' ? 'success' : 'neutral'}
                    size="sm"
                  >
                    {nc.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base mt-1">{nc.description}</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                  Estabelecimento: <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{nc.unitName}</span> ({nc.clientCompanyName})
                </p>
              </div>

              {nc.status !== 'Resolvida' && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => handleResolve(nc.id, nc)}
                  className="shrink-0"
                >
                  Marcar como Resolvida
                </Button>
              )}
            </div>

            {nc.correctiveAction && (
              <div className="mt-4 p-3 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-sm text-xs">
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Ação Corretiva Recomendada: </span>
                <span className="text-[#334155] dark:text-[#94A3B8]">{nc.correctiveAction}</span>
                {nc.dueDate && (
                  <p className="text-[#64748B] dark:text-slate-400 mt-1 font-mono text-[11px]">
                    Prazo para regularização: {new Date(nc.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};