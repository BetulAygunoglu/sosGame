import { takeEvery, put, select, call } from "redux-saga/effects";
import { ModalActionType } from "../slices/modalSlice";
import { SagaIterator } from "redux-saga";
import { navigate, reset } from "../../utils/navigationMethod";

function* handleModalAction(action: any): SagaIterator {

    switch (action.payload) {

        case ModalActionType.JUST_CLOSE:
            break;

        /* case ModalActionType.LOGOUT:
            console.log("go logout")
            //yield put(logoutRequest());
            break;

        case ModalActionType.NAVIGATE_RIDE_HISTORY:
            yield put({ type: "modal/NAVIGATE", payload: { name: "MyRideHistory" } });
            break;

        case ModalActionType.RESET_TO_RIDE_HISTORY:
            yield put({ type: "modal/RESET", payload: { name: "MyRideHistory" } });
            break;

        case ModalActionType.RESET_TO_MAPS:
            yield put({
                type: "modal/RESET", payload: {
                    name: "MainTabScreens", state: {
                        routes: [{ name: 'Maps' }],
                    }
                }
            });
            //reset("MainTabScreens", {routes: [{ name: 'Maps' }]});
            break; */

        default:
            break;
    }
}

function* navigationSaga(action: any) {
    navigate(action.payload.name);
}

function* navigationSagaOnlyProfile(action: any) {
    navigate("MainTabScreens", { screen: action.payload.name });
}

function* navigationReset(action: any) {
    reset(action.payload.name, action.payload.state);
}

export default function* watchModalActions() {
    yield takeEvery("modal/ACTION_TRIGGERED", handleModalAction);
    yield takeEvery("modal/NAVIGATE", navigationSaga);
    yield takeEvery("modal/NAVIGATEPROFILE", navigationSagaOnlyProfile);
    yield takeEvery("modal/RESET", navigationReset);
}
