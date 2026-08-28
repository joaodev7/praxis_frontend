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

          {/* Protected Application Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/nutritionists" element={<NutritionistsPage />} />
            <Route path="/arts" element={<ArtsPage />} />
            <Route path="/visits" element={<VisitsPage />} />
            <Route path="/non-conformities" element={<NonConformitiesPage />} />
            <Route path="/checklists" element={<ChecklistsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
