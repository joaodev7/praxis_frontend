import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Calendar, Camera, Trash2, CheckCircle2, AlertCircle, Loader2, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { profileService } from '../services/profileService';
import { UserProfile } from '../types';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-[#2563EB] dark:text-[#3B82F6] animate-spin" />
        <p className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Carregando dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Meu Perfil</h1>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
          Gerencie seus dados cadastrais e foto de perfil no PRAXIS.
        </p>
      </div>

      {/* Notifications */}
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

      {/* Profile Card */}
      <Card className="space-y-8">
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
    </div>
  );
};
