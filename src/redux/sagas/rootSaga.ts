import { all } from "redux-saga/effects";
import modalSaga from "./modalSaga";

export default function* rootSaga() {
  yield all([
    modalSaga()
  ]);
}
