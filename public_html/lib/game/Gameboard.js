/*global define, Image, require, dance*/
/**
 * Gameboard graphics and logic
 * Create gameboard/detect mills/handle counters/detect repetition
 */
define(['jquery', 'game/PawnBox', 'sys/Game'], function ($, PawnBox, game) {
    'use strict';
    var Gameboard = function () {};
    Gameboard.prototype = {
        gameboard : null,
        whitePawnCounter : null,
        blackPawnCounter : null,
        turnInfoBox : null,
        pawnBoxes : {},
        pawnBoxesCoords: [],
        mills : [],
        oldMills : [],
        saves : [],
        /**
         * Start building gameboard
         * First load dependencies
         * Then start of creation of gameboard and counters
         */
        build : function () {
            this.load(this.buildGameboard.bind(this));
        },
        /**
         * Initialize gameboard/counters/PawnBox objects and associated events
         */
        buildGameboard : function () {
            this.pawnBoxesCoords = [
                {x : 31, y : 31, row: 0, col: 0, id: 1, top: null, right: 2, bottom: 10, left: null},
                {x : 235, y : 30, row: 0, col: 3, id: 2, top: null, right: 3, bottom: 5, left: 1},
                {x : 440, y : 32, row: 0, col: 6, id: 3, top: null, right: null, bottom: 15, left: 2},
                {x : 99, y : 99, row: 1, col: 1, id: 4, top: null, right: 5, bottom: 11, left: null},
                {x : 235, y : 99, row: 1, col: 3, id: 5, top: 2, right: 6, bottom: 8, left: 4},
                {x : 372, y : 100, row: 1, col: 5, id: 6, top: null, right: null, bottom: 14, left: 5},
                {x : 167, y : 167, row: 2, col: 2, id: 7, top: null, right: 8, bottom: 12, left: null},
                {x : 236, y : 166, row: 2, col: 3, id: 8, top: 5, right: 9, bottom: null, left: 7},
                {x : 304, y : 167, row: 2, col: 4, id: 9, top: null, right: null, bottom: 13, left: 8},
                {x : 31, y : 235, row: 3, col: 0, id: 10, top: 1, right: 11, bottom: 22, left: null},
                {x : 99, y : 235, row: 3, col: 1, id: 11, top: 4, right: 12, bottom: 19, left: 10},
                {x : 166, y : 235, row: 3, col: 2, id: 12, top: 7, right: null, bottom: 16, left: 11},
                {x : 304, y : 235, row: 3, col: 4, id: 13, top: 9, right: 14, bottom: 18, left: null},
                {x : 372, y : 235, row: 3, col: 5, id: 14, top: 6, right: 15, bottom: 21, left: 13},
                {x : 440, y : 235, row: 3, col: 6, id: 15, top: 3, right: null, bottom: 24, left: 14},
                {x : 166, y : 304, row: 4, col: 2, id: 16, top: 12, right: 17, bottom: null, left: null},
                {x : 236, y : 305, row: 4, col: 3, id: 17, top: null, right: 18, bottom: 20, left: 16},
                {x : 304, y : 303, row: 4, col: 4, id: 18, top: 13, right: null, bottom: null, left: 17},
                {x : 99, y : 370, row: 5, col: 1, id: 19, top: 11, right: 20, bottom: null, left: null},
                {x : 235, y : 371, row: 5, col: 3, id: 20, top: 17, right: 21, bottom: 23, left: 19},
                {x : 372, y : 370, row: 5, col: 5, id: 21, top: 14, right: null, bottom: null, left: 20},
                {x : 31, y : 440, row: 6, col: 0, id: 22, top: 10, right: 23, bottom: null, left: null},
                {x : 235, y : 441, row: 6, col: 3, id: 23, top: 20, right: 24, bottom: null, left: 22},
                {x : 439, y : 440, row: 6, col: 6, id: 24, top: 15, right: null, bottom: null, left: 23}
            ];
            var i,
                pawnBox,
                clickFn = function () {
                    require('sys/event').pawnBoxClicked($(this).attr('data-id'));
                };
            this.whitePawnCounter = $('<div>')
                .attr('id', 'white-counter')
                .attr('class', 'counter white')
                .appendTo($('body'));
            this.blackPawnCounter = $('<div>')
                .attr('id', 'black-counter')
                .attr('class', 'counter black')
                .appendTo($('body'));
            this.turnInfoBox = $('<div>')
                .attr('id', 'turn-info')
                .attr('class', 'counter turn-info')
                .appendTo($('body'));
            this.updateUiCounters();
            this.gameboard = $('<div>')
                .attr('id', 'gameboard')
                .attr('class', 'gameboard')
                .appendTo($('body'));
            for (i = 0; i < this.pawnBoxesCoords.length; i += 1) {
                pawnBox = $('<div>')
                    .css({
                        left: this.pawnBoxesCoords[i].x,
                        top: this.pawnBoxesCoords[i].y
                    })
                    .click(clickFn)
                    .attr('class', 'pawn-box')
                    .attr('data-id', this.pawnBoxesCoords[i].id)
                    .appendTo($(this.gameboard));
                this.pawnBoxes[this.pawnBoxesCoords[i].id] = new PawnBox(
                        this.pawnBoxesCoords[i].id,
                        this.pawnBoxesCoords[i].x,
                        this.pawnBoxesCoords[i].y,
                        this.pawnBoxesCoords[i].col,
                        this.pawnBoxesCoords[i].row
                    );
            }
            for (i = 0; i < this.pawnBoxesCoords.length; i += 1) {
                if (this.pawnBoxesCoords[i].top !== null) {
                    this.pawnBoxes[this.pawnBoxesCoords[i].id].top = this.pawnBoxes[this.pawnBoxesCoords[i].top];
                }
                if (this.pawnBoxesCoords[i].right !== null) {
                    this.pawnBoxes[this.pawnBoxesCoords[i].id].right = this.pawnBoxes[this.pawnBoxesCoords[i].right];
                }
                if (this.pawnBoxesCoords[i].bottom !== null) {
                    this.pawnBoxes[this.pawnBoxesCoords[i].id].bottom = this.pawnBoxes[this.pawnBoxesCoords[i].bottom];
                }
                if (this.pawnBoxesCoords[i].left !== null) {
                    this.pawnBoxes[this.pawnBoxesCoords[i].id].left = this.pawnBoxes[this.pawnBoxesCoords[i].left];
                }
            }
        },
        /**
         * Returns DOM object from PawnBox ID
         */
        pawnBoxIdToDom : function (id) {
            return $('div.pawn-box[data-id=' + id + ']');
        },
        /**
         * Detect gameboard mills
         */
        detectMills : function () {
            this.oldMills = this.mills;
            this.mills = [];
            var id;
            for (id in this.pawnBoxes) {
                if (this.pawnBoxes.hasOwnProperty(id)) {
                    if (this.pawnBoxes[id].isMiddleOfVerticalMill()) {
                        this.mills.push(this.pawnBoxes[id].getVerticalMill());
                    }
                    if (this.pawnBoxes[id].isMiddleOfHorizontalMill()) {
                        this.mills.push(this.pawnBoxes[id].getHorizontalMill());
                    }
                }
            }
        },
        /**
         * Return whether there is new mills since last action
         */
        hasNewMill : function () {
            var i, j, hasNewMill = false, found;
            for (i = 0; i < this.mills.length; i += 1) {
                found = false;
                for (j = 0; j < this.oldMills.length; j += 1) {
                    if (
                        this.mills[i][0] === this.oldMills[j][0]
                            && this.mills[i][1] === this.oldMills[j][1]
                            && this.mills[i][2] === this.oldMills[j][2]
                    ) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    hasNewMill = true;
                    break;
                }
            }
            return hasNewMill;
        },
        /**
         * Tells if there is "free" pawns, ie pawns that can be removed (not in a mill)
         */
        hasFreePawnOfColor : function (color) {
            var id, hasFreePawn = false;
            for (id in this.pawnBoxes) {
                if (
                    this.pawnBoxes.hasOwnProperty(id)
                        && this.pawnBoxes[id].pawn !== null
                        && this.pawnBoxes[id].pawn.color === color
                        && !this.pawnBoxes[id].isMill()
                ) {
                    hasFreePawn = true;
                    break;
                }
            }
            return hasFreePawn;
        },
        /**
         * Load dependencies before calling callback
         */
        load : function (callback) {
            var toLoad = 0,
                onload = function () {
                    toLoad -= 1;
                    if (toLoad <= 0) {
                        callback();
                    }
                },
                dependencies = [
                    'img/white-pawn.png',
                    'img/black-pawn.png',
                    'img/gameboard.png',
                    'img/arrow.png',
                    'img/background.svg'
                ],
                image,
                i;
            toLoad = dependencies.length;
            for (i = 0; i < dependencies.length; i += 1) {
                image = new Image();
                image.onload = onload;
                image.src = dependencies[i];
            }
        },
        /**
         * Save current gameboard and PawnBox objects state
         * To be use to detect repetitions
         */
        saveGameboard : function () {
            var id,
                save = {};
            for (id in this.pawnBoxes) {
                if (this.pawnBoxes.hasOwnProperty(id)) {
                    save[id] = (this.pawnBoxes[id].pawn !== null) ? this.pawnBoxes[id].pawn.color : null;
                }
            }
            this.saves.push(save);
            if (this.saves.length > 13) {
                this.saves = this.saves.slice(1, 14);
            }
        },
        /**
         * Returns true when the same schema has been repeated 3 times on the gameboard
         */
        repeatTooMuch : function () {
            var i,
                toCheck = [4, 8, 12],
                k,
                repeated = true;
            dance:
            for (k in toCheck) {
                if (toCheck.hasOwnProperty(k)) {
                    for (i = 1; i <= 24; i += 1) {
                        if (
                            this.saves[0] === undefined
                                || this.saves[toCheck[k]] === undefined
                                || this.saves[0][i] !== this.saves[toCheck[k]][i]
                        ) {
                            repeated = false;
                            break dance;
                        }
                    }
                }
            }
            return repeated;
        },
        /**
         * Updates counters (turn, number of pawns per player)
         */
        updateUiCounters : function () {
            $(this.whitePawnCounter).html(game.whitePawnsOnBoard);
            $(this.blackPawnCounter).html(game.blackPawnsOnBoard);
            $(this.turnInfoBox).css({
                color : (game.turn === 'white') ? '#000' : '#FFF',
                background : game.turn
            })
            .html(game.turn + ' plays');
        }
    };
    return new Gameboard();
});