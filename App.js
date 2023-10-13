import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import DifficultyScreen from "./screens/DifficultyScreen";
import GameScreen from "./screens/GameScreen";
import {useTranslation} from "react-i18next";
import HomeScreen from "./screens/HomeScreen";
import {fetchData, storeData} from "./utilities/storage";
import React, { useEffect } from 'react';
import data from "./assets/data.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import {hashArray} from "./utilities/hash";
import {printAsyncStorage} from "./utilities/async";
import UserManualScreen from "./screens/UserManualScreen";




const Stack = createStackNavigator();


const initialDataSetup = async () => {
    await AsyncStorage.clear();
    try {
        const value = await fetchData();
        if (value === null) {
            // Assign an ID to the initial data
            data.newboard.grids = data.newboard.grids.map(board => ({
                ...board,
                id: hashArray(board.value)
            }));
            await storeData(data);
        }
        else {
            console.log("data already exists")
        }
    } catch(e) {
        console.error("Error reading data", e);
    }
}


const App = () => {
    const { t } = useTranslation();


    useEffect(() => {
        initialDataSetup().then(r => console.log("Initial data setup complete"));
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                        headerShown: true,
                        headerTitle: t("welcome"),
                        headerTitleAlign: "center",
                        headerStyle: {
                            backgroundColor: "#5294e7",
                        },
                        headerTitleStyle: {
                            fontWeight: "bold",
                            fontSize: 24,
                            color: "white",
                        },
                    }}
                />
                <Stack.Screen
                    name="DifficultyScreen"
                    component={DifficultyScreen}
                    options={{
                        headerShown: true,
                        headerTitle: t("selectDifficulty"),
                        headerTitleAlign: "center",
                        headerStyle: {
                            backgroundColor: "#5294e7",
                        },
                        headerTitleStyle: {
                            fontWeight: "bold",
                            fontSize: 24,
                            color: "white",
                        },
                    }}
                />
                <Stack.Screen name="GameScreen" component={GameScreen} />
                <Stack.Screen name="UserManualScreen" component={UserManualScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

