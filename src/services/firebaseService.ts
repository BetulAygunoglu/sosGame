/*  
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import remoteConfig from '@react-native-firebase/remote-config';


export class FirebaseService {
  // Analytics: Özel etkinlik kaydetme
  async logEvent(eventName: string, params?: { [key: string]: any }): Promise<void> {
    try {
      await analytics().logEvent(eventName, params);
      console.log(`✅ Event "${eventName}" başarıyla loglandı.`);
    } catch (error) {
      console.error(`❌ Event "${eventName}" loglanırken hata oluştu:`, error);
    }
  }

  // Analytics: Ekran görüntüleme kaydetme
  async setCurrentScreen(screenName: string): Promise<void> {
    await analytics().logScreenView({ screen_name: screenName, screen_class: screenName });
  }

  // Crashlytics: Özel hata kaydı
  async logError(error: Error): Promise<void> {
    await crashlytics().recordError(error);
  }

  // Crashlytics: Özel anahtar ayarlama
  async setCrashlyticsKey(key: string, value: string): Promise<void> {
    await crashlytics().setAttribute(key, value);
  }

  // Crashlytics: Özel günlük ekleme
  async logCrashlyticsMessage(message: string): Promise<void> {
    await crashlytics().log(message);
  }

  // Crashlytics: Test amacıyla uygulamayı çökertme
  async crashApp(): Promise<void> {
    crashlytics().crash();
  }
  // Remote Config: Ayarları yükle ve uygula
  async fetchSettings(): Promise<void> {
    try {
      remoteConfig()
      .setDefaults({
        awesome_new_feature: 'disabled',
      })
      .then(() => {
        remoteConfig().fetch(300) // 3600 saniye = 1 saat
      })
      .then(() => remoteConfig().activate())
      .then(fetchedRemotely => {
        if (fetchedRemotely) {
          console.log('Configs were retrieved from the backend and activated.');
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      })
      .catch(error => console.error('Error fetching remote config:', error));
      console.log('✅ Remote config fetch başarılı.');
    } catch (error) {
      console.error('❌ Remote config fetch hatası:', error);
    }
  }



  // Remote Config: Belirli bir ayarı getir
  getSetting(key: string): string | null {
    const value = remoteConfig().getValue(key);
    console.log(`✅ Remote config "${key}" ayarı:`, value.asString());
    return value.getSource() !== 'static' ? value.asString() : null;
  }
}
const firebaseService = new FirebaseService();

export default firebaseService */