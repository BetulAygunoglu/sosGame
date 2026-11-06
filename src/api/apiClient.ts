import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import endpoints from "./endpoints";
import { store } from '../redux/store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "react-native-localize";
//import * as Sentry from '@sentry/react-native';

class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {

    const deviceLang = getLocales()[0]?.languageCode ?? "tr";

    this.api = axios.create({
      baseURL: endpoints.API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": deviceLang
      },
      timeout: 10000, // 30 saniye timeout süresi
    });

    // İstek interceptor'ı
    this.api.interceptors.request.use(
      (config) => {
        // Her istek başladığında loading'i göster
        //store.dispatch(showLoading());

        return config;
      },
      (error) => {
        // İstek hatası durumunda loading'i gizle
        //store.dispatch(hideLoading());
        /* logApiError('API request Error: ', error); */
        return Promise.reject(error);
      }
    );

    // Yanıt interceptor'ı
    this.api.interceptors.response.use(
      (response) => {
        // Başarılı yanıt durumunda loading'i gizle
        //store.dispatch(hideLoading());

        try {
          const data = response?.data;

          // 🔥 CHECK BUSINESS ERROR
          if (data && typeof data.IsSuccess !== "undefined" && data.IsSuccess === false) {
            /* logApiBusinessError(response); */
          }

        } catch (e) {
          // never break app because of logging
          console.warn("Business error logging failed", e);
        }

        return response;

        //return response;
      },
      (error) => {
        // Hata durumunda loading'i gizle
        //store.dispatch(hideLoading());
        /* logApiError('API response Error: ', error); */
        return Promise.reject(error);
      }
    );

  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setLanguage(languageCode: string) {
    this.api.defaults.headers['Accept-Language'] = languageCode;
  }

  // GET isteği
  async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      //store.dispatch(showLoading());
      const response = await this.api.get(url, config);
      return response;
    } catch (error) {
      throw error;
    } finally {
      //store.dispatch(hideLoading());
    }
  }

  // POST isteği
  async post(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      //store.dispatch(showLoading());

      //const deviceId = "ba6d727c0fddd580"; // Bunu dinamik alıyorsan oradan getir

      // const finalConfig: AxiosRequestConfig = {
      //   ...config,
      //   headers: {
      //     ...(config?.headers || {}),
      //     deviceId: deviceId,
      //   },
      // };

      // const answer = await this.api.post(url, data, finalConfig);
      const answer = await this.api.post(url, data, config);

      //return this.api.post(url, data, config);
      return answer;
    } catch (error) {
      throw error;
    } finally {
      //store.dispatch(hideLoading());
    }
  }

  // PUT isteği
  async put(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      //store.dispatch(showLoading());
      const response = await this.api.put(url, data, config);
      return response;
    } catch (error) {
      throw error;
    } finally {
      //store.dispatch(hideLoading());
    }
  }

  // DELETE isteği
  async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      //store.dispatch(showLoading());
      const response = await this.api.delete(url, config);
      return response;
    } catch (error) {
      throw error;
    } finally {
      //store.dispatch(hideLoading());
    }
  }

  async postMultipart(
    url: string,
    data: { [key: string]: any }, // Can include file and text fields
    fileFieldName: string,        // e.g., 'photo'
    fileUri: string,              // e.g., '/data/user/0/....jpg'
    fileName?: string,            // Optional: 'image.jpg'
    mimeType?: string,            // Optional: 'image/jpeg'
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    try {
      //store.dispatch(showLoading());
      const formData = new FormData();

      // Append other fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append the file
      formData.append(fileFieldName, {
        uri: fileUri,
        type: mimeType || 'image/jpeg',
        name: fileName || 'photo.jpg',
      } as any);

      // Override headers for multipart
      const finalConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...(config?.headers || {}),
          'Content-Type': 'multipart/form-data',
        },
      };

      const answer = await this.api.post(url, formData, finalConfig);

      return answer;
    } catch (error) {
      throw error;
    } finally {
      //store.dispatch(hideLoading());
    }
  }

  //get token
  async postForm(url: string, data: Record<string, string>, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    return this.api.post(url, formData.toString(), finalConfig);
  }

  /* async authPost(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const token = store.getState().auth.token;
      if (!token) {
        throw {
          type: "UNAUTHORIZED",
          message: "No auth token available",
        };

        //throw new Error("No auth token available");
      }

      const finalConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...(config?.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      };
      const answer = await this.api.post(url, data, finalConfig);
      return answer;
    } catch (error) {
      throw error;
    } finally {

    }

  } */

  /* async authGet(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const token = store.getState().auth.token;
      if (!token) {
        throw {
          type: "UNAUTHORIZED",
          message: "No auth token available",
        };

        //throw new Error("No auth token available");
      }

      const finalConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...(config?.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await this.api.get(url, finalConfig);
      return response;
    } catch (error) {
      throw error;
    } finally {
      //store.dispatch(hideLoading());
    }
  }
 */
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // AsyncStorage helper
  async GetValue(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error: any) {
      return null;
    }
  }

  async SetValue(key: string, val: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      throw error;
    } finally {

    }
  }

  async RemoveValue(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw error;
    } finally {

    }
  }


}

/* const logApiError = (label: string, error: any) => {
  console.error(label, {
    message: error?.message,
    status: error?.response?.status,
    url: error?.config?.url,
  });

  Sentry.captureException(error, {
    tags: {
      type: 'api',
    },
    extra: {
      label,
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      response: error?.response?.data,
    },
  });
};

const logApiBusinessError = (response: any) => {

  const url = response?.config?.url;

  Sentry.captureMessage(`API Business Error: ${url}`, {
    level: "warning", // or "error" if critical
    tags: {
      type: "api",
      category: "business",
    },
    extra: {
      url: response?.config?.url,
      method: response?.config?.method,
      status: response?.status,
      statusMessage: response?.data?.StatusMessage,
      data: response?.data,
    },
  });
}; */


export { ApiClient, endpoints as ENDPOINTS };
