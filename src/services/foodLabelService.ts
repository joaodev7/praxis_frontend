import api from './api';
import {
  ProductDto,
  CreateProductRequest,
  ProductBatchDto,
  CreateProductBatchRequest,
  ValidityRuleDto,
  CreateValidityRuleRequest,
  SimulateValidityRequest,
  SimulateValidityResponse,
  FoodLabelListDto,
  FoodLabelDto,
  CreateFoodLabelRequest,
  FoodLabelDashboardDto,
  FoodLabelPublicDto,
  LabelTemplateDto,
} from '../types/foodLabel';

export const foodLabelService = {
  // Produtos
  async getProducts(unitId?: string, category?: string): Promise<ProductDto[]> {
    const params = new URLSearchParams();
    if (unitId) params.append('unitId', unitId);
    if (category) params.append('category', category);
    const res = await api.get<ProductDto[]>(`/products?${params.toString()}`);
    return res.data;
  },

  async createProduct(data: CreateProductRequest): Promise<ProductDto> {
    const res = await api.post<ProductDto>('/products', data);
    return res.data;
  },

  async getProductBatches(productId: string): Promise<ProductBatchDto[]> {
    const res = await api.get<ProductBatchDto[]>(`/products/${productId}/batches`);
    return res.data;
  },

  async createProductBatch(productId: string, data: CreateProductBatchRequest): Promise<ProductBatchDto> {
    const res = await api.post<ProductBatchDto>(`/products/${productId}/batches`, data);
    return res.data;
  },

  // Regras de validade
  async getValidityRules(unitId?: string, category?: string): Promise<ValidityRuleDto[]> {
    const params = new URLSearchParams();
    if (unitId) params.append('unitId', unitId);
    if (category) params.append('category', category);
    const res = await api.get<ValidityRuleDto[]>(`/validity-rules?${params.toString()}`);
    return res.data;
  },

  async createValidityRule(data: CreateValidityRuleRequest): Promise<ValidityRuleDto> {
    const res = await api.post<ValidityRuleDto>('/validity-rules', data);
    return res.data;
  },

  async deleteValidityRule(id: string): Promise<void> {
    await api.delete(`/validity-rules/${id}`);
  },

  async simulateValidity(data: SimulateValidityRequest): Promise<SimulateValidityResponse> {
    const res = await api.post<SimulateValidityResponse>('/validity-rules/simulate', data);
    return res.data;
  },

  // Etiquetas
  async getLabels(params?: {
    unitId?: string;
    productId?: string;
    status?: string;
    labelType?: string;
    operationType?: string;
    batchCode?: string;
    onlyExpired?: boolean;
    onlyExpiringSoon?: boolean;
  }): Promise<FoodLabelListDto[]> {
    const query = new URLSearchParams();
    if (params?.unitId) query.append('unitId', params.unitId);
    if (params?.productId) query.append('productId', params.productId);
    if (params?.status) query.append('status', params.status);
    if (params?.labelType) query.append('labelType', params.labelType);
    if (params?.operationType) query.append('operationType', params.operationType);
    if (params?.batchCode) query.append('batchCode', params.batchCode);
    if (params?.onlyExpired) query.append('onlyExpired', 'true');
    if (params?.onlyExpiringSoon) query.append('onlyExpiringSoon', 'true');

    const res = await api.get<FoodLabelListDto[]>(`/food-labels?${query.toString()}`);
    return res.data;
  },

  async getLabelById(id: string): Promise<FoodLabelDto> {
    const res = await api.get<FoodLabelDto>(`/food-labels/${id}`);
    return res.data;
  },

  async createLabel(data: CreateFoodLabelRequest): Promise<FoodLabelDto> {
    const res = await api.post<FoodLabelDto>('/food-labels', data);
    return res.data;
  },

  async cancelLabel(id: string, reason: string): Promise<FoodLabelDto> {
    const res = await api.post<FoodLabelDto>(`/food-labels/${id}/cancel`, { reason });
    return res.data;
  },

  async discardLabel(id: string, data: { reason: string; quantity?: number; unit?: string }): Promise<FoodLabelDto> {
    const res = await api.post<FoodLabelDto>(`/food-labels/${id}/discard`, data);
    return res.data;
  },

  async reprintLabel(id: string, quantity: number, templateUsed?: string): Promise<FoodLabelDto> {
    const res = await api.post<FoodLabelDto>(`/food-labels/${id}/reprint`, { quantity, templateUsed });
    return res.data;
  },

  async getDashboardStats(unitId?: string): Promise<FoodLabelDashboardDto> {
    const query = unitId ? `?unitId=${unitId}` : '';
    const res = await api.get<FoodLabelDashboardDto>(`/food-labels/dashboard${query}`);
    return res.data;
  },

  async getTemplates(): Promise<LabelTemplateDto[]> {
    const res = await api.get<LabelTemplateDto[]>('/food-labels/templates');
    return res.data;
  },

  async downloadLabelPdf(id: string, templateType = 'Thermal80x50', copies = 1): Promise<Blob> {
    const res = await api.get(`/food-labels/${id}/pdf?templateType=${templateType}&copies=${copies}`, {
      responseType: 'blob',
    });
    return res.data;
  },

  async downloadBulkPdf(labelIds: string[], templateType = 'Thermal80x50', copiesPerLabel = 1): Promise<Blob> {
    const res = await api.post(
      '/food-labels/pdf',
      { labelIds, templateType, copiesPerLabel },
      { responseType: 'blob' }
    );
    return res.data;
  },

  // Consulta pública externa para validação do QR Code
  async getPublicByToken(publicToken: string): Promise<FoodLabelPublicDto> {
    const res = await api.get<FoodLabelPublicDto>(`/public/labels/${publicToken}`);
    return res.data;
  },
};
