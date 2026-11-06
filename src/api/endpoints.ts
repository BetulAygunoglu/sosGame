import {appConfig} from "../config/appConfig";

const ENDPOINTS = {
  AUTH: {
    LOGIN: `/auth/login`,
    REGISTER: `/api/User/CreateCustomer`,
    REFRESH_TOKEN: `/auth/refresh-token`,
    LOGOUT: `/auth/logout`,
    GET_TERRITORY_ID: (lat: string, lng: string) => `/api/Actual/GetTerritoryIdByLocation?lat=${lat}&lng=${lng}`,
    GET_ACTIVATION_CODE: (organizationId: string, phonenumber: string, requestId: string, territoryId: string, countryCode: string ) => 
      `/api/User/ActivationCodeRequest?organizationId=${organizationId}` +
      `&phonenumber=${phonenumber}&requestid=${requestId}&territoryId=${territoryId}&countryCode=${countryCode}`,
    ACTIVATION_CODE_CONTROL: (activationId: string, activationCode: string) => `/api/User/ActivationCodeControl?activationid=${activationId}&activationcode=${activationCode}`,
    GET_TOKEN: `/token`,
    GET_CUSTOMER_BY_ID: (customerId: string) =>`/api/User/GetCustomerById?customerId=${customerId}`,
    DELETE_USER: (customerId: string) =>`/api/User/DeactiveUser?customerId=${customerId}`,
    UPDATE_DEF_PAY: (customerId: string, methodId: number) =>`/api/user/UpdateCustomerDefaultPaymentMethod?customerId=${customerId}&defaultPaymentMethod=${methodId}`,
  },
  GOOGLE_AUTH: {
    LOGIN: `/authgoogle/login`,
    REGISTER: `/authgoogle/register`,
    REFRESH_TOKEN: `/authgoogle/refresh-token`,
    VALIDATE_TOKEN: (idToken: string) => `/api/Auth/VerifyGoogle?idToken=${idToken}`,
    LOGOUT: `/authgoogle/logout`,
  }
};

export default {ENDPOINTS,API_BASE_URL: appConfig.API_BASE_URL};
