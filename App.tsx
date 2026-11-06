import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  Appearance,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import DeviceInfo from 'react-native-device-info';
import { NetworkService } from './src/services';
import { store, persistor, RootState } from './src/redux/store';
import AppRouter from './src/navigation/router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/i18n/index';

//import firebaseService from './src/services/firebaseService';
//import 'react-native-reanimated';

import CustomModal from './src/components/modal/informationModal';
//import * as Sentry from '@sentry/react-native';
import { ApiClient } from './src/api/apiClient';
import { setLanguage } from './src/redux/slices/languageSlice';
import i18n from './src/i18n/index';
import { getLocales } from 'react-native-localize';

/* Sentry.init({
  dsn: 'https://6fd63c97017a733382f97a1c324871b2@o4510424392859648.ingest.de.sentry.io/4510469753667664',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

ErrorUtils.setGlobalHandler((error, isFatal) => {
  Sentry.captureException(error, {
    tags: { isFatal: String(isFatal) },
  });
}); */

function MainApp(): React.JSX.Element {
  const dispatch = useDispatch();
  const apiClient = ApiClient.getInstance();
  const networkService = new NetworkService(dispatch);
  const modalState = useSelector((state: any) => state.modal);

  const language = useSelector(((state: any) => state.language.language));

  const MARGIN = 8;
  const WIDTH = Dimensions.get('window').width - 2 * MARGIN;

  /* useEffect(() => {
    setTimeout(() => {
      console.log(":boom: SENTRY TESTİ BAŞLIYOR... Uygulama bilerek çökertilecek!");

      // 1. Yöntem: Sessiz Hata Yakalama (Uygulama çökmez, panele düşer)
      Sentry.captureException(new Error("sentry test hatası."));

      // 2. Yöntem: Gerçek JS Çökmesi (Uygulamayı patlatır, Sentry'nin otomatik yakalaması test edilir)
      // throw new Error(":boom: SENTRY GERÇEK CRASH TESTİ!");

    }, 1000);
  }, []) */

  useEffect(() => {

    const colorScheme = Appearance.getColorScheme();
    console.log('Şu anki tema : ', colorScheme);

    if (colorScheme == 'dark') {
      Appearance.setColorScheme('light');
    }
    getUniqueId();

    networkService.startListening();
    return () => {
      networkService.stopListening();
    };
  }, []);

  useEffect(() => {
    if (language) {
      changeLang(language);
    } else {
      const deviceLang = getLocales()[0]?.languageCode ?? "tr";
      changeLang(deviceLang);
    }
  }, [])

  const getUniqueId = async () => {
    let deviceId = await DeviceInfo.getUniqueId();
    console.log("plix version: ", DeviceInfo.getVersion()) //versionName
    console.log("plix name: ", DeviceInfo.getBuildNumber()) //versionCode
    //Alert.alert(`Device ID : ${deviceId}`)
    //OneSignal.User.addTag("deviceId", deviceId); // Onesignal sunucusuna etiket göndermek için

    /* Sentry.setContext('device', {
      id: deviceId,
      manufacturer: await DeviceInfo.getManufacturer(),
      appVersion: DeviceInfo.getVersion(),
      buildNumber: DeviceInfo.getBuildNumber(),
    }); */

  };

  const changeLang = async (langCode: any) => {
    i18n.changeLanguage(langCode);   // anında tüm projede değişir
    apiClient.setLanguage(langCode);
    dispatch(setLanguage(langCode));
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'transparent' }}>

      <CustomModal
        visible={modalState.visible}
        title={modalState.title}
        description={modalState.description}
        iconType={modalState.iconType ? modalState.iconType : null} // "warning" ya da "card" da olabilir
        onClose={modalState.onClose} //() => dispatch(hideModal())
        onConfirm={modalState.onConfirm}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        titleSize={20}
      />

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content" // veya dark-content
      />

      <AppRouter />

    </GestureHandlerRootView>
  );
}
function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  );
}

//export default Sentry.wrap(App);
export default App;

//-------------------------- original App.tsx --------------------------

//original App.tsx
/* import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App; */
