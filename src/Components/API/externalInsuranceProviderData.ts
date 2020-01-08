export enum ExternalInsuranceProviderStatus {
  CONNECTING,
  REQUIRES_AUTH,
  FAILED,
  FETCHING,
  COMPLETED
}

interface MonetaryAmount {
  amount: string;
  currency: string;
}

interface ExternalInsurance {
  insuranceObjectStreetAddress?: string;
  postalNumber?: string;
  insuranceName?: string;
  insuranceType?: string;
  insuranceProvider?: string;
  renewalDate?: string;
  monthlyPremium?: MonetaryAmount;
  monthlyDiscountedPremium?: MonetaryAmount;
}

export interface ExternalInsuranceProviderData {
  status: ExternalInsuranceProviderStatus;
  imageValue?: string;
  token?: string;
  insurance?: ExternalInsurance;
}

export type ExternalInsuranceProviderEventEmitter = {
  data: ExternalInsuranceProviderData[];
};
