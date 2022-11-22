import AsyncStorage from '@react-native-async-storage/async-storage';

export default class StoreRepositoryImpl {
  public save = async (key: string, data: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // saving error
    }
  };
  public get = async (key: string): Promise<any> => {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };
 
  public remove = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // saving error
    }
  };
}
