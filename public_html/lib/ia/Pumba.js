/*global define, Math*/
/**
 * Pumba tries to counter you each time you want to make a new mill
 */
define(['sys/api', 'ia/MrPotato'], function (api, mrPotato) {
    'use strict';
    var Pumba = function () {};
    Pumba.prototype = {
        name : 'Pumba',
        millsMap : [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [10, 11, 12],
            [13, 14, 15],
            [16, 17, 18],
            [19, 20, 21],
            [22, 23, 24],
            [1, 10, 22],
            [4, 11, 19],
            [7, 12, 16],
            [2, 5, 8],
            [17, 20, 23],
            [9, 13, 18],
            [6, 14, 21],
            [3, 15, 24]
        ],
        almostMills : function () {
            var i,
                numberOfBoxOccupiedByOpponent,
                emptyBox,
                invalidMill,
                j,
                almostMills = [];
            for (i = 0; i < this.millsMap.length; i += 1) {
                numberOfBoxOccupiedByOpponent = 0;
                invalidMill = false;
                for (j = 0; j < 3; j += 1) {
                    if (!api(this.millsMap[i][j]).isEmpty()) {
                        if (api(this.millsMap[i][j]).isMyColor()) {
                            invalidMill = true;
                        } else {
                            numberOfBoxOccupiedByOpponent += 1;
                        }
                    } else {
                        emptyBox = api(this.millsMap[i][j]);
                    }
                }
                if (numberOfBoxOccupiedByOpponent === 2 && invalidMill === false) {
                    almostMills.push({
                        mill : this.millsMap[i],
                        emptyBox : emptyBox
                    });
                }
            }
            return almostMills;
        },
        play : function () {
            var almostMills = this.almostMills();
            if (almostMills.length !== 0) {
                switch (api.fn.getStep()) {
                case 'place':
                    this.avoidMillPlaceStep(almostMills);
                    break;
                case 'move':
                    this.avoidMillMoveStep(almostMills);
                    break;
                }
            } else {
                this.randPlay();
            }
        },
        avoidMillPlaceStep : function (almostMills) {
            var actionDone = almostMills[0].emptyBox.placePawn();
            if (actionDone !== true) {
                this.randPlay();
            }
        },
        avoidMillMoveStep : function (almostMills) {
            var i,
                emptyBoxNeighbor,
                actionDone = false;
            for (i = 0; i < almostMills.length && actionDone === false; i += 1) {
                if (almostMills[i].emptyBox.hasTopBox()) {
                    emptyBoxNeighbor = almostMills[i].emptyBox.getTopBox();
                    if (emptyBoxNeighbor.isMyColor()) {
                        actionDone = emptyBoxNeighbor.moveTo(almostMills[i].emptyBox);
                    }
                } else if (almostMills[i].emptyBox.hasRightBox()) {
                    emptyBoxNeighbor = almostMills[i].emptyBox.getRightBox();
                    if (emptyBoxNeighbor.isMyColor()) {
                        actionDone = emptyBoxNeighbor.moveTo(almostMills[i].emptyBox);
                    }
                } else if (almostMills[i].emptyBox.hasLeftBox()) {
                    emptyBoxNeighbor = almostMills[i].emptyBox.getLeftBox();
                    if (emptyBoxNeighbor.isMyColor()) {
                        actionDone = emptyBoxNeighbor.moveTo(almostMills[i].emptyBox);
                    }
                } else if (almostMills[i].emptyBox.hasBottomBox()) {
                    emptyBoxNeighbor = almostMills[i].emptyBox.getBottomBox();
                    if (emptyBoxNeighbor.isMyColor()) {
                        actionDone = emptyBoxNeighbor.moveTo(almostMills[i].emptyBox);
                    }
                }
            }
            if (actionDone !== true) {
                this.randPlay();
            }
        },
        randPlay : function () {
            var actionDone = false; //IA MUST DO ONLY ONE ACTION AND STOP WORKING
            while (actionDone !== true) {
                switch (api.fn.getStep()) {
                case 'place':
                    actionDone = api(this.rand(1, 24)).placePawn();
                    break;
                case 'move':
                    actionDone = api(this.rand(1, 24)).moveTo(api(this.rand(1, 24)));
                    break;
                case 'remove':
                    actionDone = api(this.rand(1, 24)).removePawn();
                    break;
                }
            }
        },
        rand : function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
    return new Pumba();
});