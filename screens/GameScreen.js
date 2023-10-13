import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Board from '../components/Board';
import {useTranslation} from "react-i18next";
import {fetchData, mergeData, storeData} from "../utilities/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {printAsyncStorage} from "../utilities/async";
import {hashArray} from "../utilities/hash";

const GameScreen = ({ route, navigation }) => {
    const { difficulty = 'easy' } = route.params ?? {};
    const { t } = useTranslation();
    const [isFromAPI, setIsFromAPI] = useState(false);

    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState(generateInitialBoard());

    const [selectedCell, setSelectedCell] = useState({row: null, col: null});
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [currentBoardID, setCurrentBoardID] = useState(null);
    const [initialBoard, setInitialBoard] = useState(generateInitialBoard());
    const [doubleTappedCells, setDoubleTappedCells] = useState(Array.from({ length: 9 }, () => Array(9).fill(false)));






    const [data, setData] = useState({
        newboard: {
            grids: []
        }
    });



    useEffect(() => {
        const fetchDataAndSetBoard = async () => {
            if (route.params?.fromAPI) {
                try {
                    const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
                    const apiData = await response.json();
                    setIsFromAPI(true);

                    // Generate the ID for the fetched board
                    const fetchedBoardID = hashArray(apiData.newboard.grids[0].value);
                    setCurrentBoardID(fetchedBoardID)

                    // Merge with existing data and update storage
                    apiData.newboard.grids[0].difficulty = apiData.newboard.grids[0].difficulty.toLowerCase();


                    const existingDataToMerge = await fetchData();
                    const merged = mergeData(existingDataToMerge, apiData);
                    await storeData(merged);

                    const localizedDifficulty = t(await getDifficultyByID(fetchedBoardID));
                    navigation.setOptions({
                        title: `Difficulty: ${localizedDifficulty}`,
                    });





                    const storedData = await fetchData();
                    const fetchedBoard = getBoardByID(storedData, fetchedBoardID);
                    if (fetchedBoard) {
                        setInitialBoard(fetchedBoard.value.map(row => row.map(cell => cell)));
                        setBoard(fetchedBoard.value);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            else {
                try {
                    const storedData = await fetchData();
                    if (storedData && storedData.newboard) {
                        setData(storedData);
                        const boardForDifficulty = getBoardForDifficulty(storedData, difficulty);
                        if (boardForDifficulty) {
                            setCurrentBoardID(boardForDifficulty.id)
                            setInitialBoard(boardForDifficulty.value.map(row => row.map(cell => cell)));
                            setBoard(boardForDifficulty.value); // Set the board here
                        } else {
                            console.log(`No board found for difficulty: ${difficulty}`);
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data from storage:', error);
                }
            }

            setLoading(false);
        };

        fetchDataAndSetBoard().then(() => {
            console.log("Data fetched and board set");
        });
    }, [difficulty]);

    const getBoardByID = (storedData, boardID) => {
        return storedData.newboard.grids.find(grid => grid.id === boardID);
    };





    const getBoardForDifficulty = (storedData, difficulty) => {
        // Get all boards of the specified difficulty
        const boardsForDifficulty = storedData.newboard.grids.filter(grid => grid.difficulty.toLowerCase() === difficulty.toLowerCase());

        // If no boards found, return null
        if (boardsForDifficulty.length === 0) return null;

        // Randomly select one of the boards
        const randomIndex = Math.floor(Math.random() * boardsForDifficulty.length);

        return boardsForDifficulty[randomIndex];
    }



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

    const transformAPIData = (data) => {
        const puzzle = data.value.map((row) => row.map((cell) => cell));
        return {
            puzzle,
            solution: data.solution,
        };
    };

    const getDifficultyByID = async (boardID) => {
        try {
            // Fetch all the data
            const storedData = await fetchData();

            // Find the board with the matching ID
            const foundBoard = storedData.newboard.grids.find(grid => grid.id === boardID);

            // If found, return the difficulty
            if (foundBoard) {
                return foundBoard.difficulty;
            } else {
                console.log("Board not found");
                return null;
            }
        } catch (error) {
            console.error('Error fetching data from storage:', error);
            return null;
        }
    };



    const resetBoard2 = () => {
        const newBoard = board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                return initialBoard[rowIndex][colIndex] !== 0 ? initialBoard[rowIndex][colIndex] : 0;
            })
        );
        setBoard(newBoard);
        setSelectedCell({ row: null, col: null }); // Clear the selected cell
        setSelectedNumber(null); // Clear the selected number
    };

    const resetBoard = () => {
        const newBoard = board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                return initialBoard[rowIndex][colIndex] !== 0 ? initialBoard[rowIndex][colIndex] : 0;
            })
        );
        setBoard(newBoard);
        setDoubleTappedCells(Array.from({ length: 9 }, () => Array(9).fill(false))); // Reset the double-tapped cells
    };






    const handleCellClick = (row, col, newNumber = null) => {
        console.log(`Clicked on cell (${row}, ${col})`);
        console.log(`Selected number: ${newNumber}`);
        if (newNumber !== null) {
            const newBoard = [...board];
            newBoard[row][col].value = newNumber;
            setBoard(newBoard);
        }
        setSelectedCell({ row, col });
    };


    /*const transformBoard = (jsonBoard) => {
        return jsonBoard.map((row) => {
            return row.map((cell) => {
                return {
                    value: cell,
                    readOnly: cell !== 0,
                };
            });
        });
    };*/







    const handleNumberClick = (number) => {
        if (selectedCell.row !== null && selectedCell.col !== null) {
            const newBoard = [...board];
            if (initialBoard[selectedCell.row][selectedCell.col] === 0) { // Check if cell is not readOnly
                newBoard[selectedCell.row][selectedCell.col] = number;
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
                        if (newBoard[nextRow][nextCol] === 0) { // Check if cell is not readOnly
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



    const handleSolve = async () => {
        console.log("Current Board ID:", currentBoardID);
        console.log("Current Board:", board);

        // Fetch the board with the stored ID from AsyncStorage
        const storedData = await fetchData();
        console.log("Stored Boards:", storedData);

        const correspondingBoard = getBoardByID(storedData, currentBoardID);

        if (!correspondingBoard) {
            console.error("Could not find the corresponding board.");
            // Handle this case gracefully, e.g., display an error message to the user.
            return;
        }

        console.log("Corresponding Board solution:", correspondingBoard.solution);

        if (!correspondingBoard.solution) {
            console.error("Solution not found for the corresponding board.");
            // Handle this case gracefully, e.g., display an error message to the user.
            return;
        }

        const isSolved = compareBoards(board, correspondingBoard.solution);

        if (isSolved) {
            alert(t('solved'));
        } else {
            alert(t('notSolved'));
        }
    };

    const compareBoards = (board1, board2) => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board1[i][j] !== board2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    };


    const handleAutoSolve = async () => {
        try {
            // Fetch the board with the stored ID from AsyncStorage
            const storedData = await fetchData();

            // Find the corresponding board by ID
            const correspondingBoard = getBoardByID(storedData, currentBoardID);

            if (!correspondingBoard) {
                console.error("Could not find the corresponding board.");
                // Handle this case gracefully, e.g., display an error message to the user.
                return;
            }

            if (!correspondingBoard.solution) {
                console.error("Solution not found for the corresponding board.");
                // Handle this case gracefully, e.g., display an error message to the user.
                return;
            }

            // Update the board state to the solved board.
            setBoard(correspondingBoard.solution);

        } catch (error) {
            console.error("An error occurred while auto-solving the board:", error);
            // Handle this case gracefully, e.g., display an error message to the user.
        }
    };



    return (
        loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5294e7" />
            </View>
        ) : (
            <View style={styles.container}>
                <View style={styles.boardContainer}>
                    <Board
                        board={board}
                        onCellClick={handleCellClick}
                        selectedNumber={selectedNumber}
                        selectedCell={selectedCell}
                        initialBoard={initialBoard}
                        doubleTappedCells={doubleTappedCells}
                        setDoubleTappedCells={setDoubleTappedCells}
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
                    <TouchableOpacity style={styles.customButton} onPress={resetBoard}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customButton} onPress={handleSolve}>
                        <Text style={styles.buttonText}>Solve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customButton} onPress={handleAutoSolve}>
                        <Text style={styles.buttonText}>Auto Solve</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    );

};


const generateInitialBoard = () => {
    return Array.from({length: 9}, () => Array(9).fill(0));
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
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
        width: '20%',  // Adjust this value if needed
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
        justifyContent: 'center',
        width: '100%',
        marginBottom: 60,
    },
    customButton: {
        width: '25%', // You can adjust this percentage as needed
        backgroundColor: '#5294e7',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1%', // Optional: Add some margin between the buttons
        borderRadius: 5,
        height: 50,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GameScreen;
