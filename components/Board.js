import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Cell from './Cell';

const Board = ({ board, style, onCellClick, selectedNumber, selectedCell, initialBoard }) => {
    if (!board){
        return <Text>Loading...</Text>;
    }

    return (
        <View style={[styles.board, style]}>
            {board.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => (
                        <Cell
                            key={colIndex}
                            value={cell}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            onCellClick={() => onCellClick(rowIndex, colIndex)}
                            readOnly={initialBoard[rowIndex][colIndex] > 0}
                            selectedNumber={selectedNumber}
                            selectedCell={selectedCell}  // Pass selectedCell down to Cell
                            initialBoard={initialBoard}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};


const styles = StyleSheet.create({
    board: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
    },
    row: {
        flexDirection: 'row',
    },
});

export default Board;
