import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DashboardMetrics } from '../types';
import { 
  Building2, 
  Users, 
  FileCheck2, 
  CalendarDays, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await api.get('/dashboard');
      setMetrics(data);
    } catch (err) {
      console.error('Erro ao carregar dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#64748B] text-sm">
        <span className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mr-2" />
        Carregando dados operacionais...
      </div>
    );
  }

  const kpis = [
    { label: 'Empresas Clientes', value: metrics?.totalClients ?? 0, icon: Building2, color: 'text-[#2563EB] dark:text-[#60A5FA]', bg: 'bg-[#EFF6FF] dark:bg-blue-950/50' },
    { label: 'Unidades Atendidas', value: metrics?.totalUnits ?? 0, icon: Building2, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/50' },
    { label: 'Nutricionistas RT', value: metrics?.totalNutritionists ?? 0, icon: Users, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'ARTs Ativas', value: metrics?.activeArts ?? 0, icon: FileCheck2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50' },
    { label: 'Visitas no Mês', value: metrics?.visitsThisMonth ?? 0, icon: CalendarDays, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/50' },
    { label: 'Não Conformidades', value: metrics?.openNonConformities ?? 0, icon: AlertTriangle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/50' },
    { label: 'Ações Atrasadas', value: metrics?.lateNonConformities ?? 0, icon: Clock, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/50' },
    { label: 'Conformidade Média', value: `${metrics?.averageComplianceRate ?? 100}%`, icon: CheckCircle2, color: 'text-[#2563EB] dark:text-[#60A5FA]', bg: 'bg-[#EFF6FF] dark:bg-blue-950/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Context (System Design Section 14) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-[#0F172A] p-6 rounded-md border border-[#CBD5E1] dark:border-[#334155] shadow-subtle dark:shadow-dark-subtle transition-colors">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Resumo Operacional de Responsabilidade Técnica
          </h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
            Aqui está a consolidação das auditorias, conformidades e ações corretivas em campo.
          </p>
        </div>
        <Link to="/visits">
          <Button variant="primary" size="md" icon={<CalendarDays className="w-4 h-4" />}>
            Agendar Visita
          </Button>
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="flex items-center justify-between !p-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">{kpi.label}</p>
                <p className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] mt-1">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-md ${kpi.bg} ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visits */}
        <Card className="!p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#CBD5E1] dark:border-[#334155]">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#2563EB] dark:text-[#3B82F6]" />
                Últimas Visitas Realizadas
              </h3>
              <Link to="/visits" className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] flex items-center gap-1">
                Ver todas <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {metrics?.recentVisits && metrics.recentVisits.length > 0 ? (
                metrics.recentVisits.map((v) => (
                  <div key={v.id} className="p-3 rounded-sm border border-[#CBD5E1] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#1E293B] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">{v.clientName} — {v.unitName}</p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">RT: {v.nutritionistName} • {new Date(v.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      {v.complianceRate !== undefined && v.complianceRate !== null ? (
                        <Badge variant={v.complianceRate >= 80 ? 'success' : 'danger'} size="sm">
                          {v.complianceRate}% Conforme
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          {v.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] py-6 text-center">Nenhuma visita recente registrada.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Critical Units & Expiring ARTs */}
        <div className="space-y-6">
          {/* Critical Units */}
          <Card className="!p-5">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#CBD5E1] dark:border-[#334155]">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Unidades com Não Conformidades Abertas
              </h3>
            </div>

            <div className="space-y-2">
              {metrics?.criticalUnits && metrics.criticalUnits.length > 0 ? (
                metrics.criticalUnits.map((u) => (
                  <div key={u.unitId} className="p-3 rounded-sm border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">{u.unitName}</p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{u.clientName}</p>
                    </div>
                    <Badge variant="danger" size="sm">
                      {u.openNonConformitiesCount} pendência(s)
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] py-3 text-center">Nenhuma unidade crítica no momento.</p>
              )}
            </div>
          </Card>

          {/* Expiring ARTs */}
          <Card className="!p-5">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#CBD5E1] dark:border-[#334155]">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ARTs Próximas do Vencimento (30 dias)
              </h3>
            </div>

            <div className="space-y-2">
              {metrics?.expiringArts && metrics.expiringArts.length > 0 ? (
                metrics.expiringArts.map((art) => (
                  <div key={art.id} className="p-3 rounded-sm border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">{art.number} — {art.unitName}</p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">RT: {art.nutritionistName}</p>
                    </div>
                    <Badge variant="warning" size="sm">
                      Vence em {art.daysRemaining} dias
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] py-3 text-center">Todas as ARTs estão regulares.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};