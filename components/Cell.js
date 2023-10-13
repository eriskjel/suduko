import React, {useState} from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Cell = ({ value, rowIndex, colIndex, onCellClick, readOnly, selectedNumber, selectedCell, doubleTappedCells, setDoubleTappedCells }) => {
    const isSelected = rowIndex === selectedCell.row && colIndex === selectedCell.col;
    const isDoubleTapped = doubleTappedCells[rowIndex][colIndex]; // Derive the double-tapped status

    const [lastTap, setLastTap] = useState(null);
    const cellStyle = [
        styles.cell,
        { backgroundColor: readOnly ? '#b6b6b6' : 'white' }, // Set background color based on readOnly
        isSelected ? { borderWidth: 3, borderColor: '#5294e7' } : {},
        isDoubleTapped ? { backgroundColor: '#b74a20' } : {}
    ];




    const handlePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
            const newDoubleTappedCells = [...doubleTappedCells];
            newDoubleTappedCells[rowIndex][colIndex] = !newDoubleTappedCells[rowIndex][colIndex];
            setDoubleTappedCells(newDoubleTappedCells);
        } else {
            if (!readOnly) {
                onCellClick(rowIndex, colIndex, selectedNumber);
            }
        }
        setLastTap(now);
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
