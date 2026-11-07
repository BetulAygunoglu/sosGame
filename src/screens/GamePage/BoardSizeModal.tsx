import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Modal, Touchable, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import mainStyles from '../../styles/main_styles';
import { useTranslation } from 'react-i18next';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSelect: (value: number) => void;
}

const BoardSizeModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const sizeArray = [3, 4, 5];

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>

            <View style={mainStyles.modalOverlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <View style={mainStyles.eogModalCont}>
                    <Text style= {mainStyles.blueText}>{t('setBoardSize')}</Text>
                    {sizeArray.map((item: any) => {
                        return (
                            <TouchableOpacity key={item} style={mainStyles.eogButton}
                                onPress={() => onSelect(item)}>
                                <Text style={mainStyles.eogButtonTxt}>{`${item}x${item}`}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>

        </Modal>
    );
};

export default BoardSizeModal;
