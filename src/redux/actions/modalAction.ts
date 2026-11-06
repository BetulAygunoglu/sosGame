import { ModalActionType } from "../slices/modalSlice";

export const modalActionTriggered = (actionType: ModalActionType) => ({
  type: "modal/ACTION_TRIGGERED",
  payload: actionType,
});
