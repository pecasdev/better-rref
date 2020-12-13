var Decimal = require('decimal.js');
Decimal.set({precision:10, rounding:5});

function ref(A, b=null) {
    checkValidInput(A, b);

    for (var r=0; r!=A.length; r++) {
        for (var c=0; c!=A[r].length; c++) {
            A[r][c] = new Decimal(A[r][c]);
        }
    }

    if (b === null) {
        b = new Array(A.length).fill(new Decimal(0));
    }
    else {
        for (var i=0; i!=b.length; i++) {
            b[i] = new Decimal(b[i]);
        }
    }

    for (var pivot=0; pivot!=Math.min(A.length, A[0].length); pivot++) {     
        // arrange rows so pivot row doesn't have a zero pivot
        if (A[pivot][pivot] == 0) {
            for (var r=pivot; r<A.length; r++) {
                var row = A[r];
                if (row[pivot] != 0) {
                    [A[r], A[pivot]] = [A[pivot], A[r]];
                    [b[r], b[pivot]] = [b[pivot], b[r]];
                    break
                }
            }

            // if no swap can be found, skip this pivot
            if (r >= A.length) {
                continue;
            }
        }

        // subtract first row from other rows (scaled appropriately)
        for (var r=pivot+1; r<A.length; r++) {
            var scale = A[r][pivot]/A[pivot][pivot];

            subRow(A[pivot], A[r], scale);
            b[r] = b[r].sub(b[pivot].times(scale));
            
            //matrixPrint(A, b);
        }
    }

    // reduce all leading values to 1s
    for (var pivot=0; pivot!=Math.min(A.length, A[0].length); pivot++) {
        //console.log("scaling", A[pivot], pivot);
        if (A[pivot][pivot] != 0) {
            b[pivot] = b[pivot].dividedBy(A[pivot][pivot]);
            divRow(A[pivot], A[pivot][pivot]);
            
            //matrixPrint(A, b);
        }
    }
    //console.log("scaling done");
    return A, b;
}

function rref(A, b=null) {
    A, b = ref(A, b);
    //console.log("ref done");

    
    // remove all non-zero values from leading 1s' columns
    var rank = matrixRank(A);
    //console.log("rank:", rank);
    for (var pivot=0; pivot!=rank; pivot++) {
        for (var p=0; p!=pivot; p++) {
            if (A[p][pivot] != 0) {
                b[p] = b[p].sub(b[pivot].times(A[p][pivot]));
                subRow(A[pivot], A[p], A[p][pivot]);
                //matrixPrint(A, b);
            }
        }
    }

    // round all values to 3 decimal points
    for (var r=0; r!=A.length; r++) {
        for (var c=0; c!=A[r].length; c++) {
            A[r][c] = new Decimal(A[r][c].toFixed(3));
        }
        b[r] = new Decimal(b[r].toFixed(2));
    }

    //console.log("rref done");
    return A, b;
}

function solve(A, b=null) {
    A, b = rref(A, b);
    //matrixPrint(A, b);

    // check if infinite solutions
    if (A[0].length > matrixRank(A)) {
        return "infinite solutions";
    }

    // check for no-solutions
    for (var r=0; r!=A.length; r++) {
        allZero = true;

        for (var c=0; c!=A[r].length; c++) {
            if (A[r][c] != 0) {
                allZero = false;
                break
            }
        }

        if (allZero && b[r]!=0) {
            return null;
        }
    }
    
    return b.slice(0, A[0].length);
}

function divRow(row, scale) {
    for (var c=0; c!=row.length; c++) {
        row[c] = row[c].dividedBy(scale);
    }
}

function subRow(row1, row2, scale) {
    for (var c=0; c!=row1.length; c++) {
        row2[c] = row2[c].sub(row1[c].times(scale));
    }
}

function matrixPrint(A, b=null) {
    var string = "";

    for (var row=0; row!=A.length; row++) {
        for (var col=0; col!=A[row].length; col++) {
            string += String(A[row][col]) + '\t';
        }

        if (b != null) {
            string += "| "+String(b[row]);
        }
        
        string += '\n';
    }

    console.log(string);
}

function matrixRank(A) {
    /*
        A has to be in REF form for this to work
    */
    var rank = 0;

    for (var row=0; row!=A.length; row++) {
        for (var col=0; col!=A[row].length; col++) {
            if (A[row][col] == 1) {
                rank++;
                break
            }
        }
    }

    return rank;
}

function checkValidInput(A, b=null) {
    // simple checks for matrix validity, don't expect too much
    if (A.length > 0 &&                                                                                     // check that matrix is non-empty
        A.every((row) => row.constructor === Array && row.length == A[0].length) &&                         // check that matrix is list of non empty lists
        A.every((row) => row.every((i) => (typeof i == "number" || i.constructor == Decimal))) &&           // check that contents of matrix is numerical or Decimal
        (b==null || b.length == A.length)) {                                                                // check that length of b is equal to A (if given)
        return;
    }
    throw new Error(`Inproper input: ${A}, ${b}`);
}

module.exports = {
    "ref": ref,
    "rref": rref,
    "solve": solve,
    "matrixPrint": matrixPrint
}