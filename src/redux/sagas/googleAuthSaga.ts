/* import { takeLatest, call, put } from "redux-saga/effects";
import { googleLogin, googleLogout } from "../slices/authSlices";
import GoogleAuthService from "../../api/googleAuthService"; 
import { SagaIterator } from "redux-saga";

function* handleGoogleLogin(action: any): SagaIterator {
  try {
    const googleAuthService = GoogleAuthService.getInstance();
    const response = yield call([googleAuthService, googleAuthService.validateToken], action.payload.idToken);

    if(response){
      const user = {
        access_token: response.access_token,
        expires_in: response.expires_in,
        userId: response.userId,
        name: response.name,
        lastName: response.lastName,
        email: response.email
      };
  
      console.log("call slice to save user");
      
      yield put(googleLogin(user));  
    }

  } catch (error: any) {
    console.error("handleGoogleLoginError: ", error);
  }
}

function* handleGoogleLogout(action: any): SagaIterator {
  try {
    const googleAuthService = GoogleAuthService.getInstance();
    yield call([googleAuthService, googleAuthService.logout]);
    //yield put(logout());
    yield put(googleLogout());
    
    if (action.meta?.onSuccess) {
      action.meta.onSuccess();
    }
  } catch (error: any) {
    console.error("handleGoogleLogout failed:", error.message);
  }
}

export default function* googleAuthSaga() {
  yield takeLatest("authgoogle/loginRequest", handleGoogleLogin);
  yield takeLatest("authgoogle/logoutRequest", handleGoogleLogout);
}
 */