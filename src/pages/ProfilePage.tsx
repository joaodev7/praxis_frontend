import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Camera, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Shield, 
  ShieldCheck, 
  Download, 
  FileText, 
  Lock, 
  Info 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { profileService } from '../services/profileService';
import { UserProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'lgpd'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tenant = JSON.parse(localStorage.getItem('praxis_tenant') || '{}');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await profileService.getProfile();
      setProfile(data);
      setName(data.name || '');
      setDateOfBirth(data.dateOfBirth || '');

      // Update cached user in localStorage
      const cachedUser = JSON.parse(localStorage.getItem('praxis_user') || '{}');
      const updatedUser = {
        ...cachedUser,
        name: data.name,
        profilePhotoUrl: data.profilePhotoUrl,
      };
      localStorage.setItem('praxis_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('user-profile-updated'));
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Falha ao carregar perfil do usuário.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('O nome é obrigatório.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const updated = await profileService.updateProfile({
        name: name.trim(),
        dateOfBirth: dateOfBirth ? dateOfBirth : null,
      });

      setProfile(updated);
      setName(updated.name);
      setDateOfBirth(updated.dateOfBirth || '');
      setSuccessMessage('Perfil atualizado com sucesso!');

      // Update localStorage & trigger header update
      const cachedUser = JSON.parse(localStorage.getItem('praxis_user') || '{}');
      cachedUser.name = updated.name;
      localStorage.setItem('praxis_user', JSON.stringify(cachedUser));
      window.dispatchEvent(new Event('user-profile-updated'));

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validations
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('A imagem enviada não possui um formato válido. Utilize JPG, PNG ou WebP.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('A imagem deve possuir no máximo 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setUploadingPhoto(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const response = await profileService.uploadPhoto(file);
      setProfile((prev) => (prev ? { ...prev, profilePhotoUrl: response.profilePhotoUrl } : prev));
      setSuccessMessage('Foto de perfil atualizada com sucesso!');

      // Update localStorage & trigger header update
      const cachedUser = JSON.parse(localStorage.getItem('praxis_user') || '{}');
      cachedUser.profilePhotoUrl = response.profilePhotoUrl;
      localStorage.setItem('praxis_user', JSON.stringify(cachedUser));
      window.dispatchEvent(new Event('user-profile-updated'));

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Erro ao enviar foto de perfil:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Erro ao enviar a imagem.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile?.profilePhotoUrl) return;

    const confirmed = window.confirm('Deseja realmente remover sua foto de perfil?');
    if (!confirmed) return;

    try {
      setRemovingPhoto(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await profileService.deletePhoto();
      setProfile((prev) => (prev ? { ...prev, profilePhotoUrl: null } : prev));
      setSuccessMessage('Foto de perfil removida com sucesso!');

      // Update localStorage & trigger header update
      const cachedUser = JSON.parse(localStorage.getItem('praxis_user') || '{}');
      cachedUser.profilePhotoUrl = null;
      localStorage.setItem('praxis_user', JSON.stringify(cachedUser));
      window.dispatchEvent(new Event('user-profile-updated'));

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Erro ao remover foto:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Erro ao remover a foto.');
    } finally {
      setRemovingPhoto(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      setErrorMessage(null);
      setExportSuccessMessage(null);
      const data = await profileService.exportUserData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute(
        'download',
        `praxis_dados_lgpd_${profile?.name ? profile.name.replace(/\s+/g, '_') : 'usuario'}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setExportSuccessMessage('Seus dados pessoais foram exportados com sucesso em formato JSON!');
      setTimeout(() => setExportSuccessMessage(null), 6000);
    } catch (err: any) {
      console.error('Erro ao exportar dados LGPD:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Não foi possível exportar os dados no momento.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-[#2563EB] dark:text-[#3B82F6] animate-spin" />
        <p className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Meu Perfil</h1>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
          Gerencie seus dados cadastrais, preferências e direitos de privacidade (LGPD).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#CBD5E1] dark:border-[#334155] gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 font-semibold text-sm transition-colors relative cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'text-[#2563EB] dark:text-[#3B82F6]'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Dados Cadastrais</span>
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] dark:bg-[#3B82F6]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lgpd')}
          className={`pb-3 font-semibold text-sm transition-colors relative cursor-pointer flex items-center gap-2 ${
            activeTab === 'lgpd'
              ? 'text-[#2563EB] dark:text-[#3B82F6]'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Dados LGPD</span>
          {activeTab === 'lgpd' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] dark:bg-[#3B82F6]" />
          )}
        </button>
      </div>

      {/* Global Notifications */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-md text-emerald-800 dark:text-emerald-200 text-sm font-medium transition-all animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 rounded-md text-rose-800 dark:text-rose-200 text-sm font-medium transition-all animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab 1: Dados Cadastrais */}
      {activeTab === 'profile' && (
        <Card className="space-y-8 animate-fadeIn">
          {/* Photo Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#CBD5E1] dark:border-[#334155]">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 dark:bg-[#1E293B] border-2 border-[#2563EB]/40 dark:border-[#3B82F6]/50 flex items-center justify-center shadow-md">
                {uploadingPhoto || removingPhoto ? (
                  <Loader2 className="w-8 h-8 text-[#2563EB] dark:text-[#3B82F6] animate-spin" />
                ) : profile?.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-14 h-14 text-[#64748B] dark:text-[#94A3B8]" />
                )}
              </div>

              {/* Clickable camera badge */}
              <button
                type="button"
                disabled={uploadingPhoto || removingPhoto}
                onClick={() => fileInputRef.current?.click()}
                title="Alterar foto"
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-[#0F172A] cursor-pointer transition-transform hover:scale-105"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                Foto de Perfil
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Formatos aceitos: JPG, PNG ou WebP. Tamanho máximo permitido: 5 MB.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={<Camera className="w-3.5 h-3.5" />}
                  loading={uploadingPhoto}
                  disabled={uploadingPhoto || removingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingPhoto ? 'Enviando...' : 'Alterar foto'}
                </Button>

                {profile?.profilePhotoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                    loading={removingPhoto}
                    disabled={uploadingPhoto || removingPhoto}
                    onClick={handleRemovePhoto}
                    className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    Remover foto
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information Form */}
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <Input
                label="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
                disabled={saving}
                icon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="E-mail"
                value={profile?.email || ''}
                disabled
                helperText="O e-mail cadastrado é utilizado para autenticação e não pode ser alterado por este formulário."
                icon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div>
              <Input
                label="Data de Nascimento"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={saving}
                max={new Date().toISOString().split('T')[0]}
                helperText="Informe sua data de nascimento (opcional)."
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#CBD5E1] dark:border-[#334155]">
              <Button
                type="submit"
                variant="primary"
                loading={saving}
                disabled={saving || uploadingPhoto}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Dados LGPD */}
      {activeTab === 'lgpd' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Export Success Message */}
          {exportSuccessMessage && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-md text-emerald-800 dark:text-emerald-200 text-sm font-medium transition-all">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{exportSuccessMessage}</span>
            </div>
          )}

          {/* Portability Card */}
          <Card className="space-y-5 border-l-4 border-l-[#2563EB] dark:border-l-[#3B82F6]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-100 dark:bg-blue-950/50 text-[#2563EB] dark:text-[#60A5FA] rounded">
                    Art. 18, Inciso V
                  </span>
                  <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Portabilidade de Dados Pessoais
                  </h2>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Exporte uma cópia completa de todos os seus dados cadastrais e registros operacionais mantidos na plataforma PRAXIS.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#1E293B]/60 rounded-md border border-[#E2E8F0] dark:border-[#334155] space-y-3">
              <p className="text-xs font-semibold text-[#334155] dark:text-[#E2E8F0]">
                O arquivo gerado em formato JSON inclui:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#475569] dark:text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />
                  <span>Dados cadastrais e credenciais básicas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />
                  <span>Perfil profissional e registro CRN</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />
                  <span>Vínculo com a consultoria ({tenant.name || 'Minha Empresa'})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />
                  <span>Anotações de Responsabilidade Técnica (ARTs)</span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6]" />
                  <span>Histórico de visitas técnicas e auditorias registradas</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#CBD5E1] dark:border-[#334155]">
              <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Arquivo interoperável e seguro, gerado em tempo real.</span>
              </div>
              <Button
                type="button"
                variant="primary"
                icon={<Download className="w-4 h-4" />}
                loading={isExporting}
                disabled={isExporting}
                onClick={handleExportData}
              >
                {isExporting ? 'Exportando Dados...' : 'Exportar Dados LGPD (JSON)'}
              </Button>
            </div>
          </Card>

          {/* User Rights Section */}
          <Card className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#2563EB] dark:text-[#3B82F6]" />
                Seus Direitos como Titular (Art. 18 da LGPD)
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                A Lei nº 13.709/2018 assegura o controle e a transparência sobre o tratamento de seus dados pessoais.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-md bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#334155] space-y-1">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  <FileText className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                  <span>Acesso e Confirmação</span>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Confirmação da existência de tratamento e acesso aos dados pessoais mantidos sob a custódia do PRAXIS.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#334155] space-y-1">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  <User className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                  <span>Correção de Dados</span>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Você pode atualizar seu nome, foto e dados cadastrais a qualquer momento na aba &ldquo;Dados Cadastrais&rdquo;.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#334155] space-y-1">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  <Download className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                  <span>Portabilidade de Dados</span>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Receba seus dados em formato estruturado (JSON) para compartilhamento ou migração com outros serviços.
                </p>
              </div>

              <div className="p-3.5 rounded-md bg-[#F8FAFC] dark:bg-[#1E293B]/50 border border-[#E2E8F0] dark:border-[#334155] space-y-1">
                <div className="flex items-center gap-2 font-semibold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                  <Lock className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                  <span>Segurança & Isolamento</span>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Isolamento lógico multi-tenant rigoroso. Suas vistorias e laudos não são acessados por outras consultorias.
                </p>
              </div>
            </div>
          </Card>

          {/* DPO / Contact Card */}
          <Card className="p-4 bg-slate-50/50 dark:bg-[#1E293B]/30 border-dashed border-[#CBD5E1] dark:border-[#334155]">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-[#2563EB] dark:text-[#3B82F6] shrink-0 mt-0.5" />
              <div className="text-xs text-[#475569] dark:text-[#94A3B8] space-y-1">
                <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  Encarregado de Proteção de Dados (DPO)
                </p>
                <p className="leading-relaxed">
                  Para solicitações de eliminação de dados, revogação de consentimento ou esclarecimento de dúvidas regulatórias, 
                  entre em contato com nosso Encarregado através do e-mail:{' '}
                  <a
                    href="mailto:privacidade@praxisnutri.com.br"
                    className="font-medium text-[#2563EB] dark:text-[#3B82F6] hover:underline"
                  >
                    privacidade@praxisnutri.com.br
                  </a>
                  .
                </p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] italic">
                  * Registros técnicos e laudos sanitários podem possuir prazos de guarda obrigatórios exigidos pelo CFN/CRN e ANVISA.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
