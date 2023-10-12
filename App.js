import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";
import DifficultyScreen from "./screens/DifficultyScreen";
import GameScreen from "./screens/GameScreen";
import {useTranslation} from "react-i18next";
import HomeScreen from "./screens/HomeScreen";
import {fetchData, storeData} from "./utilities/storage";
import React, { useEffect } from 'react';
import data from "./assets/data.json";




const Stack = createStackNavigator();

const initialDataSetup = async () => {
    try {
        const value = await fetchData();
        if (value === null) {
            await storeData(data);  // Assuming `data` is your imported JSON data
        }
    } catch(e) {
        console.error("Error reading data", e);
    }
}

// Inside your component's useEffect that runs once:


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
                <Stack.Screen name="Game" component={GameScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

