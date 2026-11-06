export const logoutRequest = (onSuccess?: () => void, onError?: () => void) => ({
  type: 'auth/logoutRequest',
  meta: { onSuccess, onError}
});

export const appleLoginRequest = (credentials: any) => ({
  type: 'auth/appleLoginRequest',
  payload: credentials,
});

export const getTerritoryIdRequest = (payload: {lat: string, lng: string}, onSuccess?: () => void) => ({
  type: 'auth/territoryIdRequest',
  payload,
  meta: { onSuccess }
});

export const getActivationCodeRequest = (payload: {
  organizationId: string, phonenumber: string,
  requestId: string, territoryId: string, countryCode: string
}, onSuccess?: () => void, onError?: () => void) => ({
  type: 'auth/activationCodeRequest',
  payload,
  meta: { onSuccess, onError }
});