import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Ban,
  ShieldCheck,
  Calendar,
  Clock,
  Thermometer,
  Layers,
  FileCheck
} from 'lucide-react';
import { foodLabelService } from '../services/foodLabelService';
import { FoodLabelPublicDto } from '../types/foodLabel';

export const PublicLabelVerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [label, setLabel] = useState<FoodLabelPublicDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadPublicLabel(token);
    }
  }, [token]);

  const loadPublicLabel = async (tok: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await foodLabelService.getPublicByToken(tok);
      setLabel(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Etiqueta não encontrada ou código inválido.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Validando etiqueta sanitária...
          </p>
        </div>
      </div>
    );
  }

  if (error || !label) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 text-center space-y-4 border border-rose-200 dark:border-rose-900">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Etiqueta Não Encontrada
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error || 'Não foi possível verificar a autenticidade desta etiqueta. O lote pode ter sido excluído ou o QR Code está corrompido.'}
          </p>
        </div>
      </div>
    );
  }

  const isExpired = label.isExpired || label.status === 'Expired';
  const isCancelled = label.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 text-xl font-black tracking-wider">
            <span className="text-slate-900 dark:text-white">PRAX</span>
            <span className="text-blue-600">IS</span>
          </div>
          <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Sistema de Rastreabilidade e Gestão de Validade
          </p>
        </div>

        {/* Status Card */}
        <div
          className={`rounded-2xl p-5 text-center shadow-lg border ${
            isCancelled
              ? 'bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200'
              : isExpired
              ? 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-200'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200'
          }`}
        >
          <div className="flex justify-center mb-2">
            {isCancelled ? (
              <Ban className="w-10 h-10 text-slate-500" />
            ) : isExpired ? (
              <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>

          <h2 className="text-lg font-black tracking-tight">
            {isCancelled
              ? 'ETIQUETA CANCELADA'
              : isExpired
              ? 'PRODUTO COM VALIDADE VENCIDA'
              : 'PRODUTO DENTRO DA VALIDADE'}
          </h2>
          <p className="text-xs opacity-90 mt-0.5 font-medium">
            {isCancelled
              ? 'Este lote foi cancelado ou substituído pelo Responsável Técnico.'
              : isExpired
              ? 'Atenção: Este alimento deve ser retirado imediatamente de circulação.'
              : 'Alimento próprio para consumo conforme boas práticas sanitárias.'}
          </p>
        </div>

        {/* Product Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Alimento Identificado
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase">
              {label.productName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">
                Lote: {label.internalBatchCode}
              </span>
              <span className="text-xs text-slate-500">
                {label.operationName}
              </span>
            </div>
          </div>

          {/* Grid of Dates & Storage */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Manipulado em:</span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs">
                {new Date(label.validityStartAt).toLocaleString('pt-BR')}
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isExpired
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <Clock className="w-4 h-4" />
                <span>Data Limite de Validade:</span>
              </div>
              <div className="font-black text-sm">
                {new Date(label.expirationDate).toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
                <Thermometer className="w-4 h-4 text-blue-600" />
                <span>Conservação:</span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white text-xs">
                {label.storageCondition}
                {label.storageTemperatureMax !== null && label.storageTemperatureMax !== undefined && (
                  <span> (≤ {label.storageTemperatureMax}°C)</span>
                )}
              </div>
            </div>

            {label.unitName && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Unidade / Cozinha:</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-xs">
                  {label.unitName}
                </div>
              </div>
            )}
          </div>

          {/* Legal Reference & Regulatory Basis */}
          {label.technicalBasis && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    Fundamentação Regulatória:
                  </div>
                  <div>{label.technicalBasis}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Certificado emitido via PRAXIS • Em conformidade com RDC 216/2004</span>
        </div>
      </div>
    </div>
  );
};
