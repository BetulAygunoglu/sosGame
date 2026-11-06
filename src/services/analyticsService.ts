import { logEvent, setUserId, setUserProperties, getAnalytics, isSupported } from "firebase/analytics";

// Firebase Analytics başlatma (Destekliyorsa)
let analytics: any;
isSupported()
    .then((supported: any) => {
        if (supported) {
            analytics = getAnalytics();
            console.log("✅ Firebase Analytics Başlatıldı");
        } else {
            console.warn("⚠️ Firebase Analytics Desteklenmiyor");
        }
    })
    .catch((error: any) => {
        console.error("❌ Firebase Analytics başlatılamadı:", error);
    });

// **Genel Analytics Servisi**
const AnalyticsService = {
    // **Sayfa görüntüleme kaydı**
    logPageView: (pageName: string) => {
        try {
            if (!analytics) return;
            console.log(`📊 Sayfa Görüntüleme: ${pageName}`);
            logEvent(analytics, "page_view", { page_title: pageName });
        } catch (error: any) {
            AnalyticsService.logError("logPageView hatası", { message: error.message });
        }
    },

    // **Özel olay (event) kaydı**
    logEvent: (eventName: string, params?: Record<string, any>) => {
        try {
            if (!analytics) return;
            console.log(`📌 Olay Kaydedildi: ${eventName}`, params);
            logEvent(analytics, eventName, params);
        } catch (error: any) {
            AnalyticsService.logError("logEvent hatası", { eventName, message: error.message });
        }
    },

    // **Kullanıcı tanımlama**
    setUser: (userId: string) => {
        try {
            if (!analytics) return;
            console.log(`👤 Kullanıcı Tanımlandı: ${userId}`);
            setUserId(analytics, userId);
        } catch (error: any) {
            AnalyticsService.logError("setUser hatası", { userId, message: error.message });
        }
    },

    // **Kullanıcı özellikleri tanımlama (Premium kullanıcı, dil tercihi vb.)**
    setUserProperties: (properties: Record<string, any>) => {
        try {
            if (!analytics) return;
            console.log(`⚙️ Kullanıcı Özellikleri Güncellendi:`, properties);
            setUserProperties(analytics, properties);
        } catch (error: any) {
            AnalyticsService.logError("setUserProperties hatası", { properties, message: error.message });
        }
    },

    // **Hata kaydı**
    logError: (error: string, details?: Record<string, any>) => {
        try {
            if (!analytics) return;
            console.error(`❌ Hata Kaydedildi: ${error}`, details);
            logEvent(analytics, "exception", { description: error, ...details });
        } catch (err: any) {
            console.error("🚨 logError çalıştırılamadı:", err.message);
        }
    },

    // **Uygulama başlatma**
    logAppStart: () => {
        try {
            if (!analytics) return;
            console.log(`🚀 Uygulama Başlatıldı`);
            logEvent(analytics, "app_start");
        } catch (error: any) {
            AnalyticsService.logError("logAppStart hatası", { message: error.message });
        }
    },

    // **Bağlantı durumu değişikliklerini izleme**
    logConnectionStatus: (status: "online" | "offline") => {
        try {
            if (!analytics) return;
            console.log(`🌐 Bağlantı Durumu: ${status}`);
            logEvent(analytics, "connection_status", { status });
        } catch (error: any) {
            AnalyticsService.logError("logConnectionStatus hatası", { status, message: error.message });
        }
    },
};

export default AnalyticsService;
