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
  status: string;
  createdAt: string;
  unitsCount: number;
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
  status: string;
  createdAt: string;
  activeArtNumber?: string;
  totalVisits: number;
}

export interface Nutritionist {
  id: string;
  userId: string;
  name: string;
  email: string;
  crn: string;
  phone: string;
  status: string;
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

export interface ActionItem {
  id: string;
  nonConformityId: string;
  description: string;
  responsibleUserName?: string;
  dueDate?: string;
  status: 'Pendente' | 'EmAndamento' | 'Concluida' | 'Cancelada';
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

export * from './file';

