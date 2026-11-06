//customized app modal to be used instead of react native modal, 
// to handle tab bar visibility and back button behavior
//only use ıf a problems occurs wıth react natıve modal usage.

import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  BackHandler
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Açık olan modal sayısını global (dosya seviyesinde) takip edelim
let activeModalCount = 0;

const ORIGINAL_TAB_BAR_STYLE = {
  height: Platform.OS === 'ios' ? 70 : 80,
  width: width * 0.9,
  backgroundColor: '#fff',
  borderTopWidth: 0,
  borderRadius: 66,
  position: 'absolute',
  alignSelf: 'center',
  bottom: 20,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  marginHorizontal: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5
};

const Modal: React.FC<any> = ({ visible, onRequestClose, children }) => {
  let navigation: any = null;
  try { navigation = useNavigation(); } catch (e) { navigation = null; }

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
 
  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onRequestClose();  
        return true;  
      }
      return false;  
    };

    // Dinleyiciyi kaydet
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

     return () => backHandler.remove();
  }, [visible, onRequestClose]);

  useEffect(() => {
    const getTabBarNavigator = (nav: any): any => {
      try {
        if (!nav) return null;
        if (nav.getState()?.type === 'tab') return nav;
        return getTabBarNavigator(nav.getParent());
      } catch (err) { return null; }
    };

    const tabBarNav = navigation ? getTabBarNavigator(navigation) : null;

    if (visible) {
      // Yeni modal açıldı
      activeModalCount++;
      tabBarNav?.setOptions({ tabBarStyle: { display: 'none' } });

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true })
      ]).start();
    } else {
      // Modal kapandı (Ama bileşen hala orada olabilir)
      handleCloseLogic(tabBarNav);
    }

    return () => {
      // Bileşen tamamen unmount olduğunda
      if (visible) { 
        handleCloseLogic(tabBarNav);
      }
    };
  }, [visible, navigation]);

  const handleCloseLogic = (tabBarNav: any) => {
    if (activeModalCount > 0) activeModalCount--;

    // Eğer hala açık modal varsa Tab Bar'ı geri getirme!
    if (activeModalCount === 0) {
      tabBarNav?.setOptions({
        tabBarStyle: { ...ORIGINAL_TAB_BAR_STYLE, display: 'flex' }
      });
    }

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: true })
    ]).start();
  };

  if (!visible) return null;

    return (
    <Animated.View style={[styles.absoluteFill, { opacity }]}>
      {/* Arka plan karartması */}
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      {/* MODAL İÇERİĞİ - Burayı geri açtık çünkü görünürlüğü sağlayan bu katmanlardır */}
      {/* <View style={styles.container} pointerEvents="box-none">
        <Animated.View 
          style={[
            styles.modalBox, 
            { 
                transform: [{ scale }], 
                width: width * 0.85 // Modal genişliği
            }
          ]}
        > */}
          {children}
        {/* </Animated.View>
      </View> */}
    </Animated.View>
  );
};
 

// Styles aynı kalıyor...
const styles = StyleSheet.create({
  absoluteFill: { ...StyleSheet.absoluteFill, zIndex: 9999, elevation: 10 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.5)" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", borderRadius: 24, padding: 20, alignItems: "center" }
});

export default Modal;