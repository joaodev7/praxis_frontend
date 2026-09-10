import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag,
  ArrowLeft,
  Printer,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Thermometer,
  Layers,
  FileText,
  Plus,
  QrCode
} from 'lucide-react';
import { foodLabelService } from '../services/foodLabelService';
import api from '../services/api';
import {
  ProductDto,
  ProductBatchDto,
  LabelOperationType,
  LabelType,
  StorageCondition,
  SimulateValidityResponse
} from '../types/foodLabel';
import { Unit } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const CreateFoodLabelPage: React.FC = () => {
  const navigate = useNavigate();

  // Reference data
  const [units, setUnits] = useState<Unit[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [batches, setBatches] = useState<ProductBatchDto[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form Fields
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [operationType, setOperationType] = useState<LabelOperationType>('Preparation');
  const [labelType, setLabelType] = useState<LabelType>('PreparedFood');
  const [description, setDescription] = useState<string>('');
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('Refrigerated');
  const [storageTemperatureMax, setStorageTemperatureMax] = useState<number | ''>(4);
  const [storageInstructions, setStorageInstructions] = useState<string>('');
  
  // Format local ISO datetime string (yyyy-MM-ddTHH:mm)
  const nowStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const [operationDateTime, setOperationDateTime] = useState<string>(nowStr);

  // Manual Expiration Fields (when no rule matches or user overrides)
  const [manualExpirationDate, setManualExpirationDate] = useState<string>('');
  const [manualJustification, setManualJustification] = useState<string>('');
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Print Options
  const [printCopies, setPrintCopies] = useState<number>(1);
  const [templateType, setTemplateType] = useState<string>('Thermal80x50');

  // Simulation State
  const [simulation, setSimulation] = useState<SimulateValidityResponse | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal: Novo Produto Rápido
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Geral');
  const [creatingProduct, setCreatingProduct] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedUnitId) {
      loadProducts(selectedUnitId);
    }
  }, [selectedUnitId]);

  useEffect(() => {
    if (selectedProductId) {
      loadBatches(selectedProductId);
    } else {
      setBatches([]);
      setSelectedBatchId('');
    }
  }, [selectedProductId]);

  // Dispara simulação de validade sempre que parâmetros operacionais mudam
  useEffect(() => {
    if (selectedUnitId && selectedProductId) {
      runSimulation();
    } else {
      setSimulation(null);
    }
  }, [
    selectedUnitId,
    selectedProductId,
    selectedBatchId,
    operationType,
    labelType,
    storageCondition,
    storageTemperatureMax,
    operationDateTime
  ]);

  const loadInitialData = async () => {
    try {
      const resUnits = await api.get<Unit[]>('/units');
      setUnits(resUnits.data);
      if (resUnits.data.length > 0) {
        setSelectedUnitId(resUnits.data[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const loadProducts = async (unitId: string) => {
    try {
      const list = await foodLabelService.getProducts(unitId);
      setProducts(list);
      if (list.length > 0 && !selectedProductId) {
        setSelectedProductId(list[0].id);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  const loadBatches = async (productId: string) => {
    try {
      const list = await foodLabelService.getProductBatches(productId);
      setBatches(list);
    } catch (err) {
      console.error('Erro ao carregar lotes do produto:', err);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const sim = await foodLabelService.simulateValidity({
        unitId: selectedUnitId,
        productId: selectedProductId,
        labelType,
        operationType,
        storageCondition,
        storageTemperature: storageTemperatureMax === '' ? null : Number(storageTemperatureMax),
        startAt: new Date(operationDateTime).toISOString(),
        productBatchId: selectedBatchId || null
      });
      setSimulation(sim);
    } catch (err) {
      console.error('Erro na simulação de validade:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleCreateQuickProduct = async () => {
    if (!newProductName.trim()) {
      alert('Informe o nome do alimento.');
      return;
    }

    setCreatingProduct(true);
    try {
      const prod = await foodLabelService.createProduct({
        unitId: selectedUnitId || null,
        name: newProductName.trim(),
        category: newProductCategory.trim()
      });
      setShowNewProductModal(false);
      setNewProductName('');
      await loadProducts(selectedUnitId);
      setSelectedProductId(prod.id);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cadastrar produto.');
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUnitId || !selectedProductId) {
      alert('Selecione a Unidade e o Alimento.');
      return;
    }

    const needsManual = (!simulation || !simulation.ruleMatched) || isManualOverride;
    if (needsManual && !manualExpirationDate) {
      alert('Como não há regra de validade compatível (ou foi solicitado ajuste manual), você deve informar a Data de Validade.');
      return;
    }

    if (needsManual && !manualJustification.trim()) {
      alert('Informe a justificativa técnica para a validade manual (ex.: POP interno, recomendação do RT, etc.).');
      return;
    }

    setSubmitting(true);
    try {
      const created = await foodLabelService.createLabel({
        unitId: selectedUnitId,
        productId: selectedProductId,
        productBatchId: selectedBatchId || null,
        labelType,
        operationType,
        description: description || null,
        operationDateTime: new Date(operationDateTime).toISOString(),
        storageCondition,
        storageTemperatureMax: storageTemperatureMax === '' ? null : Number(storageTemperatureMax),
        storageInstructions: storageInstructions || null,
        manualExpirationDate: needsManual && manualExpirationDate ? new Date(manualExpirationDate).toISOString() : null,
        manualJustification: needsManual ? manualJustification : null,
        printCopies,
        templateType
      });

      // Dispara imediatamente o download do PDF
      try {
        const blob = await foodLabelService.downloadLabelPdf(created.id, templateType, printCopies);
        const url = window.URL.createObjectURL(blob);
        const win = window.open(url, '_blank');
        if (!win) {
          const a = document.createElement('a');
          a.href = url;
          a.download = `etiqueta-${created.internalBatchCode}.pdf`;
          a.click();
        }
      } catch (pdfErr) {
        console.error('Etiqueta salva, mas houve erro ao baixar PDF:', pdfErr);
      }

      navigate('/etiquetagem');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao criar etiqueta.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedUnit = units.find((u) => u.id === selectedUnitId);

  // Determina a validade final calculada para o preview
  const finalExpirationDate = isManualOverride && manualExpirationDate
    ? new Date(manualExpirationDate)
    : simulation?.expirationDate
    ? new Date(simulation.expirationDate)
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/etiquetagem')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Nova Etiqueta de Validade
            </h1>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Cálculo automático conforme RDC 216/2004 e geração de lote interno.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Identificação Básica */}
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-slate-800">
              <Layers className="w-4 h-4" />
              1. Unidade e Alimento
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Unidade */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                  Unidade Operacional *
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2.5 text-[#0F172A] dark:text-[#F8FAFC]"
                  required
                >
                  <option value="">Selecione a unidade...</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alimento / Produto */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    Alimento / Produto *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewProductModal(true)}
                    className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Novo
                  </button>
                </div>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2.5 text-[#0F172A] dark:text-[#F8FAFC]"
                  required
                >
                  <option value="">Selecione o alimento...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.category ? `(${p.category})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lote Original do Fornecedor (Opcional) */}
            {batches.length > 0 && (
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                  Lote de Origem do Fabricante (Opcional)
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2.5 text-[#0F172A] dark:text-[#F8FAFC]"
                >
                  <option value="">Nenhum / Lote não informado</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      Lote {b.batchCode} {b.originalExpirationDate ? `(Val: ${new Date(b.originalExpirationDate).toLocaleDateString()})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Card>

          {/* Card 2: Operação e Armazenamento */}
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-slate-800">
              <Thermometer className="w-4 h-4" />
              2. Operação e Condições Térmicas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tipo de Operação */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                  Tipo de Operação *
                </label>
                <select
                  value={operationType}
                  onChange={(e) => {
                    const op = e.target.value as LabelOperationType;
                    setOperationType(op);
                    if (op === 'Preparation') setLabelType('PreparedFood');
                    else if (op === 'Opening') setLabelType('OpenedProduct');
                    else if (op === 'Portioning') setLabelType('PortionedProduct');
                    else if (op === 'PrePreparation') setLabelType('PrePreparation');
                  }}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2.5 text-[#0F172A] dark:text-[#F8FAFC]"
                >
                  <option value="Preparation">Preparo (Alimento Pronto / Cozido)</option>
                  <option value="Opening">Abertura de Embalagem Industrial</option>
                  <option value="Portioning">Fracionamento / Porcionamento</option>
                  <option value="Defrosting">Descongelamento sob Refrigeração</option>
                  <option value="PrePreparation">Pré-preparo (Higienizado / Picado)</option>
                  <option value="Storage">Armazenamento / Insumo</option>
                </select>
              </div>

              {/* Data e Hora da Operação */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                  Data e Hora da Manipulação *
                </label>
                <input
                  type="datetime-local"
                  value={operationDateTime}
                  onChange={(e) => setOperationDateTime(e.target.value)}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2.5 text-[#0F172A] dark:text-[#F8FAFC]"
                  required
                />
              </div>

              {/* Condição de Armazenamento */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                  Condição de Armazenamento *
                </label>
                <select
                  value={storageCondition}
                  onChange={(e) => {
                    const sc = e.target.value as StorageCondition;
                    setStorageCondition(sc);
                    if (sc === 'Refrigerated') setStorageTemperatureMax(4);
                    else if (sc === 'Frozen') setStorageTemperatureMax(-18);
                    else if (sc === 'Heated') setStorageTemperatureMax(60);
                    else setStorageTemperatureMax('');
                  }}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2.5 text-[#0F172A] dark:text-[#F8FAFC]"
                >
                  <option value="Refrigerated">Refrigerado (0 °C a 4 °C)</option>
                  <option value="Frozen">Congelado (≤ -18 °C)</option>
                  <option value="Ambient">Temperatura Ambiente</option>
                  <option value="Heated">Aquecido / Estufa (≥ 60 °C)</option>
                  <option value="Other">Outro</option>
                </select>
              </div>

              {/* Temperatura Máxima */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                  Temperatura Limite (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Ex.: 4"
                  value={storageTemperatureMax}
                  onChange={(e) => setStorageTemperatureMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2.5 text-[#0F172A] dark:text-[#F8FAFC]"
                />
              </div>
            </div>

            {/* Descrição Adicional / Observação */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                Instrução Adicional ou Descrição do Lote (Opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex.: Molho bolonhesa sem lactose, corte em cubos..."
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2.5 text-[#0F172A] dark:text-[#F8FAFC]"
              />
            </div>
          </Card>

          {/* Card 3: Motor de Validade & Justificativa */}
          <Card className="p-5 space-y-4 border-l-4 border-l-[#2563EB]">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                3. Cálculo e Regra de Validade
              </h2>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#64748B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isManualOverride}
                  onChange={(e) => setIsManualOverride(e.target.checked)}
                  className="rounded text-[#2563EB]"
                />
                Definir validade manual
              </label>
            </div>

            {/* Resultado do Motor */}
            {simulating ? (
              <div className="text-xs text-[#64748B] py-2">Consultando regras ativas...</div>
            ) : simulation?.ruleMatched && !isManualOverride ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Regra Regulamentar Identificada: {simulation.ruleName}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400">
                  {simulation.explanation}
                </div>
                {simulation.regulatoryReference && (
                  <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    Base Legal: {simulation.regulatoryReference}
                  </div>
                )}
                <div className="pt-1 flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    Validade Calculada:
                  </span>
                  <span className="text-base font-black text-rose-600 dark:text-rose-400">
                    {new Date(simulation.expirationDate).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  {isManualOverride
                    ? 'Ajuste Manual Solicitado pelo Operador'
                    : 'Nenhuma regra automática encontrada para este alimento'}
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Por segurança sanitária, o PRAXIS nunca gera validade arbitrária. Informe a data determinada e a justificativa técnica auditável.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                      Data de Validade Determinada *
                    </label>
                    <input
                      type="datetime-local"
                      value={manualExpirationDate}
                      onChange={(e) => setManualExpirationDate(e.target.value)}
                      className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                      Justificativa Técnica / Base Legal *
                    </label>
                    <input
                      type="text"
                      value={manualJustification}
                      onChange={(e) => setManualJustification(e.target.value)}
                      placeholder="Ex.: Critério do RT baseado em laudo / POP nº 12"
                      className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Live Thermal Sticker Preview & Print Action (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="p-5 space-y-4 sticky top-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#2563EB] flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Pré-visualização da Etiqueta
              </span>
              <span className="text-[10px] font-mono text-[#64748B] uppercase">
                {templateType === 'Thermal80x50' ? '80 x 50 mm' : templateType === 'Thermal50x30' ? '50 x 30 mm' : 'A4'}
              </span>
            </h2>

            {/* Thermal Label Mockup */}
            <div className="bg-white text-black p-4 rounded-xl border-2 border-dashed border-slate-300 shadow-md font-sans">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-black pb-1 mb-2">
                <div>
                  <div className="text-[10px] font-black text-[#1E40AF]">PRAXIS • RDC 216</div>
                  <div className="text-[9px] font-bold text-slate-600">
                    {selectedUnit?.name || 'Cozinha / Unidade'}
                  </div>
                </div>
                <div className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-slate-200 rounded">
                  {operationType === 'Preparation' ? 'PREPARO' : operationType === 'Opening' ? 'ABERTURA' : 'FRACIONAMENTO'}
                </div>
              </div>

              {/* Food Name */}
              <div className="text-sm font-black uppercase tracking-tight py-1">
                {selectedProduct?.name || 'NOME DO ALIMENTO'}
              </div>

              {/* Data & Validade Box */}
              <div className="grid grid-cols-3 gap-2 my-2 items-center">
                <div className="col-span-2 space-y-1 text-[11px]">
                  <div>
                    <span className="font-bold">Manipulação: </span>
                    {new Date(operationDateTime).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <div className="bg-red-50 border border-red-300 p-1.5 rounded">
                    <div className="text-[9px] font-bold text-red-700 uppercase">Validade Limite:</div>
                    <div className="text-xs font-black text-red-800">
                      {finalExpirationDate
                        ? finalExpirationDate.toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Definir validade'}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold">Conservação: </span>
                    {storageCondition === 'Refrigerated' ? 'Refrigerado' : storageCondition === 'Frozen' ? 'Congelado' : 'Ambiente'}
                    {storageTemperatureMax !== '' ? ` (≤ ${storageTemperatureMax}°C)` : ''}
                  </div>

                  <div>
                    <span className="font-bold">Lote: </span>
                    <span className="font-mono font-bold">PREP-20260910-0001</span>
                  </div>
                </div>

                {/* QR Code Mockup */}
                <div className="flex flex-col items-center justify-center p-1 border border-slate-200 rounded bg-slate-50">
                  <QrCode className="w-14 h-14 text-black" />
                  <span className="text-[8px] text-slate-500 mt-1 font-semibold">Validação</span>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 pt-1 flex justify-between text-[8px] text-slate-400">
                <span>Rastreabilidade PRAXIS</span>
                <span>Auditável pelo RT</span>
              </div>
            </div>

            {/* Print Settings */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                    Modelo
                  </label>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    className="w-full text-xs rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
                  >
                    <option value="Thermal80x50">Térmica 80x50 mm</option>
                    <option value="Thermal50x30">Térmica 50x30 mm</option>
                    <option value="SheetA4">Folha A4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
                    Cópias
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={printCopies}
                    onChange={(e) => setPrintCopies(parseInt(e.target.value) || 1)}
                    className="w-full text-xs rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <Printer className="w-4 h-4" />
                {submitting ? 'Gerando Etiqueta...' : 'Gerar e Imprimir Etiqueta'}
              </Button>
            </div>
          </Card>
        </div>
      </form>

      {/* Modal: Novo Produto Rápido */}
      <Modal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        title="Cadastrar Novo Alimento / Produto"
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
              Nome do Alimento *
            </label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Ex.: Carne Moída Cozida, Molho Pesto..."
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#0F172A] dark:text-[#F8FAFC]">
              Categoria
            </label>
            <input
              type="text"
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value)}
              placeholder="Ex.: Carnes, Aves, Molhos, Sobremesas..."
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowNewProductModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateQuickProduct}
              disabled={creatingProduct}
              className="bg-[#2563EB]"
            >
              {creatingProduct ? 'Salvando...' : 'Salvar Alimento'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
