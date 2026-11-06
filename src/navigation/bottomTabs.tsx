/* import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { Dimensions, StyleSheet, View, Text, Platform } from 'react-native';
import { scale } from 'react-native-size-scaling';
import AnimatedTabBar from './animatedTabBar';

export type BottomTabParamList = {
  Maps: undefined;
  HeyPass: { selectedSubItem?: any };
};

//const Tab = createBottomTabNavigator();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const { width } = Dimensions.get("window");

const BottomTabs = () => {

  const { user, customerId } = useSelector((state: any) => state.auth);

  return (
    <>
      <Tab.Navigator
        tabBar={(props) => <AnimatedTabBar {...props} />}
        // Geçiş performansı için: focus'ta olmayan screen'leri detach edelim.
        detachInactiveScreens={true}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
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

            //transform: [{ translateY }],
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          },
          // Tüm tab'ları baştan mount etme (ilk açılış + geçiş ağırlığı yapar).
          lazy: true,
          // RN Screens ile uyumluysa, blur'da screen'i dondurup ekstra render'ı azaltır.
          freezeOnBlur: true,
        }}
        initialRouteName="Maps"
      >
      </Tab.Navigator>
    </>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  icons: {
    //top: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
    verticalAlign: "middle",
    bottom: Platform.OS === 'ios' ? 0 : 15,
    width: scale(50),
    height: scale(50),
  },
  iconBack: {
    backgroundColor: "#29A7DF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    position: 'relative', // <--- important
    verticalAlign: "middle",
    bottom: 0,
  },
  badgeContainer: {
    position: 'absolute',
    top: 3,
    right: 6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#C40201", //C40201
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    zIndex: 999,
    borderColor: "#fff",
    borderWidth: 2,
  },
  activeTripBadge: {
    position: 'absolute',
    top: 7,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: "#ffff",
    borderColor: "#48C163",
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  badgeText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: Platform.OS === 'ios' ? 'MullerBold' : 'Muller-Bold',
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: "center",
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    opacity: 0.8,
  },
  toastText: {
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'MullerBold' : 'Muller-Bold',
    fontSize: 15
  },
});
 */