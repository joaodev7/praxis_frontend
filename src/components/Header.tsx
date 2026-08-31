import React, { useState } from 'react';
import { User, Building2, Sun, Moon, Download, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const user = JSON.parse(localStorage.getItem('praxis_user') || '{}');
  const tenant = JSON.parse(localStorage.getItem('praxis_tenant') || '{}');
  const displayName = (!user.name || user.name.includes('Mariana Silva')) ? 'Dra. Jamily Pinto' : user.name;

  const handleLogout = () => {
    localStorage.removeItem('praxis_token');
    localStorage.removeItem('praxis_user');
    localStorage.removeItem('praxis_tenant');
    navigate('/login');
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const { data } = await api.get('/auth/export-data');
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `praxis_dados_lgpd_${user.name ? user.name.replace(/\s+/g, '_') : 'usuario'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (error) {
      console.error('Erro ao exportar dados LGPD:', error);
      alert('Não foi possível exportar os dados no momento.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#0F172A] border-b border-[#CBD5E1] dark:border-[#334155] px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
          <Building2 className="w-4 h-4 text-[#2563EB] dark:text-[#3B82F6]" />
          <span>{tenant.name || 'Minha Empresa'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* LGPD Portability Button */}
        <button
          onClick={handleExportData}
          disabled={isExporting}
          title="Exportar Meus Dados Pessoais (LGPD Art. 18)"
          className="p-2 rounded-md bg-slate-100 dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-[#CBD5E1] dark:border-[#334155] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden md:inline">{isExporting ? 'Exportando...' : 'Dados LGPD'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
          className="p-2 rounded-md bg-slate-100 dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-[#CBD5E1] dark:border-[#334155] transition-all cursor-pointer flex items-center gap-2 text-xs font-medium"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Modo Escuro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden sm:inline">Modo Claro</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3 border-l border-[#CBD5E1] dark:border-[#334155] pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-none">{displayName}</p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium mt-0.5">
              {user.role === 'TenantAdmin' ? 'Administradora & RT' : user.role || 'Nutricionista RT'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#EFF6FF] dark:bg-blue-500/15 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center font-bold border border-blue-200 dark:border-blue-500/30">
            <User className="w-5 h-5" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Encerrar Sessão"
            className="p-2 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};