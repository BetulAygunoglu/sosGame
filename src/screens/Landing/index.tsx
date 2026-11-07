import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useDispatch } from 'react-redux';
import i18n from '../../i18n';
import { ApiClient } from '../../api/apiClient';
import { setLanguage } from '../../redux/slices/languageSlice';
import mainStyles from '../../styles/main_styles';
import { t } from 'i18next';
import { navigate } from '../../utils/navigationMethod';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {

  const dispatch = useDispatch();
  
  const { t } = useTranslation();

  const apiClient = ApiClient.getInstance();

  const [playerMode, setPlayerMode] = useState<number>(0);

  const changeLang = async (langCode: any) => {
    i18n.changeLanguage(langCode);   // anında tüm projede değişir
    apiClient.setLanguage(langCode);
    dispatch(setLanguage(langCode));
  }

  const playerModes = [
    {
      label: t('singlePlayer'), //human vs AI
      value: 0,
    },
    {
      label: t('multiPlayer'), //human vs human
      value: 1,
    },
    {
      label: t('playWithAI'), //AI vs AI
      value: 2,
    }
  ]

  const changePlayerMode = async (mode: number) => {
    setPlayerMode(mode);
    navigate("GamePage", { playerMode: mode });
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('../../assets/images/background_image.jpg')}
        style={mainStyles.imageStyle}>
          <TouchableOpacity onPress={() => changeLang(i18n.language === 'en' ? 'tr' : 'en')}
            style={{ position: 'absolute', top: 50, right: 20, backgroundColor: "#FFF5CC", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
            <Text style={{ color: "#07199C", fontWeight: "bold" }}>{i18n.language === 'en' ? 'TR' : 'EN'}</Text>
          </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={mainStyles.bigHeader}>{t('sos')}</Text>

          <View style={mainStyles.buttonsContainer}>
            {playerModes.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => changePlayerMode(item.value)}
                style={mainStyles.button}>
                <Text style={mainStyles.buttonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LandingPage;
