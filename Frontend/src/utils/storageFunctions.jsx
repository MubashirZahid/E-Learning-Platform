// export default StorageFunctions = {
//     saveItems,
//     getItems
// }
export function saveItems(dataKey, data) {
    localStorage.setItem(dataKey, JSON.stringify(data));
}

export function getItems(dataKey) {
    return localStorage.getItem(dataKey);
}

