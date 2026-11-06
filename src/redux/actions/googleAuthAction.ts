export const googleLoginRequest = (payload: string) => ({
    type: "authgoogle/loginRequest",
    payload: {idToken: payload},
  });
  
export const googleLogoutRequest = (onSuccess?: () => void) => ({
    type: 'authgoogle/logoutRequest',
    meta: { onSuccess }
  });
