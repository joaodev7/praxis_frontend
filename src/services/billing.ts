import api from './api';

export interface Plan {
  id: string;
  name: string;
  code: 'essential' | 'professional' | 'enterprise';
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  maxNutritionists: number;
  maxClientCompanies: number;
  maxStorageMb: number;
  features: string[];
}

export interface SubscriptionInfo {
  id: string;
  planName: string;
  planCode: string;
  status: number; // 1=Trial, 2=Active, 3=PastDue, 4=Suspended, 5=Cancelled, 6=Expired
  statusDescription: string;
  billingCycle: number; // 1=Monthly, 2=Annual
  startedAt: string;
  trialEndsAt?: string;
  daysRemainingInTrial?: number;
  currentPeriodEnd?: string;
  gracePeriodEndsAt?: string;
  cancelledAtPeriodEnd: boolean;
  currentPrice: number;
  currentNutritionistsCount: number;
  maxNutritionists: number;
  currentClientCompaniesCount: number;
  maxClientCompanies: number;
  enabledFeatures: string[];
  hasAccess: boolean;
}

export interface CheckoutRequest {
  planCode: string;
  billingCycle: number;
  paymentMethod: number; // 1=Pix, 2=CreditCard, 3=Boleto
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
}

export interface CheckoutResponse {
  paymentId: string;
  status: number;
  amount: number;
  paymentMethod: number;
  dueDate?: string;
  invoiceUrl?: string;
  pix?: {
    qrCodeUrl?: string;
    copyPasteCode?: string;
    expirationDate?: string;
  };
  message: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  status: number;
  statusDescription: string;
  paymentMethod: number;
  createdAt: string;
  dueDate?: string;
  paidAt?: string;
  invoiceUrl?: string;
}

export const billingService = {
  getPlans: async (): Promise<Plan[]> => {
    const response = await api.get<Plan[]>('/billing/plans');
    return response.data;
  },

  getSubscription: async (): Promise<SubscriptionInfo> => {
    const response = await api.get<SubscriptionInfo>('/billing/subscription');
    return response.data;
  },

  createCheckout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await api.post<CheckoutResponse>('/billing/checkout', data);
    return response.data;
  },

  upgradePlan: async (newPlanCode: string, billingCycle: number = 1): Promise<SubscriptionInfo> => {
    const response = await api.post<SubscriptionInfo>('/billing/subscription/upgrade', {
      newPlanCode,
      billingCycle
    });
    return response.data;
  },

  downgradePlan: async (newPlanCode: string): Promise<SubscriptionInfo> => {
    const response = await api.post<SubscriptionInfo>('/billing/subscription/downgrade', {
      newPlanCode
    });
    return response.data;
  },

  cancelSubscription: async (): Promise<SubscriptionInfo> => {
    const response = await api.post<SubscriptionInfo>('/billing/subscription/cancel');
    return response.data;
  },

  reactivateSubscription: async (): Promise<SubscriptionInfo> => {
    const response = await api.post<SubscriptionInfo>('/billing/subscription/reactivate');
    return response.data;
  },

  getPayments: async (): Promise<PaymentHistory[]> => {
    const response = await api.get<PaymentHistory[]>('/billing/payments');
    return response.data;
  }
};
