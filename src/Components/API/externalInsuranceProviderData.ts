export enum ExternalInsuranceProviderStatus {
  CONNECTING,
  REQUIRES_AUTH,
  FAILED,
  FETCHING,
  COMPLETED
}

export interface ExternalInsuranceProviderData {
  status: ExternalInsuranceProviderStatus;
}

export type ExternalInsuranceProviderEventEmitter = {
  data: ExternalInsuranceProviderData[];
};
