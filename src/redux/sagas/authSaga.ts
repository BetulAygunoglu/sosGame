/* import { takeLatest, call, put } from "redux-saga/effects";
import { getTerritoryId } from "../slices/authSlices";
import { SagaIterator } from "redux-saga";
import { showLoading, hideLoading } from '../slices/loadingSlice';
import GeneralService from "../../api/generalService";
import { OneSignal } from 'react-native-onesignal';
import { showErrorModal } from "../helpers/showErrorModal";
import { protectedApiCall } from "../helpers/tokenControl";
import { persistor } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reset } from "../../utils/navigationMethod";
import { lang } from "../../i18n/lang";

function* handleTerritoryId(action: any): SagaIterator {
  try {
    console.log("handleTerritoryId saga called with payload: ", action.payload);
    const generalService = GeneralService.getInstance();
    console.log("generalService: ", JSON.stringify(generalService));

    const response = yield call([generalService, generalService.getTerritoryId],
      action.payload.lat,
      action.payload.lng,
    );
    console.log("lilix saga response territoryId : ", response)
    if (response.IsSuccess) {
      yield put(getTerritoryId(response.Data));

      if (action.meta?.onSuccess) {
        action.meta.onSuccess();
      }
    } else {
      yield put(showErrorModal(response.StatusMessage));
    }

  } catch (error: any) {
    console.error("handleTerritoryId failed:", error.message);
    action.meta?.onError?.();
    yield put(showErrorModal(lang('birsorunolustu')));
    error.customMessage = "handleTerritoryId failed";
    throw error;
  }
}

function* handleLogout(): SagaIterator {
  yield put(showLoading());
  console.log("logout hook")
  yield put({ type: "auth/logout" });

  yield call(persistor.purge);
  yield call(AsyncStorage.clear);
  yield call([OneSignal.User, OneSignal.User.removeTag], "userId");

  yield put(hideLoading());
  reset('Landing');
}

export default function* authSaga() {
  yield takeLatest("auth/territoryIdRequest", handleTerritoryId);
  yield takeLatest("auth/logoutRequest", handleLogout);
}
 */