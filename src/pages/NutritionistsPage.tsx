import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Nutritionist, Unit } from '../types';
import { Users, Plus, Phone, Mail, Award, X, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const NutritionistsPage: React.FC = () => {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Praxis@123');
  const [crn, setCrn] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resNutris, resUnits] = await Promise.all([
        api.get('/nutritionists'),
        api.get('/units')
      ]);
      setNutritionists(resNutris.data);
      setUnits(resUnits.data);
    } catch (err) {
      console.error('Erro ao carregar nutricionistas', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/nutritionists', {
        name,
        email,
        password,
        crn,
        phone,
        assignedUnitIds: selectedUnitIds
      });
      setShowModal(false);
      loadData();
      setName(''); setEmail(''); setCrn(''); setPhone(''); setSelectedUnitIds([]);
    } catch (err) {
      alert('Erro ao cadastrar nutricionista.');
    }
  };

  const toggleUnit = (unitId: string) => {
    setSelectedUnitIds(prev => 
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Equipe Técnica de Nutricionistas</h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Profissionais RT e atribuição operacional de unidades.</p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Novo Nutricionista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nutritionists.map((nutri) => (
          <Card key={nutri.id} className="flex flex-col justify-between !p-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#60A5FA] font-bold flex items-center justify-center border border-blue-200 dark:border-blue-800/40">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base">{nutri.name}</h3>
                  <Badge variant="info" size="sm" className="font-mono mt-0.5">
                    {nutri.crn}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#475569] dark:text-[#94A3B8] border-t border-[#CBD5E1] dark:border-[#334155] pt-3">
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-500" /> {nutri.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-500" /> {nutri.phone || '-'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#CBD5E1] dark:border-[#334155]">
                <p className="text-[11px] font-bold uppercase text-[#64748B] dark:text-[#94A3B8] mb-1.5">
                  Unidades Atribuídas ({nutri.assignedUnitIds?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1">
                  {nutri.assignedUnitIds && nutri.assignedUnitIds.length > 0 ? (
                    nutri.assignedUnitIds.map(unitId => {
                      const u = units.find(unit => unit.id === unitId);
                      return (
                        <span key={unitId} className="text-[11px] bg-[#F1F5F9] dark:bg-[#1E293B] text-[#334155] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#334155] px-2 py-0.5 rounded">
                          {u?.name || 'Unidade'}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic">Nenhuma unidade vinculada</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Cadastrar Nutricionista RT"
        subtitle="Criação de credencial e perfil de RT"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nome Completo"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Dra. Juliana Ferreira"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Registro Profissional (CRN)"
              required
              value={crn}
              onChange={e => setCrn(e.target.value)}
              placeholder="CRN-3/12345"
            />
            <Input
              label="Telefone / WhatsApp"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(11) 99999-0000"
            />
          </div>
          <Input
            label="E-mail de Acesso"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="juliana.nutri@nutrivida.com"
          />
          <Input
            label="Senha Inicial"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">Vincular Unidades</label>
            <div className="border border-[#CBD5E1] dark:border-[#334155] rounded-sm p-2 max-h-36 overflow-y-auto space-y-1 bg-[#F8FAFC] dark:bg-[#1E293B]">
              {units.map(u => (
                <label key={u.id} className="flex items-center gap-2 p-1.5 hover:bg-white dark:hover:bg-[#0F172A] rounded text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUnitIds.includes(u.id)}
                    onChange={() => toggleUnit(u.id)}
                    className="rounded border-[#CBD5E1] dark:border-[#334155] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span className="text-[#0F172A] dark:text-[#F8FAFC] font-medium">{u.name} ({u.clientCompanyName})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar Nutricionista
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};