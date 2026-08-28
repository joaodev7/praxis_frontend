import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, Building2, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin@nutrivida.com');
  const [password, setPassword] = useState('Praxis@123');
  const [tenantName, setTenantName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
        navigate('/');
      } else {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('praxis_token', data.token);
        localStorage.setItem('praxis_user', JSON.stringify(data.user));
        localStorage.setItem('praxis_tenant', JSON.stringify(data.tenant));
        navigate('/');
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
            src="/assets/Logo_PRAXIS_com_fluxo_azul.png"
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
                  placeholder="Ex: NutriVida Assessoria"
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
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Senha de Acesso</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1E293B] border border-[#334155] text-white rounded-sm px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

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
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#60A5FA] hover:text-[#93C5FD] font-medium transition-colors cursor-pointer"
          >
            {isRegister ? 'Já possui conta? Clique para fazer login' : 'Primeira vez? Cadastre sua empresa de nutrição'}
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-[#334155]/60 text-center">
          <p className="text-[11px] text-[#64748B]">
            Acesso demo inicial: <span className="text-[#94A3B8] font-mono">admin@nutrivida.com</span> / <span className="text-[#94A3B8] font-mono">Praxis@123</span>
          </p>
        </div>
      </div>
    </div>
  );
};