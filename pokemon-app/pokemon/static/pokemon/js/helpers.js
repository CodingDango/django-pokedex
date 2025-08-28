export function capitalize(str) {
    const capitalizedWords = str.split(' ').map(word => 
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