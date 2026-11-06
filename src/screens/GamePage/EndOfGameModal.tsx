import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Modal, Touchable, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import mainStyles from '../../styles/main_styles';
import { useTranslation } from 'react-i18next';

type Props = {
    visible: boolean;
    winner: number;
    player1sos: number;
    player2sos: number;
    onClose: () => void;
    onRestart: () => void;
    onGoToMainMenu: () => void;
}

const EndOfGameModal: React.FC<Props> = ({ visible, onClose, onRestart, onGoToMainMenu, player1sos, player2sos, winner }) => {

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const closeAndGoToMainMenu = () => {
        onClose();
        onGoToMainMenu();
    }

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onGoToMainMenu} transparent>

            <View style={mainStyles.modalOverlay}>
                <TouchableWithoutFeedback onPress={onGoToMainMenu}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <View style={mainStyles.eogModalCont}>
                    <Text style={mainStyles.eogText}>{t('endofgame')}</Text>
                    {winner === 0 ? <Text style={{ ...mainStyles.eogText, fontSize: 22 }}>{t('berabere') + "!"}</Text>
                        : <Text style={{ ...mainStyles.eogText, fontSize: 22 }}>{t('kazanan') + ": " + (winner === 1 ? t('player1') : t('player2') + "!")}</Text>}
                    <Text style={{ ...mainStyles.eogText, fontSize: 18 }}>{t('score')}</Text>
                    <Text style={{ ...mainStyles.eogText, fontSize: 18 }}>{t('player1') + ": " + player1sos}</Text>
                    <Text style={{ ...mainStyles.eogText, fontSize: 18 }}>{t('player2') + ": " + player2sos}</Text>
                    <TouchableOpacity style={mainStyles.eogButton}
                        onPress={() => onRestart()}>
                        <Text style={mainStyles.eogButtonTxt}>{t('restart')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={mainStyles.eogButton}
                        onPress={() => onGoToMainMenu()}>
                        <Text style={mainStyles.eogButtonTxt}>{t('anamenu')}</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    );
};

export default EndOfGameModal;
