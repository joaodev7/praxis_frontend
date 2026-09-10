export type LabelOperationType =
  | 'Preparation'
  | 'Opening'
  | 'Portioning'
  | 'Defrosting'
  | 'PrePreparation'
  | 'Storage';

export type LabelType =
  | 'PreparedFood'
  | 'OpenedProduct'
  | 'PortionedProduct'
  | 'PrePreparation'
  | 'CommercialProduct';

export type LabelStatus = 'Active' | 'Expired' | 'Cancelled' | 'Discarded';

export type StorageCondition =
  | 'Ambient'
  | 'Refrigerated'
  | 'Frozen'
  | 'Heated'
  | 'Other';

export type ValidityUnit = 'Hours' | 'Days' | 'Weeks' | 'Months';

export type ValiditySource = 'Rule' | 'Manual' | 'OriginalProduct';

export interface ProductDto {
  id: string;
  tenantId: string;
  unitId?: string | null;
  unitName?: string | null;
  name: string;
  description?: string | null;
  category?: string | null;
  isActive: boolean;
  createdAt: string;
  batchCount: number;
}

export interface CreateProductRequest {
  unitId?: string | null;
  name: string;
  description?: string | null;
  category?: string | null;
}

export interface ProductBatchDto {
  id: string;
  productId: string;
  productName: string;
  batchCode: string;
  originalBatchCode?: string | null;
  manufacturingDate?: string | null;
  originalExpirationDate?: string | null;
  createdAt: string;
}

export interface CreateProductBatchRequest {
  batchCode: string;
  originalBatchCode?: string | null;
  manufacturingDate?: string | null;
  originalExpirationDate?: string | null;
}

export interface ValidityRuleDto {
  id: string;
  tenantId: string;
  unitId?: string | null;
  unitName?: string | null;
  productId?: string | null;
  productName?: string | null;
  name: string;
  description?: string | null;
  productCategory?: string | null;
  labelType?: LabelType | null;
  operationType?: LabelOperationType | null;
  storageCondition?: StorageCondition | null;
  maximumTemperature?: number | null;
  validityValue: number;
  validityUnit: ValidityUnit;
  allowManualExpiration: boolean;
  requiresTechnicalBasis: boolean;
  technicalBasis?: string | null;
  regulatoryReference?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateValidityRuleRequest {
  unitId?: string | null;
  productId?: string | null;
  name: string;
  description?: string | null;
  productCategory?: string | null;
  labelType?: LabelType | null;
  operationType?: LabelOperationType | null;
  storageCondition?: StorageCondition | null;
  maximumTemperature?: number | null;
  validityValue: number;
  validityUnit: ValidityUnit;
  allowManualExpiration: boolean;
  requiresTechnicalBasis: boolean;
  technicalBasis?: string | null;
  regulatoryReference?: string | null;
}

export interface SimulateValidityRequest {
  unitId: string;
  productId: string;
  labelType: LabelType;
  operationType: LabelOperationType;
  storageCondition: StorageCondition;
  storageTemperature?: number | null;
  startAt?: string | null;
  productBatchId?: string | null;
}

export interface SimulateValidityResponse {
  ruleMatched: boolean;
  ruleId?: string | null;
  ruleName?: string | null;
  startAt: string;
  expirationDate: string;
  source: ValiditySource;
  explanation?: string | null;
  technicalBasis?: string | null;
  regulatoryReference?: string | null;
  requiresManualInput: boolean;
  maxAllowedDate?: string | null;
}

export interface FoodLabelListDto {
  id: string;
  unitId: string;
  unitName: string;
  productId: string;
  productName: string;
  internalBatchCode: string;
  labelType: LabelType;
  operationType: LabelOperationType;
  status: LabelStatus;
  validityStartAt: string;
  effectiveExpirationDate: string;
  isExpired: boolean;
  storageCondition: StorageCondition;
  storageTemperatureMax?: number | null;
  publicToken: string;
  printCount: number;
  createdAt: string;
}

export interface FoodLabelDto {
  id: string;
  tenantId: string;
  unitId: string;
  unitName: string;
  productId: string;
  productName: string;
  productBatchId?: string | null;
  productBatchCode?: string | null;
  validityRuleId?: string | null;
  validityRuleName?: string | null;
  labelType: LabelType;
  operationType: LabelOperationType;
  status: LabelStatus;
  description: string;
  internalBatchCode: string;
  manufacturedAt?: string | null;
  preparedAt?: string | null;
  openedAt?: string | null;
  portionedAt?: string | null;
  validityStartAt: string;
  calculatedExpirationDate: string;
  manualExpirationDate?: string | null;
  effectiveExpirationDate: string;
  isExpired: boolean;
  validitySource: ValiditySource;
  validityJustification?: string | null;
  storageCondition: StorageCondition;
  storageTemperatureMin?: number | null;
  storageTemperatureMax?: number | null;
  storageInstructions?: string | null;
  publicToken: string;
  printCount: number;
  lastPrintedAt?: string | null;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  cancelledAt?: string | null;
  cancellationReason?: string | null;
  discardedAt?: string | null;
  discardReason?: string | null;
  discardQuantity?: number | null;
  discardUnit?: string | null;
}

export interface CreateFoodLabelRequest {
  unitId: string;
  productId: string;
  productBatchId?: string | null;
  labelType: LabelType;
  operationType: LabelOperationType;
  description?: string | null;
  operationDateTime?: string | null;
  storageCondition: StorageCondition;
  storageTemperatureMin?: number | null;
  storageTemperatureMax?: number | null;
  storageInstructions?: string | null;
  manualExpirationDate?: string | null;
  manualJustification?: string | null;
  printCopies?: number;
  templateType?: string | null;
}

export interface FoodLabelDashboardDto {
  totalActive: number;
  expiresToday: number;
  expiresTomorrow: number;
  expired: number;
  cancelled: number;
  discarded: number;
  totalPrinted: number;
  withoutConfiguredRule: number;
}

export interface FoodLabelPublicDto {
  productName: string;
  internalBatchCode: string;
  operationName?: string | null;
  validityStartAt: string;
  expirationDate: string;
  isExpired: boolean;
  storageCondition: string;
  storageTemperatureMax?: number | null;
  storageInstructions?: string | null;
  unitName: string;
  status: string;
  technicalBasis?: string | null;
}

export interface LabelTemplateDto {
  id: string;
  name: string;
  templateType: string;
  widthMm: number;
  heightMm: number;
  includeQrCode: boolean;
  includeLogo: boolean;
  isDefault: boolean;
}
