/* import {ApiClient, ENDPOINTS} from './apiClient.ts';

class GoogleAuthService {
  private static instance: GoogleAuthService;
  private apiClient: ApiClient;

  private constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  //google token validation
  async validateToken(idToken: string){
    try {
        const response = await this.apiClient.post(`/api/Auth/VerifyGoogle?idToken=${idToken}`, {});

        console.log("api response: ", response);
        //response.data: access_token, email, lastName, name, userId

        if(response.status == 200){
          return response.data;
        }

    } catch (error) {
      console.error("google validate token error: ", error);
        throw new Error("token validation failed");
         
    }
  }

  setAccountId(userId: string){

  }

  // Token'ı sakla
  setAuthToken(token: string) {
    
  }

  // Token'ı al
  getAuthToken(): string | null {
    return ""
  }

  logout() {
    console.log("log out");
  }

  // Token Yenileme
  async refreshAuthToken() {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const response = await this.apiClient.post("/authgoogle/refresh-token", {
        token,
      });
      this.setAuthToken(response.data.token);
      return response.data;
    } catch (error) {
      throw new Error("Token refresh failed");
    }
  }

  // Kullanıcı Giriş Durumunu Kontrol Etme
  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }
}
export default GoogleAuthService;
 */