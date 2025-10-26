export const safeSortAscending = (array, identifier) => {
    if (!Array.isArray(array) || array.length === 0) {
        return [];
    }

    return array.sort((a, b) => {
        if (a?.[identifier] && b?.[identifier]) {
            return a[identifier].localeCompare(b[identifier]);
        }
        return 0;
    });
};


export const safeSortDescending = (array, identifier) => {
    if (!Array.isArray(array) || array.length === 0) {
        return [];
    }

    return array.sort((a, b) => {
        if (a?.[identifier] && b?.[identifier]) {
            return b[identifier].localeCompare(a[identifier]);
        }
        return 0;
    });
};

export const groupingItems = (array, condition) => {
    return array.reduce((groups, item) => {
        const title = item[condition];
        if (!groups[title]) {
            groups[title] = [];
        }
        groups[title].push(item);
        return groups;
    }, {});
};


