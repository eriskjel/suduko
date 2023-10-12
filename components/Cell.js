import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Cell = ({ value, rowIndex, colIndex, onCellClick, readOnly, selectedNumber, selectedCell }) => {
    const isSelected = rowIndex === selectedCell.row && colIndex === selectedCell.col;
    const cellStyle = [
        styles.cell,
        readOnly ? { backgroundColor: '#b6b6b6' } : {},
        isSelected ? { borderWidth: 3, borderColor: '#5294e7' } : {}
    ];

    const handlePress = () => {
        if (!readOnly) {
            onCellClick(rowIndex, colIndex, selectedNumber);
        }
    };

    return (
        <TouchableOpacity style={cellStyle} onPress={handlePress}>
            <Text style={{ fontSize: 24 }}>{value !== 0 ? value : ''}</Text>
        </TouchableOpacity>
    );
};



const styles = StyleSheet.create({
    cell: {
        width: 40,
        height: 40,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Add additional styles here
    },
});

export default Cell;
