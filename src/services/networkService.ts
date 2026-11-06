import NetInfo from '@react-native-community/netinfo';
import { Dispatch } from 'redux';
import { setNetworkStatus } from '../redux/slices/networkSlice';

class NetworkService {
  private unsubscribe?: () => void;

  constructor(private dispatch: Dispatch) {}

  public startListening() {
    if (!this.unsubscribe) {
      this.unsubscribe = NetInfo.addEventListener(state => {
        // Network durumu değiştiğinde Redux store'a güncellemeyi yapıyoruz
        this.dispatch(setNetworkStatus(!!state.isConnected)); // `!!` ile boolean'a dönüştürülüyor
      });
    }
  }

  public stopListening() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }
}

export default NetworkService;
