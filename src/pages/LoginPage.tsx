import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, Building2, LogIn, ArrowRight, ShieldCheck, FileText, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [adminName, setAdminName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const openForgotModal = () => {
    setForgotEmail(email);
    setForgotError('');
    setForgotSuccess(false);
    setShowForgotModal(true);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSuccess(true);
    } catch (err: any) {
      setForgotError(err.response?.data?.message || 'Falha ao solicitar redefinição. Tente novamente.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister && !acceptTerms) {
      setError('É necessário concordar com os Termos de Uso e a Política de Privacidade para criar uma conta.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data } = await api.post('/auth/register-tenant', {
          tenantName,
          legalName: tenantName,
          cnpj,
          adminName,
          adminEmail: email,
          adminPassword: password,
        });
        localStorage.setItem('praxis_token', data.token);
        localStorage.setItem('praxis_user', JSON.stringify(data.user));
        localStorage.setItem('praxis_tenant', JSON.stringify(data.tenant));
        navigate('/dashboard');
      } else {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('praxis_token', data.token);
        localStorage.setItem('praxis_user', JSON.stringify(data.user));
        localStorage.setItem('praxis_tenant', JSON.stringify(data.tenant));
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-lg shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <img
            src="/assets/Logo_PRAXIS_com_fluxo_azul.webp"
            alt="PRAXIS Logo"
            className="h-12 mx-auto mb-3 object-contain"
          />
          <p className="text-[10px] font-bold text-[#94A3B8] tracking-widest uppercase">
            INTELIGÊNCIA EM <span className="text-[#60A5FA]">AÇÃO</span>
          </p>
          <p className="text-xs text-[#94A3B8] mt-2">
            {isRegister ? 'Cadastre sua Empresa de Nutrição' : 'Plataforma de Gestão de Responsabilidade Técnica'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Empresa de Nutrição</label>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Ex: Consultoria Nutricional"
                  className="w-full bg-[#1E293B] border border-[#334155] text-white rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">CNPJ</label>
                <input
                  type="text"
                  required
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-[#1E293B] border border-[#334155] text-white rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Nome do Administrador / RT</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Dra. Jamily Pinto"
                  className="w-full bg-[#1E293B] border border-[#334155] text-white rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">E-mail Corporativo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@empresa.com"
              className="w-full bg-[#1E293B] border border-[#334155] text-white rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase">Senha de Acesso</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="text-xs text-[#60A5FA] hover:text-[#93C5FD] transition-colors cursor-pointer"
                >
                  Esqueceu sua senha?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1E293B] border border-[#334155] text-white rounded-sm px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                required
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-600 bg-[#1E293B] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-[#94A3B8] leading-tight select-none">
                Declaro que li e concordo com os{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-[#60A5FA] underline hover:text-[#93C5FD] cursor-pointer font-medium"
                >
                  Termos de Uso
                </button>{' '}
                e a{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-[#60A5FA] underline hover:text-[#93C5FD] cursor-pointer font-medium"
                >
                  Política de Privacidade (LGPD)
                </button>.
              </label>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2 !py-2.5"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {isRegister ? 'Criar Conta e Acessar' : 'Entrar no Sistema'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-[#60A5FA] hover:text-[#93C5FD] font-medium transition-colors cursor-pointer"
          >
            {isRegister ? 'Já possui conta? Clique para fazer login' : 'Primeira vez? Cadastre sua empresa de nutrição'}
          </button>
        </div>

        <div className="mt-6 pt-3 border-t border-[#334155]/60 flex items-center justify-center gap-4 text-[11px] text-[#64748B]">
          <button
            onClick={() => setShowTermsModal(true)}
            className="hover:text-[#94A3B8] transition-colors cursor-pointer"
          >
            Termos de Uso
          </button>
          <span>•</span>
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="hover:text-[#94A3B8] transition-colors cursor-pointer"
          >
            Privacidade & LGPD
          </button>
        </div>
      </div>

      {/* Modal Termos de Uso */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Termos de Uso — PRAXIS"
        subtitle="Condições gerais de prestação de serviços e utilização da plataforma"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h4 className="font-bold text-sm text-slate-800 dark:text-white">1. Objeto do Serviço</h4>
          <p>
            O PRAXIS é um software como serviço (SaaS) B2B destinado à gestão de Responsabilidade Técnica (RT),
            acompanhamento de Boas Práticas (RDC ANVISA 216/2004) e emissão de laudos para empresas e profissionais de nutrição.
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">2. Responsabilidade Profissional</h4>
          <p>
            O preenchimento de checklists, anotações de ART e laudos técnicos é de inteira responsabilidade técnica do
            profissional nutricionista devidamente habilitado junto ao Conselho Regional de Nutricionistas (CRN).
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">3. Segurança e Acesso</h4>
          <p>
            O usuário é responsável pela guarda e sigilo de suas credenciais de acesso. O PRAXIS adota protocolos de
            criptografia e isolamento multi-tenant para proteção dos registros.
          </p>
        </div>
      </Modal>

      {/* Modal Política de Privacidade e LGPD */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Política de Privacidade & LGPD"
        subtitle="Conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center gap-3 text-blue-400">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Seus dados são tratados em conformidade estrita com os Artigos 6º, 7º e 18 da LGPD.</span>
          </div>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">1. Dados Pessoais Coletados</h4>
          <p>
            Coletamos apenas dados cadastrais necessários à execução do serviço: Nome, E-mail corporativo, Telefone,
            registro no CRN e dados comerciais dos estabelecimentos atendidos. <strong>Não coletamos dados pessoais sensíveis de saúde individual.</strong>
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">2. Bases Legais e Finalidade</h4>
          <p>
            O tratamento é fundamentado na <strong>Execução de Contrato</strong> (Art. 7º, V) e no <strong>Cumprimento de Obrigação Legal e Regulatória</strong> (Art. 7º, II),
            conforme exigido pelas resoluções do CFN/CRN e normas da ANVISA para guarda de ARTs e relatórios de vistorias técnicas.
          </p>

          <h4 className="font-bold text-sm text-slate-800 dark:text-white">3. Direitos do Titular (Art. 18 da LGPD)</h4>
          <p>
            Você pode a qualquer momento visualizar, corrigir ou solicitar a exportação de seus dados (portabilidade) diretamente
            no painel do sistema ou contatando o encarregado de dados (DPO) através dos canais de suporte.
          </p>
        </div>
      </Modal>

      {/* Modal Recuperação de Senha */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Recuperação de Senha"
        subtitle="Enviaremos um link seguro para o seu e-mail"
        maxWidth="sm"
      >
        {forgotSuccess ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">Solicitação enviada!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Se o e-mail informado estiver cadastrado em nossa base, você receberá as instruções para redefinir sua senha em instantes.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full mt-2"
              onClick={() => setShowForgotModal(false)}
            >
              Entendi
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 pt-1">
            {forgotError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 text-xs rounded-sm">
                {forgotError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#94A3B8] uppercase mb-1">
                E-mail Corporativo
              </label>
              <input
                type="email"
                required
                autoFocus
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-[#334155] text-slate-900 dark:text-white rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
              />
              <p className="text-[11px] text-slate-500 dark:text-[#64748B] mt-1">
                Você receberá uma mensagem com o link para definir uma nova senha.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setShowForgotModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={forgotLoading}
                icon={<Mail className="w-4 h-4" />}
              >
                Enviar link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};