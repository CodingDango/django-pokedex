function test(func, funcName, tests) {
    let testsPassed = 0;

    for (const {args, result} of tests) {
        if (func(...args) === result) {
            console.log(`Test: ${funcName}(${args.join(', ')}) | Result: ${result} ✔️`);
            testsPassed += 1;
        } else {
            console.log(`Test: ${funcName}(${args.join(', ')}) | Result: ${result} ❌`);
        }
    }
}

function task1() {
    function multiplyRange(start, end) {
        if (end <= start) {
            return start;
        }
    
        return end * multiplyRange(start, end - 1);
    }
    
    const tests = [
        { args: [2, 5], result: 120 },
        { args: [4, 7], result: 840 }
    ]
    
    test(multiplyRange, 'multiplyRange', tests);
}

function task2() {
    const filesystem = {
        name: "root",
        type: "folder",
        children: [
            {  
                name: "file1.txt", 
                type: "file" 
            },
            {
                name: "src",
                type: "folder",
                children: [
                    { name: "app.js", type: "file" },
                    { name: "styles.css", type: "file" },
                ],
            },
            {
                name: "public",
                type: "folder",
                children: [
                    { name: "index.html", type: "file" }
                ],
            },
        ],
    };

    function findFile(name, structure) {
        if (structure.type === 'file') {
            return (structure.name === name);
        }

        for (const child of structure.children) {
            if (findFile(name, child)) {
                return true;
            }
        }            

        return false;
    }

    console.log(findFile("app.js", filesystem)); // should be true
    console.log(findFile("index.html", filesystem)); // should be true
    console.log(findFile("nonexistent.txt", filesystem)); // should be false
}

function task3() {
    function createLinkedListFromArray(arr) {
        if (!arr.length) return null;

        let head = { value: arr[0], next: null };
        let current = head;

        for (let i = 1; i < arr.length; i++) {
            current.next = {value: arr[i], next: null};
            current = current.next;
        }   

        return head;
    }

    function printLinkedListRecursive(node) {
        if (!node) {
            return;
        }

        process.stdout.write(`[${node.value}]->`);
        printLinkedListRecursive(node.next);
    }

    let myList = createLinkedListFromArray(['a', 'b', 'c', 'd']);

    function insertAfter(targetValue, newValue, list) {
        // dont insert if no target.
        if (!list) return;

        if (list.value === targetValue) {
            const next = list.next;
            list.next = {value: newValue, next: next};
            return;
        }

        insertAfter(targetValue, newValue, list.next);
    }

    insertAfter('a', 'X', myList);
    printLinkedListRecursive(myList);
}

task3()