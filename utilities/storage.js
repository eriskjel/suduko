import AsyncStorage from '@react-native-async-storage/async-storage';
import {hashArray} from "./hash";
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
        const jsonValue = await AsyncStorage.getItem('sudokuData');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        console.error("Error fetching data", e);
    }
}

/*export const mergeData = (existingData, newData) => {
    // Loop over all grids from the new data
    newData.newboard.grids.forEach(newGrid => {
        // Check for a valid difficulty
        if (!newGrid.difficulty) {
            console.error("Difficulty not provided in API grid:", newGrid);
            return; // Skip this grid and move to the next one
        }

        // Check for duplicates based on some characteristic, e.g., the puzzle value
        const isDuplicate = existingData.newboard.grids.some(existingGrid =>
            JSON.stringify(existingGrid.value) === JSON.stringify(newGrid.value)
        );

        if (!isDuplicate) {
            existingData.newboard.grids.push(newGrid);
        } else {
            console.log("Duplicate puzzle detected and skipped:", newGrid);
        }
    });

    return existingData;
};*/

export const mergeData = (existingData, newData) => {
    // Loop over all grids from the new data
    newData.newboard.grids.forEach(newGrid => {
        // Check for a valid difficulty
        if (!newGrid.difficulty) {
            console.error("Difficulty not provided in API grid:", newGrid);
            return; // Skip this grid and move to the next one
        }

        // If the newGrid doesn't have an ID, assign one
        if (!newGrid.id) {
            console.log("trying to hash newGrid.value: ", newGrid.value)
            newGrid.id = hashArray(newGrid.value);
        }
        console.log("fetched a new board from the API with difficulty: ", newGrid.difficulty, " and id: ", newGrid.id)


        // Check for duplicates based on the generated ID
        const isDuplicate = existingData.newboard.grids.some(existingGrid => existingGrid.id === newGrid.id);

        if (!isDuplicate) {
            existingData.newboard.grids.push(newGrid);
        } else {
            console.log("Duplicate puzzle detected and skipped:", newGrid);
        }
    });

    return existingData;
};




