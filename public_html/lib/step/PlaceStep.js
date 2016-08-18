/*global define, require*/
/**
 * First step of the Mills game
 * Handle events when players have to place their 9 pawns on the UI
 */
define(['jquery', 'sys/Game', 'game/Gameboard', 'game/Pawn'], function ($, game, gameboard, Pawn) {
    'use strict';
    var PlaceStep = function () {};
    PlaceStep.prototype = {
        name: 'place',
        /**
         * Logic when a player click on a box to place a pawn on the gameboard
         */
        pawnBoxClicked : function (id) {
            if (this.boxIsFree(id)) {
                if (this.hasPawn()) {
                    switch (game.turn) {
                    case 'white':
                        gameboard.pawnBoxes[id].setPawn(new Pawn('white'));
                        game.whitePawnsAvailable -= 1;
                        game.whitePawnsOnBoard += 1;
                        require('sys/event').pawnPlaced();
                        break;
                    case 'black':
                        gameboard.pawnBoxes[id].setPawn(new Pawn('black'));
                        game.blackPawnsAvailable -= 1;
                        game.blackPawnsOnBoard += 1;
                        require('sys/event').pawnPlaced();
                        break;
                    default:
                        throw new Error('Unknown turn: ' + game.turn);
                    }
                } else {
                    throw new Error('No more pawns to place');
                }
            } else {
                require('sys/event').cannotOverridePawn(id);
            }
        },
        /**
         * Whether a player have pawns remaining
         */
        hasPawn : function () {
            var has = false;
            switch (game.turn) {
            case 'white':
                if (game.whitePawnsAvailable > 0) {
                    has = true;
                }
                break;
            case 'black':
                if (game.blackPawnsAvailable > 0) {
                    has = true;
                }
                break;
            default:
                throw new Error('Unknown turn: ' + game.turn);
            }
            return has;
        },
        /**
         * Whether a box is free (has no pawn onto)
         */
        boxIsFree : function (id) {
            return gameboard.pawnBoxes[id].pawn === null;
        },
        /**
         * Whether the player can place a pawn on a box
         */
        canPlacePawn : function (id) {
            return (this.hasPawn() && this.boxIsFree(id));
        }
    };
    return PlaceStep;
});