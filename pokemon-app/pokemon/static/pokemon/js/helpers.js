export function capitalize(str) {
    const delimeter = (str.includes('-')) ? '-' : ' ';

    const capitalizedWords = str.split(delimeter).map(word => 
        word[0].toUpperCase() + word.slice(1)
    );

    return capitalizedWords.join(' ');
}

export function formatId(id) {
    const totalDigits = 4;
    return formatDigits(id, totalDigits);
}

function formatDigits(number, amountOfDigits) {
    const strInt = number.toString();

    if (strInt.length >= amountOfDigits) return strInt;

    const zeroesToPrepend = (amountOfDigits - strInt.length);
    let zeroesStr = '';

    for (let i = 0; i < zeroesToPrepend; i++) { zeroesStr += '0' };

    return zeroesStr + strInt;
}

export function areElementsInArray(elements, arr) {
    for (const element of elements) {
        if (!arr.includes(element)) {
            return false;
        }
    }

    return true;
}