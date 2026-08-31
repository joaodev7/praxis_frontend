import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileCheck2, 
  CalendarDays, 
  AlertTriangle, 
  ListChecks, 
  CreditCard,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('praxis_token');
    localStorage.removeItem('praxis_user');
    localStorage.removeItem('praxis_tenant');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Clientes & Unidades', path: '/clients', icon: Building2 },
    { label: 'Nutricionistas RT', path: '/nutritionists', icon: Users },
    { label: 'ARTs & Registros', path: '/arts', icon: FileCheck2 },
    { label: 'Visitas Técnicas', path: '/visits', icon: CalendarDays },
    { label: 'Não Conformidades', path: '/non-conformities', icon: AlertTriangle },
    { label: 'Checklists (RDC 216)', path: '/checklists', icon: ListChecks },
    { label: 'Assinatura & Planos', path: '/billing', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col h-screen sticky top-0 border-r border-[#CBD5E1] dark:border-[#334155] select-none z-20 transition-colors duration-200">
      {/* Brand Header with Official PRAXIS Blue Symbol */}
      <div className="p-5 border-b border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#0F172A]">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/Simbolo_PRAXIS_azul_em_movimento.webp" 
            alt="PRAXIS Símbolo" 
            className="w-8 h-8 object-contain"
          />
          <div>
            <div className="flex items-center text-lg font-black tracking-wider leading-none">
              <span className="text-[#0F172A] dark:text-[#F8FAFC]">PRAX</span>
              <span className="text-[#2563EB] dark:text-[#3B82F6]">IS</span>
            </div>
            <p className="text-[9px] font-bold text-[#64748B] dark:text-[#94A3B8] tracking-widest uppercase mt-1">
              INTELIGÊNCIA EM <span className="text-[#2563EB] dark:text-[#3B82F6]">AÇÃO</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-1.5 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
          Gestão Operacional
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-sm text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#EFF6FF] dark:bg-blue-500/15 text-[#2563EB] dark:text-[#60A5FA] font-semibold border-l-4 border-[#2563EB] dark:border-[#3B82F6] pl-2'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout / Tenant footer */}
      <div className="p-3 border-t border-[#CBD5E1] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B1120]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold text-[#DC2626] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  );
};