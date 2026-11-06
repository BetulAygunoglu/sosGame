/* import { ApiClient, ENDPOINTS } from './apiClient.ts';
import axios from 'axios';

class AuthService {
  private static instance: AuthService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async getToken(user: string, password: string) {
    try {
      const response = await this.apiClient.postForm(ENDPOINTS.ENDPOINTS.AUTH.GET_TOKEN,
        { userName: user, password: password, grant_type: "password" });

      return response.data;
    } catch (error) {
      console.error("getToken error: ", error);
      throw new Error("Login failed");
    }
  }

  async getCustomerById(customerId: string) {
    try {
      const response = await this.apiClient.authPost(ENDPOINTS.ENDPOINTS.AUTH.GET_CUSTOMER_BY_ID(customerId), null
      );

      return response.data;
    } catch (error) {
      throw new Error("Login failed");
    }
  }

  async tokenControl() {
    try {
      const response = await this.apiClient.authPost(ENDPOINTS.ENDPOINTS.GENERAL.GET_PENALTY, null);

      return response.data;

    } catch (error: unknown) {
      // 1️⃣ Axios error
      if (axios.isAxiosError(error)) {
        // 🔴 Backend responded
        if (error.response) {
          const status = error.response.status;

          if (status === 401) {
            // Token expired / invalid
            throw {
              type: "UNAUTHORIZED",
              status,
              originalError: error,
            };
          }

        }

        // 🟠 Request sent but no response → network issue
        if (error.request) {
          throw {
            type: "NETWORK_ERROR",
            originalError: error,
          };
        }
      }

      // 🟡 Non-Axios error
      throw {
        type: "UNKNOWN_ERROR",
        originalError: error,
      };
    }

  }

}
export default AuthService;
 */