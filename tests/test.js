var rref = require('../better-rref');

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function bruteForce() {
    var rows = randInt(4, 8);
    var cols = randInt(4, 8);

    A = [];
    b = [];
    for (var r=0; r!=rows; r++) {
        row = [];
        for (var c=0; c!=cols; c++) {
            row.push(randInt(-20, 20));
        }
        A.push(row);
        b.push(randInt(0, 10));
    }

    // variable saving
    A_ = JSON.parse(JSON.stringify(A));
    b_ = JSON.parse(JSON.stringify(b));
    
    // test
    console.log("RREF");
    A, b = rref.rref(A, b);
    console.log("SOLVE");
    rref.matrixPrint(A, b);
    sols = rref.solve(A, b);

    // output
    console.log("PRINT: START");
    rref.matrixPrint(A_, b_);

    console.log("PRINT: RREF");
    rref.matrixPrint(A, b);
    
    console.log("PRINT: SOLUTIONS");
    console.log(sols);
}

// it ain't great but it's something
bruteForce();