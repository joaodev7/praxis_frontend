export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'PraxisAdmin' | 'TenantAdmin' | 'Nutritionist' | 'ClientUser';
  status: 'Active' | 'Inactive' | 'Blocked';
  nutritionistId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  legalName: string;
  cnpj: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export interface ClientCompany {
  id: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
  address?: string;
  responsibleName?: string;
  notes?: string;
  status: 'Active' | 'Inactive' | string;
  createdAt: string;
  unitsCount: number;
}

export interface AssignedNutritionist {
  nutritionistId: string;
  userId: string;
  name: string;
  email: string;
  crn: string;
  phone: string;
  status: 'Active' | 'Inactive' | string;
}

export interface Unit {
  id: string;
  clientCompanyId: string;
  clientCompanyName: string;
  name: string;
  address: string;
  phone: string;
  responsibleName: string;
  notes?: string;
  status: 'Active' | 'Inactive' | string;
  createdAt: string;
  activeArtNumber?: string;
  totalVisits: number;
  assignedNutritionists?: AssignedNutritionist[];
}

export interface Nutritionist {
  id: string;
  userId: string;
  name: string;
  email: string;
  crn: string;
  phone: string;
  status: 'Active' | 'Inactive' | string;
  createdAt: string;
  assignedUnitIds: string[];
}

export interface ART {
  id: string;
  unitId: string;
  unitName: string;
  clientCompanyName: string;
  nutritionistId: string;
  nutritionistName: string;
  number: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Suspended' | 'Ended' | 'Expired';
  documentUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface Visit {
  id: string;
  unitId: string;
  unitName: string;
  clientCompanyName: string;
  nutritionistId: string;
  nutritionistName: string;
  checklistId?: string;
  checklistName?: string;
  scheduledAt: string;
  startedAt?: string;
  finishedAt?: string;
  status: 'Scheduled' | 'InProgress' | 'Finished' | 'Cancelled';
  notes?: string;
  createdAt: string;
  totalEvaluations: number;
  conformingCount: number;
  nonConformingCount: number;
  complianceRate?: number;
}

export interface NonConformity {
  id: string;
  visitId: string;
  unitName: string;
  clientCompanyName: string;
  category: string;
  description: string;
  severity: 'Baixa' | 'Media' | 'Alta' | 'Critica';
  status: 'Aberta' | 'EmAndamento' | 'Resolvida' | 'Cancelada';
  dueDate?: string;
  correctiveAction?: string;
  isLate: boolean;
  createdAt: string;
  actions: ActionItem[];
  evidences: Evidence[];
}

export type ActionPlanStatus = 'Pendente' | 'EmAndamento' | 'AguardandoValidacao' | 'Concluida' | 'Cancelada';
export type ActionPlanPriority = 'Baixa' | 'Media' | 'Alta' | 'Critica';

export interface ActionPlanEvidence {
  id: string;
  actionPlanId: string;
  fileUrl: string;
  objectKey: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedByUserId?: string;
  uploadedByUserName?: string;
}

export interface ActionPlan {
  id: string;
  nonConformityId: string;
  nonConformityDescription: string;
  visitId?: string;
  unitId?: string;
  unitName: string;
  clientCompanyId?: string;
  clientCompanyName: string;
  what: string;
  description: string;
  why?: string;
  responsibleUserId?: string;
  responsibleUserName?: string;
  responsibleName?: string;
  dueDate?: string;
  where?: string;
  how?: string;
  howMuch?: number;
  priority: ActionPlanPriority;
  status: ActionPlanStatus;
  startedAt?: string;
  completedAt?: string;
  validatedAt?: string;
  validatedByUserId?: string;
  validatedByUserName?: string;
  validationComment?: string;
  cancellationReason?: string;
  notes?: string;
  isLate: boolean;
  createdAt: string;
  evidences: ActionPlanEvidence[];
}

export interface ActionPlanDashboardMetrics {
  totalActions: number;
  pendingActions: number;
  inProgressActions: number;
  waitingValidationActions: number;
  completedActions: number;
  cancelledActions: number;
  lateActions: number;
  clientMetrics: Array<{
    clientCompanyId: string;
    clientCompanyName: string;
    totalActions: number;
    completedActions: number;
    inProgressActions: number;
    pendingActions: number;
    waitingValidationActions: number;
    lateActions: number;
  }>;
}

export interface ActionItem {
  id: string;
  nonConformityId: string;
  description: string;
  responsibleUserName?: string;
  dueDate?: string;
  status: ActionPlanStatus;
  completedAt?: string;
  notes?: string;
}

export interface Evidence {
  id: string;
  type: 'Photo' | 'Document' | 'Note';
  url: string;
  description: string;
  createdAt: string;
}

export interface Checklist {
  id: string;
  name: string;
  description: string;
  status: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  category: string;
  description: string;
  order: number;
  required: boolean;
  status: string;
}

export interface DashboardMetrics {
  totalClients: number;
  totalUnits: number;
  totalNutritionists: number;
  activeArts: number;
  visitsThisMonth: number;
  openNonConformities: number;
  lateNonConformities: number;
  averageComplianceRate: number;
  recentVisits: Array<{
    id: string;
    clientName: string;
    unitName: string;
    nutritionistName: string;
    date: string;
    status: string;
    complianceRate?: number;
  }>;
  criticalUnits: Array<{
    unitId: string;
    unitName: string;
    clientName: string;
    openNonConformitiesCount: number;
  }>;
  expiringArts: Array<{
    id: string;
    number: string;
    unitName: string;
    nutritionistName: string;
    endDate?: string;
    daysRemaining: number;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string | null;
  profilePhotoUrl?: string | null;
}

export interface UpdateProfileRequest {
  name: string;
  dateOfBirth?: string | null;
}

export interface ProfilePhotoUploadResponse {
  profilePhotoUrl: string;
  message: string;
}

export * from './file';

