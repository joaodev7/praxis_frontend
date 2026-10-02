import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token de recuperação não encontrado ou link inválido.');
      return;
    }

    if (newPassword.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmação de senha não confere com a nova senha.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Link de recuperação expirado ou inválido. Por favor, solicite uma nova redefinição.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0F172A] border border-[#334155] rounded-lg shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <Link to="/login">
            <img
              src="/assets/Logo_PRAXIS_com_fluxo_azul.webp"
              alt="PRAXIS Logo"
              className="h-12 mx-auto mb-3 object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
          <p className="text-[10px] font-bold text-[#94A3B8] tracking-widest uppercase">
            INTELIGÊNCIA EM <span className="text-[#60A5FA]">AÇÃO</span>
          </p>
          <h2 className="text-lg font-bold text-white mt-3">Redefinir Senha</h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Crie uma nova senha de acesso segura para a sua conta.
          </p>
        </div>

        {!token ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-md flex items-start gap-3 text-amber-300 text-xs leading-relaxed">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200">Link incompleto ou inválido</p>
                <p className="mt-1">
                  Não foi identificado nenhum token de verificação no link acessado. Por favor, solicite um novo link de redefinição na tela de login.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              className="w-full !py-2.5"
              onClick={() => navigate('/login')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Voltar para o Login
            </Button>
          </div>
        ) : success ? (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Senha alterada com sucesso!</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Sua credencial de acesso foi atualizada com sucesso. Você já pode acessar a plataforma utilizando a nova senha.
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              className="w-full !py-2.5"
              onClick={() => navigate('/login')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Acessar minha Conta
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-[#1E293B] border border-[#334155] text-white rounded-sm px-3.5 py-2.5 text-sm pr-10 focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">A senha deve ter no mínimo 8 caracteres.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full bg-[#1E293B] border border-[#334155] text-white rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2 !py-2.5"
              icon={<Lock className="w-4 h-4" />}
            >
              Salvar Nova Senha
            </Button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-xs text-[#60A5FA] hover:text-[#93C5FD] font-medium transition-colors"
              >
                Lembrou sua senha? Voltar ao Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
