// Exercise 1
function capitalize(str) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
}

function camelize(dashSeperatedStr) {
    if (!dashSeperatedStr) return dashSeperatedStr;

    const seperatedWords = dashSeperatedStr.split('-')
    const camelizedWords = seperatedWords.map(
        (word, index) => (index <= 0) ? word : capitalize(word)
    );

    return camelizedWords.join('');
}

function camelizeTests() {
    console.log(camelize("background-color") === 'backgroundColor');
    console.log(camelize("list-style-image") === 'listStyleImage');
    console.log(camelize("-webkit-transition") === 'WebkitTransition');
}

// camelizeTests();


// Exercise 2
function filterRange(arr, min, max) {
    if (!arr) return arr;

    return arr.filter(value => value >= min && value <= max);
}

// Exercise 3

function filterRangeInPlace(arr, min, max) {
  for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] < min || arr[i] > max) {
          arr.splice(i, 1);
      }
  }
}

// Exercise 4

function sortInDecreasingOrder(arr) {
    arr.sort((a, b) => b - a)
}

// Exercise 5
function copySorted(arr) {
    return arr.slice().sort();
}

let arr = ["HTML", "JavaScript", "CSS"];
let sorted = copySorted(arr);

console.log( sorted ); // CSS, HTML, JavaScript
console.log( arr ); // HTML, JavaScript, CSS (no changes)

// Exercise 5
function Calculator() {
    this.operations = [
        {symbol: '+', method: (a, b) => a + b},
        {symbol: '-', method: (a, b) => a - b}
    ];

    this.findMethod = function(symbol) {
        return this.operations.find(operation => operation.symbol === symbol);
    }

    this.addMethod = function(symbolToAdd, methodToAdd) {
        // If not unique
        if (this.findMethod(symbolToAdd)) {
            throw new Error('Symbol already exists');
        }

        this.operations.push({symbol: symbolToAdd.trim(), method: methodToAdd});
    }

    this.calculate = function(expression) {
        if (typeof expression !== 'string') {
            throw new Error("'expression' must be of type string");
        }

        // Find the operation used in the expression
        const tokens = expression.split(' ');

        if (tokens.length !== 3) {
            throw new Error('format of expression must be `[number1] [operator] [number2]`');
        }

        const leftOperand = Number(tokens[0]);
        const rightOperand = Number(tokens[2]);
        const operatorIdentifer = tokens[1];
        const operationMethod = this.findMethod(operatorIdentifer)?.method;

        if (!operationMethod) {
            throw new Error('No known operation symbols found.');
        } else if (!Number.isFinite(leftOperand)) {
            throw new Error('Left number must be a valid number');
        } else if (!Number.isFinite(rightOperand)) {
            throw new Error('Right number must be a valid number');
        }

        return operationMethod(leftOperand, rightOperand);
    }
}

const calculator = new Calculator();


