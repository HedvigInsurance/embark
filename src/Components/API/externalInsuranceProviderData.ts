export enum ExternalInsuranceProviderStatus {
  CONNECTING = 'CONNECTING',
  REQUIRES_AUTH = 'REQUIRES_AUTH',
  FAILED = 'FAILED',
  FETCHING = 'FETCHING',
  COMPLETED = 'COMPLETED',
}

interface MonetaryAmount {
  amount: string
  currency: string
}

interface ExternalInsurance {
  insuranceObjectStreetAddress?: string
  postalNumber?: string
  insuranceName?: string
  insuranceType?: string
  insuranceProvider?: string
  renewalDate?: string
  monthlyPremium?: MonetaryAmount
  monthlyDiscountedPremium?: MonetaryAmount
}

export interface ExternalInsuranceProviderData {
  status: ExternalInsuranceProviderStatus
  imageValue?: string
  token?: string
  insurance?: ExternalInsurance
}

export type ExternalInsuranceProviderEventEmitter = {
  data: ExternalInsuranceProviderData[]
}
