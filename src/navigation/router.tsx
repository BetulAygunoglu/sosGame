import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigate, setNavigationRef } from '../utils/navigationMethod';

import { DefaultTheme, DarkTheme } from '@react-navigation/native';

import Landing from '../screens/Landing/index.tsx';

//import BottomTabs from './bottomTabs';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store.ts';
import GamePage from '../screens/GamePage/index.tsx';

export type RootStackParamList = {
  Landing: undefined;
  GamePage: { playerMode: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    text: '#000000',
    // İstediğin light renkleri burada belirle
  },
};

const lightTheme = {
  colors: {
    primary: '#007bff',
    background: '#ffffff',
    text: '#000000',
    card: '#f5f5f5',
    border: '#e0e0e0',
  },
  // varsa font veya spacing gibi şeyler de ekleyebilirsin
};


const MainStack = () => (
  <Stack.Navigator
    initialRouteName="Landing"
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}>
    <Stack.Screen name="Landing" component={Landing} />
    <Stack.Screen name="GamePage" component={GamePage} />

    {/* <Stack.Screen name="MainTabScreens" component={BottomTabs} options={{ animation: 'none' }} /> */}
  </Stack.Navigator>
);

const AppNavigator = () => {

  return (

    <NavigationContainer ref={(ref) => setNavigationRef(ref as any)}>

      <MainStack />

    </NavigationContainer>

  );
};

export default AppNavigator;

