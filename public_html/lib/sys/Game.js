/*global define, Math, require*/
/**
 * Package that contains base game functions
 * Often about players
 */
define(['jquery'], function ($) {
    'use strict';
    var Game = function () {};
    Game.prototype = {
        step : null,
        turn : null,
        whitePawnsAvailable : 9,
        blackPawnsAvailable : 9,
        whitePawnsOnBoard : 0,
        blackPawnsOnBoard : 0,
        lastTake : 0,
        whitePlayerIa : null, //Write here the filename of the first IA (without the .js) placed in the directory lib/ia/
        blackPlayerIa : 'Cortana', //Write here the filename of the second IA (without the .js) placed in the directory lib/ia/
        iaMinLatency : 1000, //Min time before the IAs get called (in order for the game not to react too quickly for our eyes)
        /**
         * Init the first turn of the game
         * Call IA
         */
        initTurn : function () {
            this.turn = 'white';
            require('sys/event').turnToggled();
            this.callIa();
        },
        /**
         * Toggle turns between players
         * Call IA
         */
        toggleTurn : function () {
            switch (this.turn) {
            case 'black':
                this.turn = 'white';
                break;
            case 'white':
                this.turn = 'black';
                break;
            default:
                throw new Error('Unknown turn: ' + this.turn);
            }
            require('sys/event').turnToggled();
            this.callIa();
        },
        /**
         * Whether the current turn is played by an IA
         */
        isIa : function () {
            var ia = false;
            switch (this.turn) {
            case 'white':
                if (this.whitePlayerIa !== null) {
                    ia = true;
                }
                break;
            case 'black':
                if (this.blackPlayerIa !== null) {
                    ia = true;
                }
                break;
            default:
                throw new Error('Unknown turn: ' + this.turn);
            }
            return ia;
        },
        /**
         * Get opponent color
         */
        getOpponent : function () {
            var opponent;
            switch (this.turn) {
            case 'black':
                opponent = 'white';
                break;
            case 'white':
                opponent = 'black';
                break;
            default:
                throw new Error('Unknown turn: ' + this.turn);
            }
            return opponent;
        },
        /**
         * Whether the player can move a any pawn
         */
        playerCanMove : function () {
            var id,
                canMove = false,
                gameboard = require('game/Gameboard');
            for (id in gameboard.pawnBoxes) {
                if (
                    gameboard.pawnBoxes.hasOwnProperty(id)
                        && gameboard.pawnBoxes[id].pawn !== null
                        && gameboard.pawnBoxes[id].pawn.color === this.turn
                        && gameboard.pawnBoxes[id].canMoveAdjacent()
                ) {
                    canMove = true;
                    break;
                }
            }
            return canMove;
        },
        /**
         * Whether opponent can move any pawn
         */
        opponentCanMove : function () {
            var id,
                canMove = false,
                gameboard = require('game/Gameboard');
            for (id in gameboard.pawnBoxes) {
                if (
                    gameboard.pawnBoxes.hasOwnProperty(id)
                        && gameboard.pawnBoxes[id].pawn !== null
                        && gameboard.pawnBoxes[id].pawn.color === this.getOpponent()
                        && gameboard.pawnBoxes[id].canMoveAdjacent()
                ) {
                    canMove = true;
                    break;
                }
            }
            return canMove;
        },
        /**
         * Whether player has enough pawns to continue playing (more than 2)
         */
        playerHasEnoughPawns : function () {
            var enough = false;
            switch (this.turn) {
            case 'white':
                if (this.whitePawnsOnBoard >= 3 && this.whitePawnsAvailable <= 0) {
                    enough = true;
                }
                break;
            case 'black':
                if (this.blackPawnsOnBoard >= 3 && this.blackPawnsAvailable <= 0) {
                    enough = true;
                }
                break;
            default:
                throw new Error('Unknown turn ' + this.turn);
            }
            return enough;
        },
        /**
         * Whether opponent has enough pawns to play (more than 2)
         */
        opponentHasEnoughPawns : function () {
            var enough = false;
            switch (this.turn) {
            case 'black':
                if (this.whitePawnsOnBoard >= 3 && this.whitePawnsAvailable <= 0) {
                    enough = true;
                }
                break;
            case 'white':
                if (this.blackPawnsOnBoard >= 3 && this.blackPawnsAvailable <= 0) {
                    enough = true;
                }
                break;
            default:
                throw new Error('Unknown turn ' + this.turn);
            }
            return enough;
        },
        /**
         * Check if the round is draw
         * if players repeated the same schema too much
         * if players did 50 actions without taking a pawn
         * if players both have 3 pawns and did 10 actions without taking a pawn
         */
        checkDraw : function () {
            var gameboard = require('game/Gameboard');
            if (
                this.lastTake >= 50
                    || (
                        this.whitePawnsOnBoard === 3
                            && this.blackPawnsOnBoard === 3
                            && this.lastTake >= 10
                    )
                    || this.redos >= 12
                    || gameboard.repeatTooMuch()
            ) {
                require('sys/event').gameFinished();
            }
        },
        /**
         * Call the IA when needed
         */
        callIa : function () {
            var that = this,
                ia = null;
            switch (this.turn) {
            case 'white':
                ia = this.whitePlayerIa;
                break;
            case 'black':
                ia = this.blackPlayerIa;
                break;
            default:
                throw new Error('Unknown turn: ' + this.turn);
            }
            if (ia !== null && this.step !== null) {
                require(['ia/' + ia], function (ia) {
                    setTimeout(function () {
                        ia.play();
                    }, that.iaMinLatency);
                });
            }
        }
    };
    return new Game();
});