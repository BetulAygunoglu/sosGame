export interface AuthState {
  isAuthenticated: boolean;
  customerId: string | null;
  activationCode: string,
  territoryId: string | null,
  areaCode: string,
  verificationResponse: VerificationResponse | null,
  token: string,
  userVerified: boolean;
  deleteResponse: any;
  defaultPaymentMethod: number;
}

export type VerificationResponse = {
  Data: string;
  tip: string;
}