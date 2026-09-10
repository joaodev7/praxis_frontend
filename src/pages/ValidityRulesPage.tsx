import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  Plus,
  ArrowLeft,
  Trash2,
  ShieldCheck,
  Thermometer,
  Clock,
  Layers,
  BookOpen,
  Info
} from 'lucide-react';
import { foodLabelService } from '../services/foodLabelService';
import api from '../services/api';
import {
  ValidityRuleDto,
  CreateValidityRuleRequest,
  LabelOperationType,
  LabelType,
  StorageCondition,
  ValidityUnit
} from '../types/foodLabel';
import { Unit } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const ValidityRulesPage: React.FC = () => {
  const navigate = useNavigate();

  const [rules, setRules] = useState<ValidityRuleDto[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterUnitId, setFilterUnitId] = useState<string>('');

  // Modal: Nova Regra
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [operationType, setOperationType] = useState<LabelOperationType | ''>('Preparation');
  const [storageCondition, setStorageCondition] = useState<StorageCondition | ''>('Refrigerated');
  const [maxTemperature, setMaxTemperature] = useState<number | ''>(4);
  const [validityValue, setValidityValue] = useState<number>(3);
  const [validityUnit, setValidityUnit] = useState<ValidityUnit>('Days');
  const [technicalBasis, setTechnicalBasis] = useState('POP interno de conservação sob refrigeração');
  const [regulatoryReference, setRegulatoryReference] = useState('RDC ANVISA 216/2004 Art. 4.8.15');
  const [allowManual, setAllowManual] = useState(true);

  useEffect(() => {
    loadUnits();
    loadRules();
  }, [filterCategory, filterUnitId]);

  const loadUnits = async () => {
    try {
      const res = await api.get<Unit[]>('/units');
      setUnits(res.data);
    } catch (err) {
      console.error('Erro ao carregar unidades:', err);
    }
  };

  const loadRules = async () => {
    setLoading(true);
    try {
      const list = await foodLabelService.getValidityRules(
        filterUnitId || undefined,
        filterCategory || undefined
      );
      setRules(list);
    } catch (err) {
      console.error('Erro ao carregar regras de validade:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Informe o nome da regra.');
      return;
    }
    if (validityValue <= 0) {
      alert('O prazo de validade deve ser maior que zero.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateValidityRuleRequest = {
        name: name.trim(),
        description: description.trim() || null,
        productCategory: category.trim() || null,
        unitId: selectedUnitId || null,
        productId: null,
        labelType: null,
        operationType: operationType ? (operationType as LabelOperationType) : null,
        storageCondition: storageCondition ? (storageCondition as StorageCondition) : null,
        maximumTemperature: maxTemperature === '' ? null : Number(maxTemperature),
        validityValue,
        validityUnit,
        allowManualExpiration: allowManual,
        requiresTechnicalBasis: true,
        technicalBasis: technicalBasis.trim() || null,
        regulatoryReference: regulatoryReference.trim() || null,
      };

      await foodLabelService.createValidityRule(payload);
      setShowCreateModal(false);
      resetForm();
      loadRules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cadastrar regra.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Deseja desativar esta regra de validade? Etiquetas existentes manterão o histórico intacto.')) {
      return;
    }

    try {
      await foodLabelService.deleteValidityRule(id);
      loadRules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao excluir regra.');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setSelectedUnitId('');
    setOperationType('Preparation');
    setStorageCondition('Refrigerated');
    setMaxTemperature(4);
    setValidityValue(3);
    setValidityUnit('Days');
    setTechnicalBasis('POP interno de conservação sob refrigeração');
    setRegulatoryReference('RDC ANVISA 216/2004 Art. 4.8.15');
    setAllowManual(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              Regras Técnicas de Validade
            </h1>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
              Parametrização sanitária de prazos segundo a RDC 216/2004, normas locais e POPs da consultoria.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Regra de Validade
        </Button>
      </div>

      {/* Info Alert Box */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
          <p className="font-semibold">
            Hierarquia de Cálculo de Validade no PRAXIS:
          </p>
          <p>
            O motor resolve regras na seguinte ordem de prioridade: <strong>1.</strong> Regra Específica do Produto na Unidade → <strong>2.</strong> Regra do Produto no Catálogo → <strong>3.</strong> Categoria de Alimento na Unidade → <strong>4.</strong> Categoria Geral → <strong>5.</strong> Regra Geral da Unidade → <strong>6.</strong> Regra Geral da Consultoria.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 flex flex-wrap gap-4 items-center">
        <div className="w-full sm:w-56">
          <select
            value={filterUnitId}
            onChange={(e) => setFilterUnitId(e.target.value)}
            className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
          >
            <option value="">Todas as Unidades (e Globais)</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-56">
          <input
            type="text"
            placeholder="Filtrar por categoria..."
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
          />
        </div>

        {(filterUnitId || filterCategory) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterUnitId('');
              setFilterCategory('');
            }}
            className="text-xs"
          >
            Limpar Filtros
          </Button>
        )}
      </Card>

      {/* Rules Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#64748B]">Carregando regras de validade...</div>
        ) : rules.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <SlidersHorizontal className="w-12 h-12 text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Nenhuma regra cadastrada
            </h3>
            <p className="text-sm text-[#64748B] max-w-md mx-auto">
              Configure as regras de validade que orientam automaticamente os operadores da cozinha ao gerar etiquetas.
            </p>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="bg-[#2563EB]"
            >
              <Plus className="w-4 h-4 mr-1" /> Cadastrar Primeira Regra
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#0F172A] dark:text-[#F8FAFC]">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-xs font-semibold uppercase text-[#64748B] border-b border-[#CBD5E1] dark:border-[#334155]">
                <tr>
                  <th className="py-3 px-4">Nome da Regra</th>
                  <th className="py-3 px-4">Categoria / Escopo</th>
                  <th className="py-3 px-4">Operação</th>
                  <th className="py-3 px-4">Conservação / Temp.</th>
                  <th className="py-3 px-4">Prazo</th>
                  <th className="py-3 px-4">Base Técnica / Legal</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#334155]">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold">
                      <div>{r.name}</div>
                      {r.description && (
                        <div className="text-xs font-normal text-[#64748B]">{r.description}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {r.productCategory ? (
                        <Badge variant="primary" size="sm">
                          {r.productCategory}
                        </Badge>
                      ) : (
                        <span className="text-[#64748B]">Geral</span>
                      )}
                      <div className="text-[11px] text-[#64748B] mt-0.5">
                        {r.unitName ? `Unidade: ${r.unitName}` : 'Global (Tenant)'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {r.operationType ? r.operationType : 'Qualquer operação'}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div>{r.storageCondition ? r.storageCondition : 'Qualquer'}</div>
                      {r.maximumTemperature !== null && r.maximumTemperature !== undefined && (
                        <div className="text-slate-500 font-mono text-[11px]">
                          ≤ {r.maximumTemperature} °C
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-xs text-[#2563EB] dark:text-blue-400">
                        {r.validityValue}{' '}
                        {r.validityUnit === 'Hours'
                          ? 'Hora(s)'
                          : r.validityUnit === 'Days'
                          ? 'Dia(s)'
                          : r.validityUnit === 'Weeks'
                          ? 'Semana(s)'
                          : 'Mês(es)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#64748B]">
                      <div>{r.regulatoryReference || '—'}</div>
                      <div className="text-[11px]">{r.technicalBasis}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(r.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50"
                        title="Desativar Regra"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Nova Regra */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Cadastrar Regra de Validade"
      >
        <form onSubmit={handleCreateRule} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome da Regra *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Alimentos Cozidos Refrigerados (RDC 216)"
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Categoria de Alimento</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex.: Carnes, Sobremesas..."
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Unidade Específica (Opcional)</label>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              >
                <option value="">Aplicar a todas as Unidades (Global)</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Tipo de Operação</label>
              <select
                value={operationType}
                onChange={(e) => setOperationType(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              >
                <option value="">Qualquer Operação</option>
                <option value="Preparation">Preparo</option>
                <option value="Opening">Abertura de Embalagem</option>
                <option value="Portioning">Fracionamento</option>
                <option value="Defrosting">Descongelamento</option>
                <option value="PrePreparation">Pré-preparo</option>
                <option value="Storage">Armazenamento</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Condição de Armazenamento</label>
              <select
                value={storageCondition}
                onChange={(e) => setStorageCondition(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              >
                <option value="">Qualquer Condição</option>
                <option value="Refrigerated">Refrigerado</option>
                <option value="Frozen">Congelado</option>
                <option value="Ambient">Temperatura Ambiente</option>
                <option value="Heated">Aquecido / Estufa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Temp. Limite (°C)</label>
              <input
                type="number"
                step="0.5"
                value={maxTemperature}
                onChange={(e) => setMaxTemperature(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex.: 4"
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Prazo de Validade *</label>
              <input
                type="number"
                min="1"
                required
                value={validityValue}
                onChange={(e) => setValidityValue(parseInt(e.target.value) || 1)}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Unidade de Tempo *</label>
              <select
                value={validityUnit}
                onChange={(e) => setValidityUnit(e.target.value as any)}
                className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
              >
                <option value="Hours">Horas</option>
                <option value="Days">Dias</option>
                <option value="Weeks">Semanas</option>
                <option value="Months">Meses</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Referência Regulatória</label>
            <input
              type="text"
              value={regulatoryReference}
              onChange={(e) => setRegulatoryReference(e.target.value)}
              placeholder="Ex.: RDC ANVISA 216/2004, Portaria CVS-5/2013..."
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Base Técnica / Justificativa</label>
            <input
              type="text"
              value={technicalBasis}
              onChange={(e) => setTechnicalBasis(e.target.value)}
              placeholder="Ex.: Determinado pelo RT com base em laudo microbiológico / POP..."
              className="w-full text-sm rounded-lg border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A] p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="bg-[#2563EB]"
            >
              {submitting ? 'Salvando...' : 'Cadastrar Regra'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
