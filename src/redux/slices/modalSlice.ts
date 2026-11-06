import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IconType } from "../../components/modal/informationModal";

export enum ModalActionType {
  LOGOUT = "LOGOUT",
  JUST_CLOSE = "JUST_CLOSE",
}

export type ModalState = {
    visible: boolean;
    title?: string;
    description?: string;
    iconType?: IconType;
    onClose?: ModalActionType; //() => void;
    onConfirm?: ModalActionType; //() => void;
    successFulPaymentAmount?: string;
    confirmText?: string;
    cancelText?: string;
    iconWidth?: number;
    iconHeight?: number,
    titleSize?: number,
    descriptionSize?: number
};

const initialState: ModalState = {
    visible: false,
    title: undefined,
    description: undefined,
    iconType: 'error',
    onClose: undefined,
    onConfirm: undefined,
    successFulPaymentAmount: undefined,
    confirmText: 'Tamam',
    cancelText: 'Vazgeç',
    iconWidth: 70,
    iconHeight: 70,
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<Partial<ModalState>>) => {
            return { ...state, ...action.payload, visible: true };
        },
        hideModal: () => initialState,
    },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
