import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Board from '../components/Board';
import data from '../assets/data.json';
import i18n from "../translation";
import {useTranslation} from "react-i18next";

const GameScreen = ({ route, navigation }) => {
    const { difficulty = 'easy' } = route.params ?? {};
    const { t } = useTranslation();
    const [isFromAPI, setIsFromAPI] = useState(false);




    const [board, setBoard] = useState(generateInitialBoard());

    const [selectedCell, setSelectedCell] = useState({row: null, col: null});
    const [selectedNumber, setSelectedNumber] = useState(null);


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

    /*useEffect(() => {
        try {
            const jsonBoard = data[difficulty].puzzle; // Changed from easyData[difficulty]
            const initialBoard = transformBoard(jsonBoard);
            setBoard(initialBoard);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [difficulty]);*/

    const transformAPIData = (data) => {
        return {
            puzzle: data.value,
            solution: data.solution
        };
    };


    useEffect(() => {
        if (route.params?.fromAPI) {
            fetch('https://sudoku-api.vercel.app/api/dosuku')
                .then(response => response.json())
                .then(data => {
                    const transformedData = transformAPIData(data.newboard.grids[0]);
                    setBoard(transformedData.puzzle);
                    setIsFromAPI(true);
                })
                .catch(error => console.error('Error fetching data:', error));
        } else {
            try {
                const jsonBoard = isFromAPI ? board : data[difficulty].puzzle;
                const initialBoard = transformBoard(jsonBoard);
                setBoard(initialBoard);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }, [difficulty]);



    const resetBoard = () => {
        const newBoard = board.map((row) =>
            row.map((cell) => ({
                ...cell,
                value: cell.readOnly ? cell.value : 0,
            }))
        );
        setBoard(newBoard);
        setSelectedCell({ row: null, col: null }); // Clear the selected cell
        setSelectedNumber(null); // Clear the selected number
    };



    const handleCellClick = (row, col, newNumber = null) => {
        if (newNumber !== null) {
            const newBoard = [...board];
            newBoard[row][col].value = newNumber;
            setBoard(newBoard);
        }
        setSelectedCell({ row, col });
    };


    const transformBoard = (jsonBoard) => {
        return jsonBoard.map(row => {
            return row.map(cell => {
                return {
                    value: cell,
                    readOnly: cell !== 0  // if cell contains a number, make it read-only
                };
            });
        });
    };

    const handleNumberClick = (number) => {
        if (selectedCell.row !== null && selectedCell.col !== null) {
            const newBoard = [...board];
            if (!newBoard[selectedCell.row][selectedCell.col].readOnly) {
                newBoard[selectedCell.row][selectedCell.col].value = number;
                setBoard(newBoard);

                let nextRow = selectedCell.row;
                let nextCol = selectedCell.col + 1;

                // Check if we've reached the end of the current row
                if (nextCol >= 9) {
                    nextRow++;
                    nextCol = 0; // Move to the first column of the next row
                }

                // Find the next empty cell and select it
                for (; nextRow < 9; nextRow++) {
                    for (; nextCol < 9; nextCol++) {
                        if (!newBoard[nextRow][nextCol].readOnly) {
                            setSelectedCell({ row: nextRow, col: nextCol });
                            return;
                        }
                    }
                    // If we reach the end of the current row, reset nextCol to 0
                    nextCol = 0;
                }
            }
        } else {
            alert('Please select a valid cell first!');
        }
        setSelectedNumber(number);
    };


    const handleSolve = () => {
        const flattenedBoard = board.flat().map((cell) => cell.value);

        const flattenedSolution = data[difficulty].solution.flat();

        const isSolved = JSON.stringify(flattenedBoard) === JSON.stringify(flattenedSolution);

        if (isSolved) {
            alert('You solved the puzzle!');
        }
        else {
            alert('Not quite right. Try again.');
        }
    }



    return (
        <View style={styles.container}>
            <View style={styles.boardContainer}>
                <Board
                    board={board}
                    onCellClick={handleCellClick}
                    selectedNumber={selectedNumber}
                    selectedCell={selectedCell}
                />
            </View>
            <View style={styles.inputBox}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                    <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleNumberClick(number)}>
                        <Text style={styles.numberText}>{number}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.buttonContainer}>
                <Button title={t('reset')} onPress={resetBoard} />
                <Button title={t('solve')} onPress={handleSolve} />
            </View>
        </View>
    );
};


const generateInitialBoard = () => {
    return Array.from({length: 9}, () => Array(9).fill({value: 0, readOnly: false}));
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',  // Distribute the children evenly with space in-between
        alignItems: 'center'
    },
    boardContainer: {
        paddingTop: 15
    },
    board: {
        // your board styles
    },
    inputBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        marginTop: -5,  // Separate from the board
    },
    numberButton: {
        width: '30%',  // Adjust this value if needed
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: '#5294e7'
    },
    numberText: {
        fontSize: 36,
        color: 'white'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 40  // Space at the bottom
    }
});

export default GameScreen;
