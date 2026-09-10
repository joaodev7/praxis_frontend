import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ClientCompany, Unit, Nutritionist, StoredFileDto } from '../types';
import {
  Building2,
  Plus,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  X,
  Layers,
  Image as ImageIcon,
  Trash2,
  FolderOpen,
  Edit2,
  Users,
  UserPlus,
  UserMinus,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { FileUpload } from '../components/files/FileUpload';
import { PrivateImage } from '../components/files/PrivateImage';
import { PdfViewerButton } from '../components/files/PdfViewerButton';
import { listClientFiles, deleteFile } from '../services/fileService';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientCompany[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Selected Entities
  const [selectedClient, setSelectedClient] = useState<ClientCompany | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedNutriForDeallocate, setSelectedNutriForDeallocate] = useState<{ id: string; name: string } | null>(null);

  // Modals state
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showDeleteClientModal, setShowDeleteClientModal] = useState(false);

  const [showCreateUnitModal, setShowCreateUnitModal] = useState(false);
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [showDeleteUnitModal, setShowDeleteUnitModal] = useState(false);

  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showDeallocateModal, setShowDeallocateModal] = useState(false);
  const [selectedNutriIdToAllocate, setSelectedNutriIdToAllocate] = useState<string>('');

  const [showFilesModal, setShowFilesModal] = useState(false);
  const [clientFiles, setClientFiles] = useState<StoredFileDto[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // Client Form State
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<string>('Active');

  // Unit Form State
  const [unitName, setUnitName] = useState('');
  const [unitAddress, setUnitAddress] = useState('');
  const [unitPhone, setUnitPhone] = useState('');
  const [unitResponsible, setUnitResponsible] = useState('');
  const [unitNotes, setUnitNotes] = useState('');
  const [unitStatus, setUnitStatus] = useState<string>('Active');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resClients, resUnits, resNutris] = await Promise.all([
        api.get('/clients'),
        api.get('/units'),
        api.get('/nutritionists'),
      ]);
      setClients(resClients.data);
      setUnits(resUnits.data);
      setNutritionists(resNutris.data);
    } catch (err) {
      console.error('Erro ao carregar dados operacionais:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClientFiles = async (clientId: string) => {
    setFilesLoading(true);
    try {
      const files = await listClientFiles(clientId);
      setClientFiles(files);
    } catch (err) {
      console.error('Erro ao carregar arquivos do cliente:', err);
    } finally {
      setFilesLoading(false);
    }
  };

  const openFilesModal = (client: ClientCompany) => {
    setSelectedClient(client);
    setShowFilesModal(true);
    loadClientFiles(client.id);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Deseja realmente excluir este arquivo do Cloudflare R2?')) return;
    try {
      await deleteFile(fileId);
      if (selectedClient) {
        loadClientFiles(selectedClient.id);
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir arquivo.');
    }
  };

  // ==========================================
  // CLIENT HANDLERS
  // ==========================================
  const handleOpenCreateClient = () => {
    setLegalName('');
    setTradeName('');
    setCnpj('');
    setEmail('');
    setPhone('');
    setAddress('');
    setResponsibleName('');
    setNotes('');
    setStatus('Active');
    setShowCreateClientModal(true);
  };

  const handleOpenEditClient = (client: ClientCompany) => {
    setSelectedClient(client);
    setLegalName(client.legalName);
    setTradeName(client.tradeName);
    setCnpj(client.cnpj);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address || '');
    setResponsibleName(client.responsibleName || '');
    setNotes(client.notes || '');
    setStatus(client.status || 'Active');
    setShowEditClientModal(true);
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/clients', {
        legalName,
        tradeName,
        cnpj,
        email,
        phone,
        address,
        responsibleName,
        notes,
      });
      setShowCreateClientModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cadastrar empresa cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    setSubmitting(true);
    try {
      await api.put(`/clients/${selectedClient.id}`, {
        legalName,
        tradeName,
        email,
        phone,
        address,
        responsibleName,
        notes,
        status: status === 'Active' ? 1 : 2,
      });
      setShowEditClientModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar dados do cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    setSubmitting(true);
    try {
      await api.delete(`/clients/${selectedClient.id}`);
      setShowDeleteClientModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir empresa cliente.');
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // UNIT HANDLERS
  // ==========================================
  const handleOpenCreateUnit = (client: ClientCompany) => {
    setSelectedClient(client);
    setUnitName('');
    setUnitAddress('');
    setUnitPhone('');
    setUnitResponsible('');
    setUnitNotes('');
    setUnitStatus('Active');
    setShowCreateUnitModal(true);
  };

  const handleOpenEditUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setUnitName(unit.name);
    setUnitAddress(unit.address);
    setUnitPhone(unit.phone);
    setUnitResponsible(unit.responsibleName);
    setUnitNotes(unit.notes || '');
    setUnitStatus(unit.status || 'Active');
    setShowEditUnitModal(true);
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    setSubmitting(true);
    try {
      await api.post('/units', {
        clientCompanyId: selectedClient.id,
        name: unitName,
        address: unitAddress,
        phone: unitPhone,
        responsibleName: unitResponsible,
        notes: unitNotes,
      });
      setShowCreateUnitModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cadastrar unidade.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) return;
    setSubmitting(true);
    try {
      await api.put(`/units/${selectedUnit.id}`, {
        name: unitName,
        address: unitAddress,
        phone: unitPhone,
        responsibleName: unitResponsible,
        notes: unitNotes,
        status: unitStatus === 'Active' ? 1 : 2,
      });
      setShowEditUnitModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar dados da unidade.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUnit = async () => {
    if (!selectedUnit) return;
    setSubmitting(true);
    try {
      await api.delete(`/units/${selectedUnit.id}`);
      setShowDeleteUnitModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir unidade.');
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // NUTRITIONIST ALLOCATION HANDLERS
  // ==========================================
  const handleOpenAllocateModal = (unit: Unit) => {
    setSelectedUnit(unit);
    // Encontra os nutricionistas disponíveis que ainda não estão alocados nesta unidade
    const assignedIds = (unit.assignedNutritionists || []).map((an) => an.nutritionistId);
    const available = nutritionists.filter((n) => !assignedIds.includes(n.id));
    setSelectedNutriIdToAllocate(available.length > 0 ? available[0].id : '');
    setShowAllocateModal(true);
  };

  const handleConfirmAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit || !selectedNutriIdToAllocate) return;
    setSubmitting(true);
    try {
      await api.post(`/units/${selectedUnit.id}/nutritionists/${selectedNutriIdToAllocate}`);
      setShowAllocateModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao alocar nutricionista na unidade.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeallocateModal = (unit: Unit, nutri: { id: string; name: string }) => {
    setSelectedUnit(unit);
    setSelectedNutriForDeallocate(nutri);
    setShowDeallocateModal(true);
  };

  const handleConfirmDeallocation = async () => {
    if (!selectedUnit || !selectedNutriForDeallocate) return;
    setSubmitting(true);
    try {
      await api.delete(`/units/${selectedUnit.id}/nutritionists/${selectedNutriForDeallocate.id}`);
      setShowDeallocateModal(false);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao desalocar nutricionista.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Empresas Clientes & Unidades
          </h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Gestão operacional dos estabelecimentos e alocação de nutricionistas RT por unidade.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreateClient}
        >
          Nova Empresa Cliente
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
          Carregando empresas e unidades...
        </div>
      ) : clients.length === 0 ? (
        <div className="p-12 border border-dashed border-[#CBD5E1] dark:border-[#334155] rounded-lg text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
          Nenhuma empresa cliente cadastrada ainda. Clique no botão acima para adicionar a primeira.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const clientUnits = units.filter((u) => u.clientCompanyId === client.id);
            return (
              <Card key={client.id} className="flex flex-col justify-between !p-5">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-2">
                      <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base">{client.tradeName}</h3>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">{client.legalName}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">CNPJ: {client.cnpj}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditClient(client)}
                        title="Editar Empresa Cliente"
                        className="p-1.5 text-slate-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowDeleteClientModal(true);
                        }}
                        title="Excluir Empresa Cliente"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#475569] dark:text-[#94A3B8] mt-3 border-t border-[#CBD5E1] dark:border-[#334155] pt-3">
                    {client.responsibleName && (
                      <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                        Contato: {client.responsibleName}
                      </p>
                    )}
                    {client.email && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 shrink-0 text-[#64748B] dark:text-slate-500" /> {client.email}
                      </p>
                    )}
                    {client.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 shrink-0 text-[#64748B] dark:text-slate-500" /> {client.phone}
                      </p>
                    )}
                  </div>

                  {/* List of Units */}
                  <div className="mt-4 pt-3 border-t border-[#CBD5E1] dark:border-[#334155]">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[11px] font-bold uppercase text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" /> Unidades ({clientUnits.length})
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {clientUnits.length > 0 ? (
                        clientUnits.map((u) => {
                          const assignedNutris = u.assignedNutritionists || [];
                          return (
                            <div
                              key={u.id}
                              className="p-3 rounded-md bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-xs space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{u.name}</span>
                                  {u.address && (
                                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 truncate max-w-[180px]">
                                      {u.address}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleOpenEditUnit(u)}
                                    title="Editar Unidade"
                                    className="p-1 text-slate-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] rounded"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUnit(u);
                                      setShowDeleteUnitModal(true);
                                    }}
                                    title="Excluir Unidade"
                                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Nutricionistas alocados na Unidade */}
                              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155]/60">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase flex items-center gap-1">
                                    <Users className="w-3 h-3 text-[#2563EB] dark:text-[#3B82F6]" /> RTs Alocados:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAllocateModal(u)}
                                    className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-0.5"
                                  >
                                    <UserPlus className="w-3 h-3" /> Alocar RT
                                  </button>
                                </div>

                                <div className="flex flex-wrap gap-1 mt-1">
                                  {assignedNutris.length > 0 ? (
                                    assignedNutris.map((an) => (
                                      <span
                                        key={an.nutritionistId}
                                        className="inline-flex items-center gap-1 text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 px-1.5 py-0.5 rounded"
                                      >
                                        <span>{an.name} ({an.crn})</span>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenDeallocateModal(u, { id: an.nutritionistId, name: an.name })}
                                          title="Desalocar nutricionista desta unidade"
                                          className="text-blue-400 hover:text-rose-600 dark:hover:text-rose-400 ml-0.5"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                                      Nenhum RT alocado ainda
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                          Nenhuma unidade cadastrada ainda
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#CBD5E1] dark:border-[#334155] flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FolderOpen className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />}
                    onClick={() => openFilesModal(client)}
                    className="!text-[#2563EB] dark:!text-[#60A5FA] hover:!bg-[#EFF6FF] dark:hover:!bg-blue-950/30"
                  >
                    Arquivos & Fotos
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Plus className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />}
                    onClick={() => handleOpenCreateUnit(client)}
                    className="!text-[#2563EB] dark:!text-[#60A5FA] hover:!bg-[#EFF6FF] dark:hover:!bg-blue-950/30"
                  >
                    Adicionar Unidade
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAIS DE CLIENTE                                        */}
      {/* ======================================================== */}

      {/* Modal Criar Empresa Cliente */}
      <Modal
        isOpen={showCreateClientModal}
        onClose={() => setShowCreateClientModal(false)}
        title="Cadastrar Nova Empresa Cliente"
        subtitle="Informe os dados cadastrais da organização atendida"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <Input
            label="Nome Fantasia"
            required
            value={tradeName}
            onChange={(e) => setTradeName(e.target.value)}
            placeholder="Ex: Restaurante Sabor Caseiro"
          />
          <Input
            label="Razão Social"
            required
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            placeholder="Ex: Restaurante Sabor Caseiro Ltda"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CNPJ"
              required
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
            />
            <Input
              label="Responsável Local"
              value={responsibleName}
              onChange={(e) => setResponsibleName(e.target.value)}
              placeholder="Nome do contato / gerente"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contato@empresa.com"
            />
            <Input
              label="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 98888-0000"
            />
          </div>
          <Input
            label="Endereço Principal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rua, número, bairro, cidade - UF"
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowCreateClientModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Empresa'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Empresa Cliente */}
      <Modal
        isOpen={showEditClientModal && !!selectedClient}
        onClose={() => setShowEditClientModal(false)}
        title="Editar Empresa Cliente"
        subtitle={`Editando dados de ${selectedClient?.tradeName}`}
      >
        <form onSubmit={handleUpdateClient} className="space-y-4">
          <Input
            label="Nome Fantasia"
            required
            value={tradeName}
            onChange={(e) => setTradeName(e.target.value)}
          />
          <Input
            label="Razão Social"
            required
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">
                CNPJ (Não alterável)
              </label>
              <input
                type="text"
                disabled
                value={cnpj}
                className="w-full bg-slate-100 dark:bg-[#1E293B] text-slate-500 border border-[#CBD5E1] dark:border-[#334155] rounded-sm px-3 py-2 text-xs font-mono"
              />
            </div>
            <Input
              label="Responsável Local"
              value={responsibleName}
              onChange={(e) => setResponsibleName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Input
            label="Endereço Principal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowEditClientModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Excluir Empresa Cliente */}
      <Modal
        isOpen={showDeleteClientModal && !!selectedClient}
        onClose={() => setShowDeleteClientModal(false)}
        title="Excluir Empresa Cliente"
        subtitle={`Atenção: Ação com impacto em unidades vinculadas`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-md text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Deseja realmente desativar {selectedClient?.tradeName}?</p>
              <p className="mt-1">
                Todas as unidades operacionais associadas a esta empresa também serão desativadas. O histórico de laudos,
                ARTs e vistorias anteriores permanecerá preservado de forma segura no banco de dados.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button variant="secondary" onClick={() => setShowDeleteClientModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteClient} disabled={submitting}>
              {submitting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAIS DE UNIDADE                                        */}
      {/* ======================================================== */}

      {/* Modal Criar Unidade */}
      <Modal
        isOpen={showCreateUnitModal && !!selectedClient}
        onClose={() => setShowCreateUnitModal(false)}
        title="Cadastrar Nova Unidade / Filial"
        subtitle={`Empresa: ${selectedClient?.tradeName}`}
      >
        <form onSubmit={handleCreateUnit} className="space-y-4">
          <Input
            label="Nome da Unidade"
            required
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            placeholder="Ex: Unidade Centro / Cozinha Industrial"
          />
          <Input
            label="Endereço Completo"
            required
            value={unitAddress}
            onChange={(e) => setUnitAddress(e.target.value)}
            placeholder="Av. Paulista, 1000 - Bela Vista"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Responsável Local"
              value={unitResponsible}
              onChange={(e) => setUnitResponsible(e.target.value)}
              placeholder="Gerente da loja"
            />
            <Input
              label="Telefone da Unidade"
              value={unitPhone}
              onChange={(e) => setUnitPhone(e.target.value)}
              placeholder="(11) 3333-2222"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowCreateUnitModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Cadastrando...' : 'Cadastrar Unidade'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Editar Unidade */}
      <Modal
        isOpen={showEditUnitModal && !!selectedUnit}
        onClose={() => setShowEditUnitModal(false)}
        title="Editar Unidade"
        subtitle={`Editando dados de ${selectedUnit?.name}`}
      >
        <form onSubmit={handleUpdateUnit} className="space-y-4">
          <Input
            label="Nome da Unidade"
            required
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
          />
          <Input
            label="Endereço Completo"
            required
            value={unitAddress}
            onChange={(e) => setUnitAddress(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Responsável Local"
              value={unitResponsible}
              onChange={(e) => setUnitResponsible(e.target.value)}
            />
            <Input
              label="Telefone da Unidade"
              value={unitPhone}
              onChange={(e) => setUnitPhone(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowEditUnitModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Excluir Unidade */}
      <Modal
        isOpen={showDeleteUnitModal && !!selectedUnit}
        onClose={() => setShowDeleteUnitModal(false)}
        title="Excluir Unidade"
        subtitle={`Desativação da unidade ${selectedUnit?.name}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Tem certeza que deseja desativar a unidade <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{selectedUnit?.name}</strong>?
            Esta unidade deixará de aparecer para agendamento de novas visitas, mantendo o histórico de vistorias passadas.
          </p>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button variant="secondary" onClick={() => setShowDeleteUnitModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteUnit} disabled={submitting}>
              {submitting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL ALOCAR NUTRICIONISTA RT                            */}
      {/* ======================================================== */}
      <Modal
        isOpen={showAllocateModal && !!selectedUnit}
        onClose={() => setShowAllocateModal(false)}
        title="Alocar Nutricionista RT"
        subtitle={`Unidade: ${selectedUnit?.name}`}
      >
        <form onSubmit={handleConfirmAllocation} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#94A3B8] uppercase mb-1">
              Selecione o Profissional RT
            </label>
            {nutritionists.length === 0 ? (
              <p className="text-xs text-rose-500">Nenhum nutricionista cadastrado na consultoria.</p>
            ) : (
              <select
                value={selectedNutriIdToAllocate}
                onChange={(e) => setSelectedNutriIdToAllocate(e.target.value)}
                className="w-full bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] border border-[#CBD5E1] dark:border-[#334155] rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
              >
                {nutritionists.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.crn}) — {n.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-md text-[11px] text-blue-800 dark:text-blue-300">
            Ao alocar o nutricionista, ele terá permissão para executar visitas técnicas nesta unidade e constará como RT responsável.
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowAllocateModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting || !selectedNutriIdToAllocate}>
              {submitting ? 'Alocando...' : 'Confirmar Alocação'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Desalocar Nutricionista */}
      <Modal
        isOpen={showDeallocateModal && !!selectedUnit && !!selectedNutriForDeallocate}
        onClose={() => setShowDeallocateModal(false)}
        title="Desalocar Nutricionista"
        subtitle={`Remoção de vínculo operacional`}
      >
        <div className="space-y-4">
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Deseja remover o vínculo da(o) <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{selectedNutriForDeallocate?.name}</strong> da unidade <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{selectedUnit?.name}</strong>?
          </p>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded text-[11px] text-amber-800 dark:text-amber-300">
            O nutricionista <strong>continuará cadastrado normalmente</strong> no sistema, mas deixará de estar vinculado a esta unidade.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button variant="secondary" onClick={() => setShowDeallocateModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDeallocation} disabled={submitting}>
              {submitting ? 'Desalocando...' : 'Confirmar Desalocação'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ======================================================== */}
      {/* MODAL ARQUIVOS & FOTOS (CLOUDFLARE R2)                   */}
      {/* ======================================================== */}
      <Modal
        isOpen={showFilesModal && !!selectedClient}
        onClose={() => setShowFilesModal(false)}
        title={`Arquivos & Fotos — ${selectedClient?.tradeName}`}
        subtitle="Armazenamento seguro de fotos de vistorias, laudos e documentos via Cloudflare R2"
      >
        <div className="space-y-6">
          {selectedClient && (
            <FileUpload
              label="Enviar Foto ou Documento do Estabelecimento"
              description="Imagens (JPG, PNG, WEBP até 5 MB) ou Laudos Técnicos (PDF até 10 MB)"
              category="ClientPhoto"
              clientId={selectedClient.id}
              onSuccess={() => {
                loadClientFiles(selectedClient.id);
              }}
            />
          )}

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Arquivos Armazenados ({clientFiles.length})
            </h4>

            {filesLoading ? (
              <div className="p-6 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
                Carregando arquivos...
              </div>
            ) : clientFiles.length === 0 ? (
              <div className="p-6 border border-dashed border-[#CBD5E1] dark:border-[#334155] rounded-md text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
                Nenhum arquivo enviado para este cliente ainda.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {clientFiles.map((file) => {
                  const isImage = file.contentType.startsWith('image/');
                  return (
                    <div
                      key={file.id}
                      className="p-3 bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-md flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {isImage ? (
                          <PrivateImage
                            fileId={file.id}
                            alt={file.originalFileName}
                            className="w-12 h-12 shrink-0 object-cover rounded border border-[#CBD5E1] dark:border-[#334155]"
                          />
                        ) : (
                          <div className="w-12 h-12 shrink-0 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded flex items-center justify-center text-red-600">
                            <span className="font-bold text-[10px]">PDF</span>
                          </div>
                        )}

                        <div className="overflow-hidden">
                          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate" title={file.originalFileName}>
                            {file.originalFileName}
                          </p>
                          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                            {(file.size / 1024).toFixed(0)} KB • {new Date(file.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                          {!isImage && (
                            <div className="mt-1">
                              <PdfViewerButton fileId={file.id} label="Abrir Laudo" size="sm" />
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded transition shrink-0"
                        title="Excluir arquivo do Cloudflare R2"
                        aria-label="Excluir arquivo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button variant="secondary" onClick={() => setShowFilesModal(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};