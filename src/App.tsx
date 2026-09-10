import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { NutritionistsPage } from './pages/NutritionistsPage';
import { ArtsPage } from './pages/ArtsPage';
import { VisitsPage } from './pages/VisitsPage';
import { NonConformitiesPage } from './pages/NonConformitiesPage';
import { ChecklistsPage } from './pages/ChecklistsPage';
import { BillingPage } from './pages/BillingPage';
import { BillingSuccessPage } from './pages/BillingSuccessPage';
import { ProfilePage } from './pages/ProfilePage';
import { FoodLabelsPage } from './pages/FoodLabelsPage';
import { CreateFoodLabelPage } from './pages/CreateFoodLabelPage';
import { ValidityRulesPage } from './pages/ValidityRulesPage';
import { PublicLabelVerifyPage } from './pages/PublicLabelVerifyPage';
import { SoftwareNutricionistasPage } from './pages/public/SoftwareNutricionistasPage';
import { SoftwareRtPage } from './pages/public/SoftwareRtPage';
import { SoftwareConsultoriaPage } from './pages/public/SoftwareConsultoriaPage';
import { GestaoConsultoriaPage } from './pages/public/GestaoConsultoriaPage';
import { AuditoriaPage } from './pages/public/AuditoriaPage';
import { ChecklistRdc216Page } from './pages/public/ChecklistRdc216Page';
import { PlanoAcao5w2hPage } from './pages/public/PlanoAcao5w2hPage';
import { EtiquetagemPage } from './pages/public/EtiquetagemPage';
import { PrecosPublicPage } from './pages/public/PrecosPublicPage';
import { SobrePage } from './pages/public/SobrePage';
import { ContatoPage } from './pages/public/ContatoPage';
import { SegurancaPage } from './pages/public/SegurancaPage';
import { PrivacidadePublicPage } from './pages/public/PrivacidadePublicPage';
import { TermosPublicPage } from './pages/public/TermosPublicPage';
import { BlogIndexPage } from './pages/public/BlogIndexPage';
import { BlogPostPage } from './pages/public/BlogPostPage';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedLayout: React.FC = () => {
  const token = localStorage.getItem('praxis_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50/50 dark:bg-[#020617]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Public SEO & GEO Landing Pages (Section 6) */}
          <Route path="/software-para-nutricionistas" element={<SoftwareNutricionistasPage />} />
          <Route path="/software-para-nutricionistas/" element={<SoftwareNutricionistasPage />} />
          
          <Route path="/software-para-nutricionista-rt" element={<SoftwareRtPage />} />
          <Route path="/software-para-nutricionista-rt/" element={<SoftwareRtPage />} />
          
          <Route path="/software-para-consultoria-de-alimentos" element={<SoftwareConsultoriaPage />} />
          <Route path="/software-para-consultoria-de-alimentos/" element={<SoftwareConsultoriaPage />} />
          
          <Route path="/gestao-de-consultoria-de-alimentos" element={<GestaoConsultoriaPage />} />
          <Route path="/gestao-de-consultoria-de-alimentos/" element={<GestaoConsultoriaPage />} />
          
          <Route path="/auditoria-de-seguranca-dos-alimentos" element={<AuditoriaPage />} />
          <Route path="/auditoria-de-seguranca-dos-alimentos/" element={<AuditoriaPage />} />
          
          <Route path="/checklist-rdc-216" element={<ChecklistRdc216Page />} />
          <Route path="/checklist-rdc-216/" element={<ChecklistRdc216Page />} />
          
          <Route path="/plano-de-acao-5w2h" element={<PlanoAcao5w2hPage />} />
          <Route path="/plano-de-acao-5w2h/" element={<PlanoAcao5w2hPage />} />
          
          <Route path="/etiquetagem-de-alimentos" element={<EtiquetagemPage />} />
          <Route path="/etiquetagem-de-alimentos/" element={<EtiquetagemPage />} />

          {/* Public Institutional Pages */}
          <Route path="/precos" element={<PrecosPublicPage />} />
          <Route path="/precos/" element={<PrecosPublicPage />} />
          
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/sobre/" element={<SobrePage />} />
          
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/contato/" element={<ContatoPage />} />
          
          <Route path="/seguranca" element={<SegurancaPage />} />
          <Route path="/seguranca/" element={<SegurancaPage />} />
          
          <Route path="/privacidade" element={<PrivacidadePublicPage />} />
          <Route path="/privacidade/" element={<PrivacidadePublicPage />} />
          
          <Route path="/termos" element={<TermosPublicPage />} />
          <Route path="/termos/" element={<TermosPublicPage />} />

          {/* Blog Routes */}
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/:slug/" element={<BlogPostPage />} />

          {/* Public QR Code Verification Routes (No Auth Required) */}
          <Route path="/public/labels/:token" element={<PublicLabelVerifyPage />} />
          <Route path="/l/:token" element={<PublicLabelVerifyPage />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/nutritionists" element={<NutritionistsPage />} />
            <Route path="/arts" element={<ArtsPage />} />
            <Route path="/visits" element={<VisitsPage />} />
            <Route path="/non-conformities" element={<NonConformitiesPage />} />
            <Route path="/checklists" element={<ChecklistsPage />} />
            <Route path="/etiquetagem" element={<FoodLabelsPage />} />
            <Route path="/etiquetagem/nova" element={<CreateFoodLabelPage />} />
            <Route path="/etiquetagem/regras" element={<ValidityRulesPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/billing/success" element={<BillingSuccessPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
