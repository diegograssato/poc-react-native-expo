import AsyncStorage from '@react-native-async-storage/async-storage';
import StoreRepositoryImpl from './StoreRepositoryImpl';

const STORAGE_KEY = '@StorageLocationTracking';

export default class SessionRepositoryImpl {
  store: StoreRepositoryImpl;

  constructor() {
    this.store = new StoreRepositoryImpl();
  }

  public save = async (data: any): Promise<void> => {
    try {
      await this.store.save(STORAGE_KEY, data);
    } catch (e) {
      // saving error
    }
  };
  public get = async (): Promise<any> => {
    const jsonValue = await this.store.get(STORAGE_KEY);
    return jsonValue != null ? jsonValue : null;
  };

  public remove = async (): Promise<void> => {
    try {
      const jsonValue = await this.store.remove(STORAGE_KEY);
    } catch (e) {
      // saving error
    }
  };
}
