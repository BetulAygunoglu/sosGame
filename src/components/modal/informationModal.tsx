import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback,Platform } from 'react-native';
//import { FontAwesome5 } from '../../assets/images/icons/icons';
import { hideModal, ModalActionType } from '../../redux/slices/modalSlice';
import { useDispatch } from 'react-redux';
import { modalActionTriggered } from '../../redux/actions/modalAction';
import { preventDoubleClick, useLang } from '../../utils/helpers';
import Modal from '../../utils/AppModal';
const { width } = Dimensions.get('window');

export type IconType = 'error' | 'info' | 'success';

interface CustomModalProps {
    visible: boolean;
    title?: string;
    description?: string;
    iconType?: IconType;
    onClose?: ModalActionType;
    onConfirm?: ModalActionType;
    confirmText?: string;
    cancelText?: string;
    iconWidth?: number;
    iconHeight?: number,
    titleSize?: number,
    descriptionSize?: number
}

// Burada component olarak saklıyoruz
/* const iconMap: Record<NonNullable<IconType>, React.FC<any>> = {*/ 

/* const iconMap: Record<NonNullable<IconType>, React.ReactNode> = {
    error: <FontAwesome5 name="exclamation-triangle" color="#E74C3C" />,
    info: <FontAwesome5 name="info-circle" color="#3498DB" />,
    success: <FontAwesome5 name="check-circle" color="#27AE60" />
}; */

const CustomModal = ({
    visible,
    title,
    description,
    iconType,
    onClose,
    onConfirm,
    confirmText,
    cancelText,
    iconWidth = 70,
    iconHeight = 70,
    titleSize = 16,
    descriptionSize = 14
}: CustomModalProps) => {

    const dispatch = useDispatch();
    const lang = useLang();

    //const Icon = iconType ? iconMap[iconType] : null;

    const handleConfirm = () => {
        dispatch(hideModal());
        if (onConfirm) {
            dispatch(modalActionTriggered(onConfirm));
        }
    };

    const handleClose = () => {
        dispatch(hideModal());
        if (onClose) {
            dispatch(modalActionTriggered(onClose));
        }
    };

    return (
        
        <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose}>
            <View style={styles.overlay}>

                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                <View style={styles.modal}>
                    {/* <Icon width={iconWidth} height={iconHeight} /> */}

                    {/* {Icon && (
                        <View style={{ marginBottom: 12 }}>
                            {Icon}
                        </View>
                    )} */}

                    {title && <Text style={styles.title}>{title}</Text>}
                    {description && <Text style={styles.description}>{description}</Text>}

                    <View style={[styles.buttonContainer, {
                        marginTop: description ? 0 : 15
                    }]}>
                        {onClose && cancelText ? (
                                <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>{cancelText}</Text>
                                </TouchableOpacity>
                        ) : null}
                        {onConfirm ? (
                            <TouchableOpacity onPress={preventDoubleClick(() => handleConfirm())} style={styles.confirmButton}>
                                <View>
                                    <Text style={[styles.confirmText]}>{confirmText}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default React.memo(CustomModal);


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: 'white',
        width: width * 0.85,
        borderRadius: 28,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontFamily: Platform.OS === 'ios' ? 'MullerBold' : 'Muller-Bold',
        color: '#151515',
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 24
    },
    description: {
        color: '#151515',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: Platform.OS === 'ios' ? 'MullerLight' : 'Muller-Light',
        lineHeight: 20,
        fontSize: 18
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    cancelButton: {
        flex: 0.5,
        borderWidth: 1,
        borderColor: '#151515',
        borderRadius: 25,
        alignItems: 'center',
        height: 50,
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    cancelButtonPayment: {
        flex: 0.5,
        borderWidth: 1,
        borderColor: "transparent",
        borderRadius: 25,
        alignItems: 'center',
        height: 50,
        justifyContent: "center",
        backgroundColor: "#E6F2E8"
    },
    cancelText: {
        color: '#151515',
        fontFamily: Platform.OS === 'ios' ? 'MullerBold' : 'Muller-Bold',
        fontSize: 20
    },
    cancelTextMoney: {
        color: '#151515',
        fontFamily: Platform.OS === 'ios' ? 'MullerMedium' : 'Muller-Medium',
        fontSize: 16
    },
    confirmButton: {
        backgroundColor: '#29A7DF',
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: "row",
        flex: 0.5
    },
    confirmText: {
        color: '#FCFCFB',
        fontFamily: Platform.OS === 'ios' ? 'MullerBold' : 'Muller-Bold',
        fontSize: 18,
        textAlign: "center"
    },
    textGreenMed14: { fontFamily: Platform.OS === 'ios' ? 'MullerMedium' : 'Muller-Medium', color: "#48C163", fontSize: 14 }
});
