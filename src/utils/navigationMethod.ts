import { NavigationContainerRef, StackActions } from '@react-navigation/native';

let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

export const navigate = (name: string, params?: object) => {
  if (navigationRef) {
    navigationRef.navigate(name, params);
  }
};

export const goBack = () => {
  if (navigationRef) {
    navigationRef.goBack();
  }
};

export const reset = (name: string, params?: object) => {
  if (navigationRef) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
};

export const replace = (name: string, params?: object) => {
  if (navigationRef) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
};

