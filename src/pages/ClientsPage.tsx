import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ClientCompany, Unit, StoredFileDto } from '../types';
import { Building2, Plus, Phone, Mail, MapPin, ChevronRight, X, Layers, Image as ImageIcon, Trash2, FolderOpen } from 'lucide-react';
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
  const [selectedClient, setSelectedClient] = useState<ClientCompany | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [clientFiles, setClientFiles] = useState<StoredFileDto[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Client Form
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [responsibleName, setResponsibleName] = useState('');

  // New Unit Form
  const [unitName, setUnitName] = useState('');
  const [unitAddress, setUnitAddress] = useState('');
  const [unitPhone, setUnitPhone] = useState('');
  const [unitResponsible, setUnitResponsible] = useState('');

  useEffect(() => {
    loadData();
  }, []);

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
    if (!confirm('Deseja realmente excluir este arquivo?')) return;
    try {
      await deleteFile(fileId);
      if (selectedClient) {
        loadClientFiles(selectedClient.id);
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir arquivo.');
    }
  };

  const loadData = async () => {
    try {
      const [resClients, resUnits] = await Promise.all([
        api.get('/clients'),
        api.get('/units')
      ]);
      setClients(resClients.data);
      setUnits(resUnits.data);
    } catch (err) {
      console.error('Erro ao carregar clientes/unidades', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/clients', {
        legalName,
        tradeName,
        cnpj,
        email,
        phone,
        address,
        responsibleName
      });
      setShowClientModal(false);
      loadData();
      setLegalName(''); setTradeName(''); setCnpj(''); setEmail(''); setPhone(''); setAddress(''); setResponsibleName('');
    } catch (err) {
      alert('Erro ao cadastrar empresa cliente.');
    }
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      await api.post('/units', {
        clientCompanyId: selectedClient.id,
        name: unitName,
        address: unitAddress,
        phone: unitPhone,
        responsibleName: unitResponsible
      });
      setShowUnitModal(false);
      loadData();
      setUnitName(''); setUnitAddress(''); setUnitPhone(''); setUnitResponsible('');
    } catch (err) {
      alert('Erro ao cadastrar unidade.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Empresas Clientes & Unidades</h2>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Gestão dos estabelecimentos atendidos pela empresa de nutrição.</p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowClientModal(true)}
        >
          Nova Empresa Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => {
          const clientUnits = units.filter(u => u.clientCompanyId === client.id);
          return (
            <Card key={client.id} className="flex flex-col justify-between !p-5">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base">{client.tradeName}</h3>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">{client.legalName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">CNPJ: {client.cnpj}</p>
                  </div>
                  <Badge variant="info" size="sm">
                    {clientUnits.length} unidade(s)
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-[#475569] dark:text-[#94A3B8] mt-4 border-t border-[#CBD5E1] dark:border-[#334155] pt-3">
                  {client.responsibleName && (
                    <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Contato: {client.responsibleName}</p>
                  )}
                  {client.email && (
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-500" /> {client.email}</p>
                  )}
                  {client.phone && (
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-500" /> {client.phone}</p>
                  )}
                </div>

                {/* List of units */}
                <div className="mt-4 pt-3 border-t border-[#CBD5E1] dark:border-[#334155]">
                  <p className="text-[11px] font-bold uppercase text-[#64748B] dark:text-[#94A3B8] mb-2 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" /> Unidades Vinculadas
                  </p>
                  <div className="space-y-1.5">
                    {clientUnits.length > 0 ? (
                      clientUnits.map(u => (
                        <div key={u.id} className="p-2.5 rounded-sm bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-xs flex justify-between items-center">
                          <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{u.name}</span>
                          {u.activeArtNumber && (
                            <span className="text-[10px] text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-blue-950/50 font-mono px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                              {u.activeArtNumber}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic">Nenhuma unidade cadastrada ainda</p>
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
                  onClick={() => { setSelectedClient(client); setShowUnitModal(true); }}
                  className="!text-[#2563EB] dark:!text-[#60A5FA] hover:!bg-[#EFF6FF] dark:hover:!bg-blue-950/30"
                >
                  Adicionar Unidade
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Nova Empresa */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title="Cadastrar Nova Empresa Cliente"
        subtitle="Informe os dados da organização atendida"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <Input
            label="Nome Fantasia"
            required
            value={tradeName}
            onChange={e => setTradeName(e.target.value)}
            placeholder="Ex: Restaurante Sabor Caseiro"
          />
          <Input
            label="Razão Social"
            required
            value={legalName}
            onChange={e => setLegalName(e.target.value)}
            placeholder="Ex: Restaurante Sabor Caseiro Ltda"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CNPJ"
              required
              value={cnpj}
              onChange={e => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
            />
            <Input
              label="Responsável Local"
              value={responsibleName}
              onChange={e => setResponsibleName(e.target.value)}
              placeholder="Nome do contato / gerente"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contato@empresa.com"
            />
            <Input
              label="Telefone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(11) 98888-0000"
            />
          </div>
          <Input
            label="Endereço Principal"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Rua, número, bairro, cidade - UF"
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowClientModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Salvar Empresa
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Nova Unidade */}
      <Modal
        isOpen={showUnitModal && !!selectedClient}
        onClose={() => setShowUnitModal(false)}
        title="Cadastrar Nova Unidade / Filial"
        subtitle={`Empresa: ${selectedClient?.tradeName}`}
      >
        <form onSubmit={handleCreateUnit} className="space-y-4">
          <Input
            label="Nome da Unidade"
            required
            value={unitName}
            onChange={e => setUnitName(e.target.value)}
            placeholder="Ex: Unidade Centro / Cozinha Industrial"
          />
          <Input
            label="Endereço Completo"
            required
            value={unitAddress}
            onChange={e => setUnitAddress(e.target.value)}
            placeholder="Av. Paulista, 1000 - Bela Vista"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Responsável Local"
              value={unitResponsible}
              onChange={e => setUnitResponsible(e.target.value)}
              placeholder="Gerente da loja"
            />
            <Input
              label="Telefone da Unidade"
              value={unitPhone}
              onChange={e => setUnitPhone(e.target.value)}
              placeholder="(11) 3333-2222"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#CBD5E1] dark:border-[#334155]">
            <Button type="button" variant="secondary" onClick={() => setShowUnitModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Cadastrar Unidade
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Arquivos & Fotos (Cloudflare R2) */}
      <Modal
        isOpen={showFilesModal && !!selectedClient}
        onClose={() => setShowFilesModal(false)}
        title={`Arquivos & Fotos — ${selectedClient?.tradeName}`}
        subtitle="Armazenamento seguro de fotos de vistorias, laudos e documentos via Cloudflare R2"
      >
        <div className="space-y-6">
          {/* File Upload Component */}
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

          {/* List of uploaded files */}
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