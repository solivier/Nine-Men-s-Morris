/*global define, require*/
/**
 * 2nd step of the Mills game.
 * Handle events when players have to move pawns from the UI
 */
define(['game/Gameboard', 'sys/Game', 'jquery'], function (gameboard, game, $) {
    'use strict';
    var MoveStep = function () {};
    MoveStep.prototype = {
        name: 'move',
        previousClickedPawnBox : null,
        arrow : null,
        /**
         * Logic when a player click on the UI interface to select and then move a pawn
         */
        pawnBoxClicked : function (id) {
            if (
                this.previousClickedPawnBox !== null
                    && parseInt(this.previousClickedPawnBox.id, 10) === parseInt(id, 10)
            ) {
                this.previousClickedPawnBox = null;
                this.removeArrow();
            } else if (
                this.previousClickedPawnBox !== null
                    && this.canMove(this.previousClickedPawnBox.id, id)
            ) {
                gameboard.pawnBoxes[id].setPawn(this.previousClickedPawnBox.pawn);
                this.previousClickedPawnBox.setPawn(null);
                this.removeArrow();
                require('sys/event').pawnMoved();
                this.previousClickedPawnBox = null;
            } else if (
                this.previousClickedPawnBox === null
                    && gameboard.pawnBoxes[id].pawn !== null
            ) {
                if (gameboard.pawnBoxes[id].pawn.color === game.turn) {
                    this.previousClickedPawnBox = gameboard.pawnBoxes[id];
                    this.displayArrow(id);              
                } else {
                    require('sys/event').moveBadPawn();
                }
            }
        },
        /**
         * Display the red arrow near a box
         */
        displayArrow : function (id) {
            var x, y, pawnBox;
            pawnBox = gameboard.pawnBoxIdToDom(id);
            x = $('#gameboard').position().left + $(pawnBox).position().left + $(pawnBox).width() - 5;
            y = $('#gameboard').position().top + $(pawnBox).position().top - 31;
            this.arrow = $('<div>')
                .attr('class', 'arrow')
                .css({
                    left: x,
                    top: y
                })
                .appendTo($('body'));
        },
        /**
         * Remove the red arrow
         */
        removeArrow : function () {
            $(this.arrow).remove();
        },
        /**
         * Whether a pawn can move to a new box
         */
        canMove : function (old, bNew) {
            var canMove = false,
                newPawnBox = gameboard.pawnBoxes[bNew],
                oldPawnBox = gameboard.pawnBoxes[old];
            if (newPawnBox.pawn === null) {
                switch (game.turn) {
                case 'white':
                    if (
                        game.whitePawnsOnBoard <= 3
                            || oldPawnBox.top === newPawnBox
                            || oldPawnBox.right === newPawnBox
                            || oldPawnBox.bottom === newPawnBox
                            || oldPawnBox.left === newPawnBox
                    ) {
                        canMove = true;
                    } else {
                        require('sys/event').mustMoveToAdjacent();
                    }
                    break;
                case 'black':
                    if (
                        game.blackPawnsOnBoard <= 3
                            || oldPawnBox.top === newPawnBox
                            || oldPawnBox.right === newPawnBox
                            || oldPawnBox.bottom === newPawnBox
                            || oldPawnBox.left === newPawnBox
                    ) {
                        canMove = true;
                    } else {
                        require('sys/event').mustMoveToAdjacent();
                    }
                    break;
                default:
                    throw new Error('Unknown turn: ' + game.turn);
                }
            } else {
                require('sys/event').cannotOverridePawn();
            }
            return canMove;
        }
    };
    return MoveStep;
});