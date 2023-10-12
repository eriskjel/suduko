import AsyncStorage from "@react-native-async-storage/async-storage";

export const printAsyncStorage = async () => {
    await AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (error, stores) => {
            stores.map((result, i, store) => {
                console.log({[store[i][0]]: store[i][1]});
                return true;
            });
        });
    });
}