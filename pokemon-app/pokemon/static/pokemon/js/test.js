function formatDigits(number, amountOfDigits) {
    const strInt = number.toString();

    if (strInt.length >= amountOfDigits) return strInt;

    const zeroesToPrepend = (amountOfDigits - strInt.length);

    let zeroesStr = '';

    for (let i = 0; i < zeroesToPrepend; i++) { zeroesStr += '0' };

    return zeroesStr + strInt;
}

function formatId(id) {
    const totalDigits = 4;
    return formatDigits(id, totalDigits);
}

// Should be just 10
console.log(formatId(1000));

// Should be 0010
console.log(formatId(10));