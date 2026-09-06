import api from './api';
import { UserProfile, UpdateProfileRequest, ProfilePhotoUploadResponse } from '../types';

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>('/profile');
    return data;
  },

  async updateProfile(request: UpdateProfileRequest): Promise<UserProfile> {
    const { data } = await api.put<UserProfile>('/profile', request);
    return data;
  },

  async uploadPhoto(file: File): Promise<ProfilePhotoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<ProfilePhotoUploadResponse>('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  async deletePhoto(): Promise<void> {
    await api.delete('/profile/photo');
  },
};
