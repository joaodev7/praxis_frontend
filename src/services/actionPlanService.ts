import api from './api';
import {
  ActionPlan,
  ActionPlanDashboardMetrics,
  ActionPlanEvidence,
  ActionPlanPriority,
  ActionPlanStatus
} from '../types';

export interface ActionPlanFilterParams {
  nonConformityId?: string;
  visitId?: string;
  unitId?: string;
  clientId?: string;
  responsibleUserId?: string;
  status?: ActionPlanStatus;
  priority?: ActionPlanPriority;
  isLate?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface CreateActionPlanPayload {
  nonConformityId: string;
  what: string;
  why?: string;
  responsibleUserId?: string;
  responsibleName?: string;
  dueDate: string;
  where?: string;
  how?: string;
  howMuch?: number;
  priority?: ActionPlanPriority;
  notes?: string;
}

export interface UpdateActionPlanPayload {
  what: string;
  why?: string;
  responsibleUserId?: string;
  responsibleName?: string;
  dueDate: string;
  where?: string;
  how?: string;
  howMuch?: number;
  priority: ActionPlanPriority;
  notes?: string;
}

export const actionPlanService = {
  async getAll(params?: ActionPlanFilterParams): Promise<ActionPlan[]> {
    const { data } = await api.get<ActionPlan[]>('/action-plans', { params });
    return data;
  },

  async getDashboard(clientId?: string, unitId?: string): Promise<ActionPlanDashboardMetrics> {
    const { data } = await api.get<ActionPlanDashboardMetrics>('/action-plans/dashboard', {
      params: { clientId, unitId }
    });
    return data;
  },

  async getById(id: string): Promise<ActionPlan> {
    const { data } = await api.get<ActionPlan>(`/action-plans/${id}`);
    return data;
  },

  async create(payload: CreateActionPlanPayload): Promise<ActionPlan> {
    const { data } = await api.post<ActionPlan>('/action-plans', payload);
    return data;
  },

  async update(id: string, payload: UpdateActionPlanPayload): Promise<ActionPlan> {
    const { data } = await api.put<ActionPlan>(`/action-plans/${id}`, payload);
    return data;
  },

  async changeStatus(id: string, status: ActionPlanStatus, notes?: string): Promise<ActionPlan> {
    const { data } = await api.patch<ActionPlan>(`/action-plans/${id}/status`, { status, notes });
    return data;
  },

  async validate(id: string, approved: boolean, comment?: string): Promise<ActionPlan> {
    const { data } = await api.patch<ActionPlan>(`/action-plans/${id}/validate`, { approved, comment });
    return data;
  },

  async cancel(id: string, reason: string): Promise<ActionPlan> {
    const { data } = await api.patch<ActionPlan>(`/action-plans/${id}/cancel`, { reason });
    return data;
  },

  async uploadEvidence(id: string, file: File): Promise<ActionPlanEvidence> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<ActionPlanEvidence>(`/action-plans/${id}/evidences`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  async getEvidences(id: string): Promise<ActionPlanEvidence[]> {
    const { data } = await api.get<ActionPlanEvidence[]>(`/action-plans/${id}/evidences`);
    return data;
  },

  async deleteEvidence(actionPlanId: string, evidenceId: string): Promise<void> {
    await api.delete(`/action-plans/${actionPlanId}/evidences/${evidenceId}`);
  }
};
