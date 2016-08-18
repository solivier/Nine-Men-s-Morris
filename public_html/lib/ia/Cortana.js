/*global define, require*/
define(['sys/api'], function (a) {
    'use strict';
    var IA = function () {};
    IA.prototype = {
        name : 'Cortana',
        opponentMillPrediction : function () {
            var result = [],
                pawnLocations = a.fn.getPawnBoxes(),
                i,
                x,
                f,
                temp,
                opponentColor = a.fn.getOpponentColor(),
                row = [{1: -1, 2: -1, 3: -1}, {4: -1, 5: -1, 6: -1}, {7: -1, 8: -1, 9: -1}, {10: -1, 11: -1, 12: -1}, {13: -1, 14: -1, 15: -1}, {16: -1, 17: -1, 18: -1}, {19: -1, 20: -1, 21: -1}, {22: -1, 23: -1, 24: -1}],
                col = [{1: -1, 10: -1, 22: -1}, {7: -1, 12: -1, 16: -1}, {4: -1, 11: -1, 19: -1}, {2: -1, 5: -1, 8: -1}, {17: -1, 20: -1, 23: -1}, {9: -1, 13: -1, 18: -1}, {6: -1, 14: -1, 21: -1}, {3: -1, 15: -1, 24: -1}];

            for (i = 0; i < pawnLocations.length; i += 1) {
                if (pawnLocations[i].isEmpty() === false) {
                    if (pawnLocations[i].getPawnColor() === opponentColor) {
                        if ([1, 2, 3].indexOf(pawnLocations[i].getId()) !== -1) {
                            row[0][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([4, 5, 6].indexOf(pawnLocations[i].getId()) !== -1) {
                            row[1][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([7, 8, 9].indexOf(pawnLocations[i].getId()) !== -1) {
                            row[2][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([10, 11, 12].indexOf(pawnLocations[i].getId()) !== -1) {
                            row[3][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([13, 14, 15].indexOf(pawnLocations[i].getId()) !== -1) {
                            row[4][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([16, 17, 18].indexOf(pawnLocations[i].getId()) !== -1) {
                            row[5][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([19, 20, 21].indexOf(pawnLocations[i].getId()) !== -1) {
                            row[6][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([22, 23, 24].indexOf(pawnLocations[i].getId()) !== -1) {
                            row[7][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([1, 10, 22].indexOf(pawnLocations[i].getId()) !== -1) { // ------------------------
                            col[0][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([7, 12, 16].indexOf(pawnLocations[i].getId()) !== -1) {
                            col[1][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([4, 11, 19].indexOf(pawnLocations[i].getId()) !== -1) {
                            col[2][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([2, 5, 8].indexOf(pawnLocations[i].getId()) !== -1) {
                            col[3][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([17, 20, 23].indexOf(pawnLocations[i].getId()) !== -1) {
                            col[4][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([9, 13, 18].indexOf(pawnLocations[i].getId()) !== -1) {
                            col[5][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([6, 14, 21].indexOf(pawnLocations[i].getId()) !== -1) {
                            col[6][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                        if ([3, 15, 24].indexOf(pawnLocations[i].getId()) !== -1) {
                            col[7][pawnLocations[i].getId()] = pawnLocations[i].getId();
                        }
                    }
                }
            }

            for (i = 0; i < 8; i += 1) {
                f = 0;
                temp = -1;

                for (x in row[i]) {
                    if (row[i][x] !== -1 && pawnLocations[x - 1].getPawnColor() === opponentColor) {
                        f += 1;
                    } else {
                        temp = x;
                    }
                }
                if (f === 2) {
                    result.push(temp);
                }


                f = 0;
                temp = -1;

                for (x in col[i]) {
                    if (col[i][x] !== -1 && pawnLocations[x - 1].getPawnColor() === opponentColor) {
                        f += 1;
                    } else {
                        temp = x;
                    }
                }
                if (f === 2) {
                    result.push(temp);
                }
            }

            //rand = Math.floor((Math.random() * result.length));
            if (result.length === 0) {
                return -1;
            } else {
                console.log(result);
                return result;
            }
        },

        doMill : function () {
            var row = [{1: -1, 2: -1, 3: -1}, {4: -1, 5: -1, 6: -1}, {7: -1, 8: -1, 9: -1}, {10: -1, 11: -1, 12: -1}, {13: -1, 14: -1, 15: -1}, {16: -1, 17: -1, 18: -1}, {19: -1, 20: -1, 21: -1}, {22: -1, 23: -1, 24: -1}],
                col = [{1: -1, 10: -1, 22: -1}, {7: -1, 12: -1, 16: -1}, {4: -1, 11: -1, 19: -1}, {2: -1, 5: -1, 8: -1}, {17: -1, 20: -1, 23: -1}, {9: -1, 13: -1, 18: -1}, {6: -1, 14: -1, 21: -1}, {3: -1, 15: -1, 24: -1}],
                i,
                roww = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15], [16, 17, 18], [19, 20, 21], [22, 23, 24]],
                coll = [[1, 10, 22], [7, 12, 16], [4, 11, 19], [2, 5, 8], [17, 20, 23], [9, 13, 18], [6, 14, 21], [3, 15, 24]],
                opponentColor = a.fn.getOpponentColor(),
                result = [],
                f,
                pawnLocations = a.fn.getPawnBoxes(),
                g,
                test,
                b,
                rand,
                x;

            g = 0;
            for (i in roww) {
                for (x in roww[i]) {
                    if (pawnLocations[roww[i][x]] !== undefined) {
                        if (pawnLocations[roww[i][x]].getPawnColor() !== opponentColor) {
                            row[g][pawnLocations[roww[i][x]].getId()] = 'c';
                        } else if (pawnLocations[roww[i][x]].isEmpty() === true) {
                            row[g][pawnLocations[roww[i][x]].getId()] = 'e';
                        }
                    }
                }
                g += 1;
            }

            g = 0;
            for (i in coll) {
                for (x in coll[i]) {
                    if (pawnLocations[coll[i][x]] !== undefined) {
                        if (pawnLocations[coll[i][x]].getPawnColor() !== opponentColor) {
                            col[g][pawnLocations[coll[i][x]].getId()] = 'c';
                        } else if (pawnLocations[coll[i][x]].isEmpty() === true) {
                            col[g][pawnLocations[coll[i][x]].getId()] = 'e';
                        }
                    }
                }
                g += 1;
            }

            console.log(row);

            for (i = 0; i < 8; i += 1) {
                f = 0;
                b = 0;
                test = 0;
                for (x in row[i]) {
                    if (row[i][x] === 'c') {
                        f += 1;
                    }
                    if (row[i][x] === 'e') {
                        b += 1;
                        test = x;
                    }
                }
                if (f === 2 && b === 1) {
                    result.push(test);
                }


                f = 0;
                b = 0;
                test = 0;
                for (x in col[i]) {
                    if (row[i][x] === 'c') {
                        f += 1;
                    }
                    if (col[i][x] === 'e') {
                        b += 1;
                        test = x;
                    }
                }
                if (f === 2 && b === 1) {
                    result.push(test);
                }
            }
            rand = Math.floor((Math.random() * result.length));

            if (result.length === 0) {
                return -1;
            } else {
                console.log('testmill');
                console.log(result);
                return result[rand];
            }
        },

        play : function () {
            var pawnCoords, mill, i, x = 0;
            var actionDone = false;
            while (actionDone !== true) {
                switch (a.fn.getStep()) {
                case 'place':
                    pawnCoords = this.opponentMillPrediction();
                    if (pawnCoords !== -1) {
                        for (i = 0; i < pawnCoords.length; i += 1) {
                            if (a(pawnCoords[i]).canPlacePawn() && x === 0) {
                                actionDone = a(pawnCoords[i]).placePawn();
                                x = 1;
                                break;
                            }
                        }
                        if (x === 0) {
                            actionDone = a(this.rand(1, 24)).placePawn();
                        }

                    } else {
                        actionDone = a(this.rand(1, 24)).placePawn();
                    }
                    break;
                case 'move':
                    actionDone = a(this.rand(1, 24)).moveTo(a(this.rand(1, 24)));
                    break;
                case 'remove':
                    actionDone = a(this.rand(1, 24)).removePawn();
                    break;
                }
            }
            //context.addMessage(this.quotes[this.rand(0, this.quotes.length - 1)]);
        },

        rand : function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
    return new IA();
});


// pawnLocations = tout les trous qui sont sur la planche (avec ou sans pions) et pour savoir si il y a un pion isEmpty()
