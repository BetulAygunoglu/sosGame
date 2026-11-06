//import * as Sentry from '@sentry/react-native';

//import firebaseService from "../services/firebaseService";

enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

class Logger {
  private static instance: Logger;
  private readonly minLevel: LogLevel;

  private constructor() {
    // Release build'de INFO logları ciddi performans maliyeti yaratabiliyor.
    // RN globali: __DEV__ true ise geliştirme modu.
    // @ts-expect-error __DEV__ RN global
    const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : false;
    this.minLevel = isDev ? LogLevel.INFO : LogLevel.WARN;
    // Sentry.init({
    //   dsn: "https://your_sentry_dsn",
    //   tracesSampleRate: 1.0,
    // });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(message: string | object): string {
    return typeof message === "object" ? JSON.stringify(message, null, 2) : message;
  }

  private shouldLog(level: LogLevel) {
    const order: Record<LogLevel, number> = {
      [LogLevel.INFO]: 10,
      [LogLevel.WARN]: 20,
      [LogLevel.ERROR]: 30,
      [LogLevel.FATAL]: 40,
    };
    return order[level] >= order[this.minLevel];
  }

  private logToConsole(level: LogLevel, message: string | object) {
    if (!this.shouldLog(level)) return;
    const formattedMessage = `[${level}]: ${this.formatMessage(message)}`;
    switch (level) {
      case LogLevel.INFO:
        console.log(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage);
        break;
    }
  }

  /* private logToSentry(level: LogLevel, message: string | object, error?: Error) {
    if (error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(`[${level}] ${this.formatMessage(message)}`);
    }
  } */

  info(message: string | object) {
    //  firebaseService.logEvent("info", { message: this.formatMessage(message) });
    this.logToConsole(LogLevel.INFO, message);
    //this.logToSentry(LogLevel.INFO, message);
  }

  infoClick(method: string, message: string | object) {
    //firebaseService.logEvent(method);
    this.logToConsole(LogLevel.INFO, message);
    //this.logToSentry(LogLevel.INFO, message);
  }

  warn(message: string | object) {
    this.logToConsole(LogLevel.WARN, message);
    //this.logToSentry(LogLevel.WARN, message);
  }

  error(error: Error, context?: object) {
    const errorMessage = context ? { error: error.message, context } : error.message;
    this.logToConsole(LogLevel.ERROR, errorMessage);
    //this.logToSentry(LogLevel.ERROR, errorMessage, error);
  }

  fatal(error: Error, context?: object) {
    const errorMessage = context ? { error: error.message, context } : error.message;
    this.logToConsole(LogLevel.FATAL, errorMessage);
    //this.logToSentry(LogLevel.FATAL, errorMessage, error);
  }
}
export default Logger;
// Kullanım Örneği:
// const logger = Logger.getInstance();


// logger.info("Sistem başlatıldı.");
// logger.warn({ message: "Dikkat! Disk alanı azalıyor.", freeSpace: "5GB" });
// logger.error(new Error("Sunucuya bağlanırken hata oluştu!"), { endpoint: "/api/login", userId: 123 });
// logger.fatal(new Error("Uygulama çöktü!"), { criticalData: { activeUsers: 1000, lastAction: "checkout" } });
