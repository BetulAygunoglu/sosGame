import { store } from "../redux/store";

export function dispatchWithPromise(actionType: string) {
  return new Promise<void>((resolve) => {
    const unsubscribe = store.subscribe(() => {
      const actions = store.getState();
      if (actions.location?.lastAction === actionType) {
        unsubscribe();
        resolve();
      }
    });
  });
}