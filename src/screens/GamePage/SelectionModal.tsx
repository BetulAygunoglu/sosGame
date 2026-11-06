import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Modal, Touchable, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import mainStyles from '../../styles/main_styles';

type Props = {
    visible: boolean;
    onClose: () => void;
    onSelect: (value: number) => void;
}

const SelectionModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {

    const dispatch = useDispatch();

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>

            <View style={mainStyles.modalOverlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <View style={mainStyles.selModalCont}>
                    <TouchableOpacity style={mainStyles.sModalBox}
                        onPress={() => { onSelect(1), onClose() }}>
                        <Text style={mainStyles.modalBoxTxt}>S</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...mainStyles.sModalBox, borderColor: "#F40BC5", backgroundColor: "rgba(244, 11, 197, 0.1)"
                    }}
                        onPress={() => { onSelect(0), onClose() }}>
                        <Text style={{ ...mainStyles.modalBoxTxt, color: "#F40BC5" }}>O</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    );
};

export default SelectionModal;
