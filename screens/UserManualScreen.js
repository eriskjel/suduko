import React, {useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const UserManualScreen = ({ navigation }) => {
    const { t } = useTranslation();


    useEffect(() => {
        navigation.setOptions({
            title: t('User Manual'),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#5294e7'
            },
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerTintColor: 'white'
        });
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t('User Manual')}</Text>

            {/* Main Screen Section */}
            <Text style={styles.sectionTitle}>{t('Main Screen')}</Text>
            <Text style={styles.text}>{t('On the main screen, you have three options:')}</Text>
            <Text style={styles.listItem}>{t('1. Play Boards')}</Text>
            <Text style={styles.listItem}>{t('2. Generate Board')}</Text>
            <Text style={styles.listItem}>{t('3. Switch Language')}</Text>

            {/* Play Boards Section */}
            <Text style={styles.sectionTitle}>{t('Play Boards')}</Text>
            <Text style={styles.text}>{t('This option will direct you to a new screen where you can choose between Easy, Medium, and Hard difficulties.')}</Text>

            {/* Reset and Solve Buttons */}
            <Text style={styles.listItem}>{t('Reset Board Button: Resets the current board.')}</Text>
            <Text style={styles.listItem}>{t('Solve Button: Solves the current board.')}</Text>

            {/* Generate Board Section */}
            <Text style={styles.sectionTitle}>{t('Generate Board')}</Text>
            <Text style={styles.text}>{t('This will generate a new Sudoku board with a random difficulty level.')}</Text>

            {/* Switch Language Section */}
            <Text style={styles.sectionTitle}>{t('Switch Language')}</Text>
            <Text style={styles.text}>{t('This will allow you to switch the app language.')}</Text>

            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>{t('Back')}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 10,
    },
    backButton: {
        backgroundColor: '#5294e7',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default UserManualScreen;
