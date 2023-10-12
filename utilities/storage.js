import AsyncStorage from '@react-native-async-storage/async-storage';
export const storeData = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('sudokuData', jsonValue)
    } catch (e) {
        console.error("Error storing data", e);
    }
}

export const fetchData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('sudokuData')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        console.error("Error fetching data", e);
    }
}

export const mergeData = (existingData, newData) => {
    const difficulty = newData.newboard.difficulty.toLowerCase(); // Normalize to lowercase to ensure consistency

    if (existingData[difficulty]) {
        // Push the new grid to the correct difficulty section
        existingData[difficulty].puzzle.push(newData.newboard.grids[0].value);
        existingData[difficulty].solution.push(newData.newboard.grids[0].solution);
    } else {
        // If the difficulty doesn't exist in the existingData, create it
        existingData[difficulty] = {
            puzzle: [newData.newboard.grids[0].value],
            solution: [newData.newboard.grids[0].solution]
        };
    }

    return existingData;
}
