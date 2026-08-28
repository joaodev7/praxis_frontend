import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ART, Unit, Nutritionist } from '../types';
import { FileCheck2, Plus, Calendar, Building2, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const ArtsPage: React.FC = () => {
  const [arts, setArts] = useState<ART[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form
  const [unitId, setUnitId] = useState('');
  const [nutritionistId, setNutritionistId] = useState('');
  const [number, setNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resArts, resUnits, resNutris] = await Promise.all([
        api.get('/arts'),
        api.get('/units'),
        api.get('/nutritionists')
      ]);
      setArts(resArts.data);
      setUnits(resUnits.data);
      setNutritionists(resNutris.data);
    } catch (err) {
      console.error('Erro ao carregar ARTs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/arts', {
        unitId,
        nutritionistId,
        number,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        notes
      });
      setShowModal(false);
      loadData();
      setNumber(''); setNotes('');
    } catch (err) {
      alert('Erro ao cadastrar ART.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">ARTs & Responsabilidade Técnica</h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Controle dos registros formais perante o Conselho de Nutricionistas (CRN).</p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Nova ART
        </Button>
      </div>

      <div className="bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] rounded-md overflow-hidden shadow-subtle dark:shadow-dark-subtle transition-colors">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#CBD5E1] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] font-bold text-[11px] uppercase tracking-wider">
              <th className="p-4">Número do Documento</th>
              <th className="p-4">Estabelecimento / Unidade</th>
              <th className="p-4">Nutricionista RT</th>
              <th className="p-4">Vigência</th>
              <th className="p-4">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#334155]">
            {arts.map((art) => (
              <tr key={art.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/60 transition-colors">
                <td className="p-4 font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#2563EB] dark:text-[#3B82F6]" />
                  {art.number}
                </td>
                <td className="p-4">
                  <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{art.unitName}</p>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{art.clientCompanyName}</p>
                </td>
                <td className="p-4 text-[#334155] dark:text-[#94A3B8] font-medium">
                  {art.nutritionistName}
                </td>
                <td className="p-4 text-xs text-[#475569] dark:text-slate-400">
                  {new Date(art.startDate).toLocaleDateString('pt-BR')} até{' '}
                  {art.endDate ? new Date(art.endDate).toLocaleDateString('pt-BR') : 'Indeterminado'}
                </td>
                <td className="p-4">
                  <Badge variant={art.status === 'Active' ? 'success' : 'neutral'} size="sm">
                    {art.status === 'Active' ? 'Ativa' : art.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Cadastrar ART de Responsabilidade Técnica"
        subtitle="Registro de anotação de responsabilidade técnica perante o CRN"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">Unidade do Estabelecimento</label>
            <select
              required
              value={unitId}
              onChange={e => setUnitId(e.target.value)}
              className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-sm text-[#0F172A] dark:text-[#F8FAFC] rounded-sm py-2.5 px-3.5 focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:outline-none"
            >
              <option value="">Selecione uma unidade...</option>
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

          <Input
            label="Número da ART"
            required
            value={number}
            onChange={e => setNumber(e.target.value)}
            placeholder="Ex: ART-SP-2026/00142"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data de Início"
              type="date"
              required
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <Input
              label="Data de Término (Opcional)"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">Observações da ART</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Escopo da responsabilidade técnica, carga horária, etc."
              rows={2}
              className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 rounded-sm py-2 px-3 focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar ART
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};