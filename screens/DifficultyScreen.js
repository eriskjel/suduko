import React, {useEffect, useState} from 'react';
import {View, Button, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from "react-i18next";
import i18n from "../translation"; // Ensure the path is correct

const DifficultyScreen = ({ navigation, difficulty }) => {
    const { t } = useTranslation();

    useEffect(() => {
        navigation.setOptions({
            title: `Difficulty: ${difficulty}`,
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#5294e7'
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24,
                color: 'white'
            },
            headerTintColor: 'white'
        });
    }, [difficulty, navigation]);
    return (
        <View style={styles.home}>
            <Text style={styles.headerText}>{t('selectDifficulty')}</Text>
            <TouchableOpacity
                style={[styles.buttonContainer, styles.easyButton]}
                onPress={() => navigation.navigate('Game', { difficulty: 'easy' })}
            >
                <Text style={styles.buttonText}>{t('startEasy')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.buttonContainer, styles.mediumButton]}
                onPress={() => navigation.navigate('Game', { difficulty: 'medium' })}
            >
                <Text style={styles.buttonText}>{t('startMedium')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.buttonContainer, styles.hardButton]}
                onPress={() => navigation.navigate('Game', { difficulty: 'hard' })}
            >
                <Text style={styles.buttonText}>{t('startHard')}</Text>
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
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,  // Adds space below the header
        marginTop: -150,  // Adds space above the header
        color: '#5294e7'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "70%",
        height: 100,
        borderRadius: 5,
        margin: 10,
        maxWidth: "70%"
    },
    easyButton: {
        backgroundColor: '#28a745',
    },
    mediumButton: {
        backgroundColor: '#ffcb00',
    },
    hardButton: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        fontSize: 24,
        color: 'white',
    },
    languageButton: {
        marginTop: 20,
    },
    languageText: {
        fontSize: 24,
        color: '#5294e7',
    },
    generateButton: {
        backgroundColor: '#5294e7',
    }
});

export default DifficultyScreen;
