import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from "react-i18next";
import i18n from "../translation";

const MainHomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const toggleLanguage = () => {
        if (currentLanguage === "en") {
            i18n.changeLanguage("no");
            setCurrentLanguage("no");
        } else {
            i18n.changeLanguage("en");
            setCurrentLanguage("en");
        }
    };

    return (
        <View style={styles.home}>
            <TouchableOpacity
                style={[styles.buttonContainer, { backgroundColor: "#28a745"}]}
                onPress={() => navigation.navigate('DifficultyScreen')}
            >
                <Text style={styles.buttonText}>{t('playBoards')}</Text>
            </TouchableOpacity>


            <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: "#ffcb00"}]} onPress={() => navigation.navigate('GameScreen', { fromAPI: true })}>
                <Text style={styles.buttonText}>{t('generateBoard')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: "#dc3545"}]} onPress={toggleLanguage}>
                <Text style={styles.buttonText}>
                    {currentLanguage === "en" ? t('switchToNorwegian') : t('switchToEnglish')}
                </Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('UserManualScreen')} >
                <Text style={styles.buttonText}>{t('userManual')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "70%",
        height: 100,
        borderRadius: 5,
        margin: 10,
        backgroundColor: '#5294e7'
    },
    buttonText: {
        fontSize: 24,
        color: 'white',
    },
});

export default MainHomeScreen;
