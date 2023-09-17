const LocalStorageDb = {
    add: async (item) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        localStorage.setItem('items', JSON.stringify([...items, item]));
    },
    updateByKey: async (index, key, value) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        items[index][key] = value; 
        localStorage.setItem('items', JSON.stringify(items));
    },
    getAll: async () => {
        return JSON.parse(localStorage.getItem('items'));
    },
    get: async (key) => {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        return items.find(item => item.key === key);
    }
}

export default LocalStorageDb;