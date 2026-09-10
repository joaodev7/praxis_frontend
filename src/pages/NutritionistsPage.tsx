import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Nutritionist, Unit } from '../types';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Award,
  X,
  Check,
  Edit2,
  Trash2,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const NutritionistsPage: React.FC = () => {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Selected Entity
  const [selectedNutri, setSelectedNutri] = useState<Nutritionist | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Praxis@123');
  const [crn, setCrn] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<string>('Active');
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resNutris, resUnits] = await Promise.all([
        api.get('/nutritionists'),
        api.get('/units'),
      ]);
      setNutritionists(resNutris.data);
      setUnits(resUnits.data);
    } catch (err) {
      console.error('Erro ao carregar nutricionistas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setName('');
    setEmail('');
    setPassword('Praxis@123');
    setCrn('');
    setPhone('');
    setStatus('Active');
    setSelectedUnitIds([]);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (nutri: Nutritionist) => {
    setSelectedNutri(nutri);
    setName(nutri.name);
    setEmail(nutri.email);
    setCrn(nutri.crn);
    setPhone(nutri.phone || '');
    setStatus(nutri.status || 'Active');
    setSelectedUnitIds(nutri.assignedUnitIds || []);
    setShowEditModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/nutritionists', {
        name,
        email,
        password,
        crn,
        phone,
        assignedUnitIds: selectedUnitIds,
      });
      setShowCreateModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cadastrar nutricionista.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNutri) return;
    setSubmitting(true);
    try {
      await api.put(`/nutritionists/${selectedNutri.id}`, {
        name,
        email,
        crn,
        phone,
        status: status === 'Active' ? 1 : 2,
        assignedUnitIds: selectedUnitIds,
      });
      setShowEditModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar dados do nutricionista.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNutri) return;
    setSubmitting(true);
    try {
      await api.delete(`/nutritionists/${selectedNutri.id}`);
      setShowDeleteModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir nutricionista.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUnit = (unitId: string) => {
    setSelectedUnitIds((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Equipe Técnica de Nutricionistas
          </h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Gestão cadastral dos profissionais RT e controle de atribuição operacional de unidades.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Novo Nutricionista
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
          Carregando equipe técnica...
        </div>
      ) : nutritionists.length === 0 ? (
        <div className="p-12 border border-dashed border-[#CBD5E1] dark:border-[#334155] rounded-lg text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
          Nenhum nutricionista cadastrado. Clique no botão acima para cadastrar o primeiro profissional RT.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nutritionists.map((nutri) => (
            <Card key={nutri.id} className="flex flex-col justify-between !p-5">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
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

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(nutri)}
                      title="Editar Nutricionista"
                      className="p-1.5 text-slate-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNutri(nutri);
                        setShowDeleteModal(true);
                      }}
                      title="Excluir Nutricionista"
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#475569] dark:text-[#94A3B8] border-t border-[#CBD5E1] dark:border-[#334155] pt-3">
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-[#64748B] dark:text-slate-500" /> {nutri.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-[#64748B] dark:text-slate-500" /> {nutri.phone || '-'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#CBD5E1] dark:border-[#334155]">
                  <p className="text-[11px] font-bold uppercase text-[#64748B] dark:text-[#94A3B8] mb-1.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                    Unidades Vinculadas ({nutri.assignedUnitIds?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {nutri.assignedUnitIds && nutri.assignedUnitIds.length > 0 ? (
                      nutri.assignedUnitIds.map((unitId) => {
                        const u = units.find((unit) => unit.id === unitId);
                        return (
                          <span
                            key={unitId}
                            className="text-[11px] bg-[#F1F5F9] dark:bg-[#1E293B] text-[#334155] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#334155] px-2 py-0.5 rounded"
                          >
                            {u?.name || 'Unidade'}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                        Nenhuma unidade vinculada
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Criar Nutricionista */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Cadastrar Nutricionista RT"
        subtitle="Criação de credencial de acesso e perfil de RT"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nome Completo"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dra. Juliana Ferreira"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Registro Profissional (CRN)"
              required
              value={crn}
              onChange={(e) => setCrn(e.target.value)}
              placeholder="CRN-3/12345"
            />
            <Input
              label="Telefone / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-0000"
            />
          </div>
          <Input
            label="E-mail de Acesso"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nutricionista@email.com"
          />
          <Input
            label="Senha Inicial"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">
              Vincular Unidades Iniciais (Opcional)
            </label>
            <div className="border border-[#CBD5E1] dark:border-[#334155] rounded-sm p-2 max-h-36 overflow-y-auto space-y-1 bg-[#F8FAFC] dark:bg-[#1E293B]">
              {units.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-1">Nenhuma unidade cadastrada no momento.</p>
              ) : (
                units.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center gap-2 p-1.5 hover:bg-white dark:hover:bg-[#0F172A] rounded text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUnitIds.includes(u.id)}
                      onChange={() => toggleUnit(u.id)}
                      className="rounded border-[#CBD5E1] dark:border-[#334155] text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span className="text-[#0F172A] dark:text-[#F8FAFC] font-medium">
                      {u.name} ({u.clientCompanyName})
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Nutricionista'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Nutricionista */}
      <Modal
        isOpen={showEditModal && !!selectedNutri}
        onClose={() => setShowEditModal(false)}
        title="Editar Nutricionista RT"
        subtitle={`Editando dados de ${selectedNutri?.name}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Nome Completo"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Registro Profissional (CRN)"
              required
              value={crn}
              onChange={(e) => setCrn(e.target.value)}
            />
            <Input
              label="Telefone / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Input
            label="E-mail de Acesso"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">
              Gerenciar Unidades Vinculadas
            </label>
            <div className="border border-[#CBD5E1] dark:border-[#334155] rounded-sm p-2 max-h-36 overflow-y-auto space-y-1 bg-[#F8FAFC] dark:bg-[#1E293B]">
              {units.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-2 p-1.5 hover:bg-white dark:hover:bg-[#0F172A] rounded text-xs cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedUnitIds.includes(u.id)}
                    onChange={() => toggleUnit(u.id)}
                    className="rounded border-[#CBD5E1] dark:border-[#334155] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span className="text-[#0F172A] dark:text-[#F8FAFC] font-medium">
                    {u.name} ({u.clientCompanyName})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Excluir Nutricionista */}
      <Modal
        isOpen={showDeleteModal && !!selectedNutri}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir Nutricionista"
        subtitle={`Desativação do profissional RT`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-md text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Deseja realmente desativar {selectedNutri?.name} ({selectedNutri?.crn})?</p>
              <p className="mt-1">
                O profissional deixará de ter acesso ao sistema. O histórico de vistorias técnicas e ARTs associadas
                permanecerá preservado.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={submitting}>
              {submitting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};