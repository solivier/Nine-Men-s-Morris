/*global require, define*/
/**
 * Handle events when players have to remove an opponent pawns because they created a mill
 * Can be called from 'place' step and 'move' step
 */
define(['sys/Game', 'game/Gameboard'], function (game, gameboard) {
    'use strict';
    var RemoveStep = function (resumeStep) {
        this.resumeStep = resumeStep;
    };
    RemoveStep.prototype = {
        name: 'remove',
        resumeStep : null,
        /**
         * Logic when a player click on a pawn to remove it from the UI
         */
        pawnBoxClicked : function (id) {
            if (this.isPawn(id)) {
                if (this.isOpponentPawn(id)) {
                    if (!gameboard.pawnBoxes[id].isMill()) {
                        switch (game.turn) {
                        case 'white':
                            gameboard.pawnBoxes[id].setPawn(null);
                            game.blackPawnsOnBoard -= 1;
                            require('sys/event').pawnRemoved();
                            break;
                        case 'black':
                            gameboard.pawnBoxes[id].setPawn(null);
                            game.whitePawnsOnBoard -= 1;
                            require('sys/event').pawnRemoved();
                            break;
                        default:
                            throw new Error('Unknown turn: ' + game.turn);
                        }
                    } else {
                        require('sys/event').pawnIsInMill();
                    }
                } else {
                    require('sys/event').removeBadPawn();
                }
            }
        },
        /**
         * Whether a box contains a pawn
         */
        isPawn : function (id) {
            return gameboard.pawnBoxes[id].pawn !== null;
        },
        /**
         * Whether a box contains an opponent pawn
         */
        isOpponentPawn : function (id) {
            var is = false;
            if (this.isPawn(id)) {
                switch (game.turn) {
                case 'white':
                    if (gameboard.pawnBoxes[id].pawn.color === 'black') {
                        is = true;
                    }
                    break;
                case 'black':
                    if (gameboard.pawnBoxes[id].pawn.color === 'white') {
                        is = true;
                    }
                    break;
                default:
                    throw new Error('Unknown turn: ' + game.turn);
                }
            }
            return is;
        },
        /**
         * Whether a pawn can be removed from the gameboard
         */
        canRemove : function (id) {
            return this.isPawn(id) && this.isOpponentPawn(id) && !gameboard.pawnBoxes[id].isMill();
        }
    };
    return RemoveStep;
});

