export const hashArray = (arr) => {
    return JSON.stringify(arr).split('').reduce((prevHash, currVal) => ((prevHash << 5) - prevHash + currVal.charCodeAt(0))|0, 0).toString();
};