/*global define*/
/**
 * Game events definition
 * Links actions among the whole program
 */
define([
    'game/Gameboard',
    'game/GConsole',
    'sys/Game',
    'step/PlaceStep',
    'step/MoveStep',
    'step/RemoveStep'
],
    function (gameboard, gConsole, game, PlaceStep, MoveStep, RemoveStep) {
        'use strict';
        return {
            /**
             * Gameboard building and first step of the game
             */
            gameStarting : function () {
                gameboard.build();
                gConsole.build();
                this.placePawnStep();
            },
            /**
             * Called to start first game step: place pawns on gameboard
             */
            placePawnStep : function () {
                gConsole.append('new game is starting');
                game.turn = 'white';
                gConsole.append(game.turn + ' player starts');
                game.step = new PlaceStep();
                gConsole.append('start by placing pawns on the gameboard');
                game.initTurn();
            },
            /**
             * Called when the turn has just been toggled
             */
            turnToggled : function () {
                gameboard.updateUiCounters();
            },
            /**
             * Called when a player try to override a pawn by using the UI
             */
            cannotOverridePawn : function () {
                gConsole.append('you cannot replace an existing pawn');
            },
            /**
             * Called when a pawn has just been placed on the board
             */
            pawnPlaced : function () {
                gameboard.updateUiCounters();
                gameboard.saveGameboard();
                gameboard.detectMills();
                if (gameboard.hasNewMill()) {
                    this.removeStep(game.step);
                } else if (game.whitePawnsAvailable <= 0 && game.blackPawnsAvailable <= 0) {
                    this.moveStep();
                } else {
                    game.toggleTurn();
                }
            },
            /**
             * Called to start the second step of the game: move pawns
             */
            moveStep : function () {
                game.step = new MoveStep();
                if (!game.opponentCanMove()) {
                    this.gameFinished(game.turn);
                } else {
                    gConsole.append('all pawns are in place. Now move your pawns to the victory');
                }
                game.toggleTurn();
            },
            /**
             * Called when a box is clicked by a player (UI)
             */
            pawnBoxClicked : function (id) {
                if (game.step !== null && game.step.pawnBoxClicked !== null && !game.isIa()) {
                    game.step.pawnBoxClicked(id);
                }
            },
            /**
             * Called when a player tries to move a pawn a bad way (UI)
             */
            mustMoveToAdjacent : function () {
                gConsole.append('you must choose an adjacent position');
            },
            /**
             * Called when a player tries to move a pawn of the opponent
             */
            moveBadPawn : function () {
                gConsole.append('select a ' + game.turn + ' pawn');
            },
            /**
             * Called when a player trues to remove a pawn of himself
             */
            removeBadPawn : function () {
                gConsole.append('select a ' + game.getOpponent() + ' pawn');
            },
            /**
             * Called when a player has just moved a pawn
             */
            pawnMoved : function () {
                gameboard.updateUiCounters();
                gameboard.saveGameboard();
                gameboard.detectMills();
                game.lastTake += 1;
                if (gameboard.hasNewMill()) {
                    this.removeStep(game.step);
                } else {
                    game.checkDraw();
                    if (game.step !== null) {
                        if (!game.opponentCanMove()) {
                            this.gameFinished(game.turn);
                        }
                        game.toggleTurn();
                    }
                }
            },
            /**
             * Called to switch to the remove step
             */
            removeStep : function (resumeStep) {
                if (gameboard.hasFreePawnOfColor(game.getOpponent())) {
                    game.step = new RemoveStep(resumeStep);
                    gConsole.append('you created a mill, you can remove an opponent pawn');
                    game.callIa();
                } else {
                    gConsole.append('you created a mill but all opponent pawns are in a mill. The game continues');
                    game.checkDraw();
                    game.toggleTurn();
                }
            },
            /**
             * Called when a pawn has just been removed
             */
            pawnRemoved : function () {
                var pawns;
                gameboard.updateUiCounters();
                gameboard.saveGameboard();
                game.step = game.step.resumeStep;
                game.lastTake = 0;
                if (!game.opponentHasEnoughPawns() || !game.opponentCanMove()) {
                    if (game.getOpponent() === 'white') {
                        pawns = game.whitePawnsAvailable;
                    } else {
                        pawns = game.blackPawnsAvailable;
                    }
                    if (pawns <= 0) {
                        this.gameFinished(game.turn);
                    }
                }
                if (    
                    game.step !== null
                        && game.step.name === 'place'
                        && game.whitePawnsAvailable <= 0
                        && game.blackPawnsAvailable <= 0
                ) {
                    this.moveStep();
                } else if (game.step !== null) {
                    game.toggleTurn();
                }
            },
            /**
             * Called when a player tries to remove a pawn that belongs to a mill (UI)
             */
            pawnIsInMill : function () {
                gConsole.append('you cannot remove a pawn that belongs to a mill');
            },
            /**
             * Called to end the game
             */
            gameFinished : function (winner) {
                if (winner !== undefined) {
                    $(gameboard.turnInfoBox).css({
                        color : (game.turn === 'white') ? '#000' : '#FFF',
                        background : game.turn
                    })
                    .html(game.turn + ' wins!');
                } else {
                    $(gameboard.turnInfoBox).css({
                        color : (game.turn === 'white') ? '#000' : '#FFF',
                        background : game.turn
                    })
                    .html('round draw!');
                }
                game.step = null;
            }
        };
    });