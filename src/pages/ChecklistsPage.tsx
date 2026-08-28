import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Checklist } from '../types';
import { ListChecks, CheckSquare } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const ChecklistsPage: React.FC = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await api.get('/checklists');
      setChecklists(data);
    } catch (err) {
      console.error('Erro ao carregar checklists', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Modelos de Checklists (RDC 216)</h2>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Estrutura oficial de avaliação de boas práticas e manipulação higiênico-sanitária.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {checklists.map((checklist) => (
          <Card key={checklist.id} className="!p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-md bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-800/40">
                <ListChecks className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-lg">{checklist.name}</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{checklist.description}</p>
              </div>
            </div>

            <div className="border border-[#CBD5E1] dark:border-[#334155] rounded-sm overflow-hidden">
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] px-4 py-2 border-b border-[#CBD5E1] dark:border-[#334155] text-[11px] font-bold uppercase text-[#64748B] dark:text-[#94A3B8] flex justify-between">
                <span>Critérios de Avaliação</span>
                <span>{checklist.items.length} itens</span>
              </div>
              <div className="divide-y divide-[#CBD5E1] dark:divide-[#334155]">
                {checklist.items.map((item, idx) => (
                  <div key={item.id} className="p-3.5 text-sm flex items-start gap-3 hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60 transition-colors">
                    <span className="font-mono text-xs font-bold text-[#64748B] dark:text-slate-500 mt-0.5">{idx + 1}.</span>
                    <div className="flex-1">
                      <Badge variant="info" size="sm" className="mr-2 uppercase">
                        {item.category}
                      </Badge>
                      <span className="text-[#0F172A] dark:text-[#F8FAFC] text-xs font-medium">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};