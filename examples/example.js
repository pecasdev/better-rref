var rref = require('../better-rref');

var matrix = [
    [2, 0, -6],
    [0, 1, 2],
    [3, 6, -2]
];

var b = [-8, 3, -4];

rref.matrixPrint(matrix, b);

rref.rref(matrix, b);

rref.matrixPrint(matrix, b);