function sumToLoop(upTo) {
    let sum = 0;

    for (let num = 1; num <= upTo; num++) {
        sum += num;
    }

    return sum;
}

function sumToRecursive(upTo) {
    if (upTo === 1) {
        return 1;
    }

    return upTo + sumToRecursive(upTo - 1);
}

function sumToArithmeticProgession(upTo) {
    const right = (upTo + 1) / 2;
    return upTo * right;
}

function testSumTo(sumToFunc) {
    // argument, resukt
    const tests = [
        [1, 1], 
        [2, 3], 
        [3, 6], 
        [4, 10],
        [100, 5050],
    ];

    let testsPassed = 0;

    for (const [arg, result] of tests) {
        const funcResult = sumToFunc(arg);

        if (funcResult !== result) {
            console.log(
                `Arg: ${arg}` +
                `, Result: ${funcResult}` +
                `, Expected: ${result}`
            );
        } else {
            testsPassed++;
        }
    }

    console.log(`${testsPassed}/${tests.length} tests passed.`);
}

function fib(n) {
    let first = 1;
    let second = 1;
    
    if (n == 1 || n == 2) return 1;
    
    for (let nth = 3; nth < n; nth++) {
        const temp = second;
        second = first + second;
        first = temp;
    }

    return first + second;
}

function fibRecursive(n) {
    if (n == 1 || n == 2) return 1;

    return fibRecursive(n - 1) + fibRecursive(n - 2);
}

function printLinkedListRecursive(node) {
    if (!node) {
        return;
    }

    process.stdout.write(`[${node.value}]->`);
    printLinkedList(node.next);
}

function printLinkedList(node) {
    while (node) {
        process.stdout.write(`[${node.value}]->`);
        node = node.next;
    }
}

let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};

function outputReversedLinkedList(list) {
    let previous = null;
    let current = list;
    let next = current.next;

    while (current) {
        current.next = previous;
        previous = current;
        current = next;
        next = current?.next;
    }

    printLinkedList(previous);
}

outputReversedLinkedList(list);