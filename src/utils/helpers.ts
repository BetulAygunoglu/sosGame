import logger from "../logs/logger.ts"
import { useTranslation } from 'react-i18next';
//import firebaseService from "../services/firebaseService";

const log = logger.getInstance();
let lastTap = 0;
export const preventDoubleClick = (callback: (...args: any[]) => void, method = "", delay = 500) => {
  if (method != "") {
    log.infoClick(method, { message: "preventDoubleClick", delay: delay, method: method });
  }
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastTap < delay) {
      return;
    }
    lastTap = now;
    callback(...args);
  };
};

//export const { t: lang } = useTranslation();
export const useLang = () => {
  const { t: lang } = useTranslation();
  return lang;
};