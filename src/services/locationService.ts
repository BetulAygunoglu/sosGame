/* import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import CheckGps from '../native/checkGps.ts';

class LocationService {
    private static instance: LocationService;
    private watchId: number | null = null;

    private constructor() {
        LocationService.setConfiguration();
    }

    static getInstance() {
        if (!LocationService.instance) {
            LocationService.instance = new LocationService();
        }
        return LocationService.instance;
    }

    static setConfiguration() {

        Geolocation.setRNConfiguration({
            skipPermissionRequests: false,
            authorizationLevel: 'whenInUse', // iOS only
            enableBackgroundLocationUpdates: true, // iOS only
            locationProvider: 'playServices', // Android only
        });

    }

    async requestLocationPermission(): Promise<boolean> {

        if (Platform.OS === 'android') {

            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("permission granted");
                    //CheckGps.openGpsSettings();
                    return true;
                }
                else {
                    console.warn("permission not granted for location");
                    return false;
                }
            } catch (error) {
                console.error("catch requestLocationPermission");
                return false;
            }

        }

        // iOS: request explicitly
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization(); // this just shows the prompt
        }

        return true;
    }

    async getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
        const hasPermission = await this.checkPermission();
        if (!hasPermission) return null;

        const enabled = await this.isGpsEnabled();
        if (!enabled) return null;

        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    if (position?.coords) {
                        const { latitude, longitude } = position.coords; //position.coords {latitude: 40.22242917101802, longitude: 28.858875615343074}
                        console.log("Latitude:", latitude, "Longitude:", longitude);
                        resolve({ latitude, longitude });
                    } else {
                        console.warn("Konum ayarlarına erişilemedi!");
                        resolve(null);
                    }
                },
                (error) => {
                    console.error('getCurrentPosition error', JSON.stringify(error));
                    reject(error);
                },
                { enableHighAccuracy: false }
            );
        });
    }

    async startTracking(onLocation: (position: any) => void, onError?: (error: any) => void) {
        const hasPermission = await this.checkPermission();
        if (!hasPermission) return;

        this.watchId = Geolocation.watchPosition(
            onLocation,
            onError || ((error) => console.error('Location error:', error)),
            {
                enableHighAccuracy: false,
                distanceFilter: 10,
                interval: 5000,
                fastestInterval: 2000,
            }
        );
    }

    stopTracking() {
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    private async checkPermission(): Promise<boolean> {
        return this.requestLocationPermission();
    }

    async isGpsEnabled() { // Yalnızca konumun açık olup olmadığına bakar
        try {
            if (Platform.OS === 'ios') {
                // iOS'ta konum izni zaten verilmişse GPS'in açık olduğunu varsayıyoruz
                return true;
            }
            const result = await CheckGps.isGpsEnabled();
            //alert("GPS AÇIK MI : " + result);
            console.log("GPS AÇIK MI : ", result)

            return result;


        } catch (error) {
            console.error('GPS kontrol hatası', error);
            console.log("GPS AÇIK MI HATASI : ")
            //Alert.alert(lang('konumac'));
            // store.dispatch(showModal({
            //                                     title: lang('bilgilendirme'),
            //                                     description: lang('konumhatasi1'),
            //                                     iconType: "info",
            //                                     confirmText: lang('tamam'),
            //                                     cancelText: undefined,
            //                                     onConfirm: ModalActionType.JUST_CLOSE,
            //                                     onClose: ModalActionType.JUST_CLOSE
            //                                 }));
            return false;
        }
    };


}
export default LocationService.getInstance(); */