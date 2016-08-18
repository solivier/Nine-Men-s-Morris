/*global define, require*/
/**
 * IA gameboard manipulation API
 * Allows IA to play the game
 * Open lib/ia/MrPatate.js to get a quick usage example
 */
define(['game/Gameboard', 'sys/Game', 'game/Pawn', 'game/PawnBox', 'game/GConsole'], function (gameboard, game, Pawn, PawnBox, gConsole) {
    'use strict';
    /**
     * Provide an easy way to manipulate pawn boxes
     * 
     ***
     * Usage:
     ** api(box_id): bow_id between 1 and 24
     * NOTE: IDs are ordonned naturally from top left to bottom right the same way that you read a text
     ** api(box_row, box_column): bow_row and bow_column between 0 and 6
     ** api(box_object): api(my_pawn_bow_instance)
     ** api(api_box_object): api(api(2, 2)) is equivalent to api(2)
     ***
     * Append your function call to the call of api() to manipulate the targeted box
     ** api(2, 2).canPlacePawn()
     ** api(7).getPawnColor()
     */
    var api = function (a, b) {
        var wrapper = null;
        if (a !== undefined && b !== undefined) {
            wrapper = new api.Wrapper(api.internal.getBoxAt(a, b));
        } else if (a instanceof api.Wrapper) {
            wrapper = a;
        } else if (a instanceof PawnBox) {
            wrapper = new api.Wrapper(gameboard.pawnBoxes[a.id]);
        } else {
            wrapper = new api.Wrapper(gameboard.pawnBoxes[a]);
        }
        return wrapper;
    };
    /**
     * General functions that are not about manipulating boxes
     * Call them by using api.fn.your_function_name
     ** api.fn.getOpponentColor() will return the opponent player color
     */
    api.fn = {
        /**
         * Add a message in the UI console.
         */
        addMessage : function (iaName, message) {
            gConsole.append('(IA ' + this.getColor() + ') ' + iaName + ': ' + message);
        },
        /**
         * Return the number of pawns you have on the gameboard
         */
        pawnsOnBoard : function () {
            var count = null;
            switch (game.turn) {
            case 'black':
                count = game.blackPawnsOnBoard;
                break;
            case 'white':
                count = game.whitePawnsOnBoard;
                break;
            default:
                throw new Error('Unknown turn: ' + this.turn);
            }
            return count;
        },
        /**
         * Return the number of pawns you have not yet placed on the board
         * To be use in the 'place' step
         */
        pawnsAvailable : function () {
            var count = null;
            switch (game.turn) {
            case 'black':
                count = game.blackPawnsAvailable;
                break;
            case 'white':
                count = game.whitePawnsAvailable;
                break;
            default:
                throw new Error('Unknown turn: ' + this.turn);
            }
            return count;
        },
        /**
         * Return the number of pawns your opponent has on the board
         */
        opponentPawnsOnBoard : function () {
            var count = null;
            switch (game.turn) {
            case 'black':
                count = game.whitePawnsOnBoard;
                break;
            case 'white':
                count = game.blackPawnsOnBoard;
                break;
            default:
                throw new Error('Unknown turn: ' + this.turn);
            }
            return count;
        },
        /**
         * Return the number of pawns your opponent has not yet placed on the board
         */
        opponentPawnsAvailable : function () {
            var count = null;
            switch (game.turn) {
            case 'black':
                count = game.whitePawnsAvailable;
                break;
            case 'white':
                count = game.blackPawnsAvailable;
                break;
            default:
                throw new Error('Unknown turn: ' + this.turn);
            }
            return count;
        },
        /**
         * Return your pawns color
         */
        getColor : function () {
            return game.turn;
        },
        /**
         * Return opponent color
         */
        getOpponentColor : function () {
            return game.getOpponent();
        },
        /**
         * Return the current step of the game
         * can be place or move or remove
         */
        getStep : function () {
            return game.step !== null ? game.step.name : null;
        },
        /**
         * Return all pawn boxes on the board
         */
        getPawnBoxes : function () {
            var boxes = [],
                i;
            for (i in gameboard.pawnBoxes) {
                if (gameboard.pawnBoxes.hasOwnProperty(i)) {
                    boxes.push(api(gameboard.pawnBoxes[i]));
                }
            }
            return boxes;
        },
        /**
         * When game step is remove, tells you from which step the remove step has been called
         * can be place or move
         */
        getRemoveStepOrigin : function () {
            var origin = null;
            if (this.getStep() === 'remove') {
                origin = game.step.resumeStep.name;
            }
            return origin;
        }, 
        /**
         * Whether pawns can be moved everywhere (when you have only 3 pawns remaining)
         */
        canMoveEverywhere : function () {
            return (
                api.fn.getStep() === 'move'
                    && api.fn.pawnsOnBoard() <= 3
            );
        }
    };
    /**
     * INTERNAL USE --ONLY--
     */
    api.internal = {
        /**
         * Internal function to place pawns on board
         */
        placePawn : function(id) {
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
        },
        /**
         * Internal function to retrieve a box from its row and col coords
         */
        getBoxAt : function (row, col) {
            var box = null,
                i;
            for (i = 0; i < gameboard.pawnBoxesCoords.length; i += 1) {
                if (
                    gameboard.pawnBoxesCoords[i].row === row
                        && gameboard.pawnBoxesCoords[i].col === col
                ) {
                    box = gameboard.pawnBoxes[gameboard.pawnBoxesCoords[i].id];
                    break;
                }
            }
            return box;
        },
        /**
         * Internal function
         * Whether a pawn can be moved to a new box
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
                    }
                    break;
                default:
                    throw new Error('Unknown turn: ' + game.turn);
                }
            }
            return canMove;
        },
        /**
         * Internal function to move a pawn
         */
        movePawn : function (old, bNew) {
            var newPawnBox = gameboard.pawnBoxes[bNew],
                oldPawnBox = gameboard.pawnBoxes[old];
            newPawnBox.setPawn(oldPawnBox.pawn);
            oldPawnBox.setPawn(null);
            require('sys/event').pawnMoved();
        },
        /**
         * Internal function to remove a pawn
         */
        removePawn : function (id) {
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
        }
    };
    /**
     * API wrapper to manipulate boxes
     * The following functions are those you can append to the call of api()
     * Example: api().function_name
     ***
     * NOTE: each value passed as parameter to the following functions follows the rule of the api() function
     * this means that the following calls are VALID
     ** api(2, 2).canMoveTo(7);
     ** api(2, 2).canMoveTo(2, 3);
     ** api(2, 2).canMoveTo(box_object);
     ** api(2, 2).canMoveTo(api(7));
     ***
     * NOTE: each value returned by the following functions also follows the rule of the api() function
     * this means that the following calls are VALID too
     ** api(1).getRightBox().getPawnColor();
     ** api(1).getBottomBox().hasForNeighbor(api(0, 1));
     */
    api.Wrapper = function (box) {
        this.box = box;
    };
    api.Wrapper.prototype = {
        /**
         * Whether the box is empty (has no pawn)
         */
        isEmpty : function () {
            return this.box.pawn === null;
        },
        /**
         * Whether the contained pawn has the same color of you
         */
        isMyColor : function () {
            return api.fn.getColor() === api(this.box).getPawnColor();
        },
        /**
         * Return the color of the pawn if there is one
         */
        getPawnColor : function () {
            var color = null;
            if (!this.isEmpty()) {
                return this.box.pawn.color;
            }
            return color;
        },
        /**
         * Whether this box is part of a mill
         */
        isMill : function () {
            return this.box.isMill();
        },
        /**
         * Get the box on top of this one if there is one
         */
        getTopBox : function () {
            return this.box.top !== null ? api(this.box.top.id) : null;
        },
        /**
         * Get the box on right of this one if there is one
         */
        getRightBox : function () {
            return this.box.right !== null ? api(this.box.right.id) : null;
        },
        /**
         * Get the box on bottom of this one if there is one
         */
        getBottomBox : function () {
            return this.box.bottom !== null ? api(this.box.bottom.id) : null;
        },
        /**
         * Get the box on left of this one if there is one
         */
        getLeftBox : function () {
            return this.box.left !== null ? api(this.box.left.id) : null;
        },
        /**
         * Whether this box has a box on top
         */
        hasTopBox : function () {
            return this.getTopBox() !== null;
        },
        /**
         * Whether this box has a box on right
         */
        hasRightBox : function () {
            return this.getRightBox() !== null;
        },
        /**
         * Whether this box has a box on bottom
         */
        hasBottomBox : function () {
            return this.getBottomBox() !== null;
        },
        /**
         * Whether this box has a box on left
         */
        hasLeftBox : function () {
            return this.getLeftBox() !== null;
        },
        /**
         * Whether this box has for neighbor the given box
         */
        hasForNeighbor : function (id) {
            id = api.fn.getId(id);
            return (
                (this.box.top !== null && this.box.top.id === id)
                    || (this.box.right !== null && this.box.right.id === id)
                    || (this.box.bottom !== null && this.box.bottom.id === id)
                    || (this.box.left !== null && this.box.left.id === id)
            );
        },
        /**
         * Return box ID
         */
        getId : function () {
            return this.box.id;
        },
        /**
         * Return box row from the grid
         */
        getRow : function () {
            return this.box.row;
        },
        /**
         * Return box column from the grid
         */
        getCol : function () {
            return this.box.col;
        },
        /**
         * Return any mill this box is part of
         * a returned mill is in the following format
         ** var horizontal_mill = [left_side_of_the_mill, middle_of_the_mill, right_side_of_the_mill];
         ** var vertical_mill = [top_side_of_the_mill, middle_of_the_mill, bottom_side_of_the_mill];
         */
        getMills : function () {
            var mills = this.box.getMills(),
                i;
            for (i = 0; i < mills.length; i += 1) {
                mills[i].middle = api(mills[i].middle);
                if (mills[i].horizontal !== null) {
                    mills[i].horizontal[0] = api(mills[i].horizontal[0]);
                    mills[i].horizontal[1] = api(mills[i].horizontal[1]);
                    mills[i].horizontal[2] = api(mills[i].horizontal[2]);
                }
                if (mills[i].vertical !== null) {
                    mills[i].vertical[0] = api(mills[i].vertical[0]);
                    mills[i].vertical[1] = api(mills[i].vertical[1]);
                    mills[i].vertical[2] = api(mills[i].vertical[2]);
                }
            }
            return mills;
        },
        /**
         * Whether the pawn contained in this box can be moved to the the given box
         */
        canMoveTo : function (a, b) {
            var canMove = false;
            if (
                api.fn.getStep() === 'move'
                    && api(a, b).isEmpty()
                    && !this.isEmpty()
                    && this.getPawnColor() === api.fn.getColor()
                    && api.internal.canMove(this.getId(), api(a, b).getId())
            ) {
                canMove = true;
            }
            return canMove;
        },
        /**
         * Move the box to a new location
         * Return true if the action is sucessful
         */
        moveTo : function (a, b) {
            var moved = false,
                box = api(a, b).box;
            if (this.canMoveTo(box)) {
                api.internal.movePawn(this.getId(), box.id);
                moved = true;
            }
            return moved;
        },
        /**
         * Whether a pawn can be placed on this box
         */
        canPlacePawn : function () {
            var canPlace = false;
            if (api.fn.getStep() === 'place') {
                canPlace = game.step.canPlacePawn(this.box.id);
            }
            return canPlace;
        },
        /**
         * Place a pawn onto the box
         * Return true if the action is sucessful
         */
        placePawn : function () {
            var placed = false;
            if (this.canPlacePawn()) {
                api.internal.placePawn(this.box.id);
                placed = true;
            }
            return placed;
        },
        /**
         * Whether the pawn in this box can be moved to an adjacent position
         */
        canMoveAdjacent : function () {
            var canMoveAdjacent = false;
            if (this.hasTopBox() && this.canMoveTo(this.getTopBox())) {
                canMoveAdjacent = true;
            } else if (this.hasRightBox() && this.canMoveTo(this.getRightBox())) {
                canMoveAdjacent = true;
            } else if (this.hasBottomBox() && this.canMoveTo(this.getBottomBox())) {
                canMoveAdjacent = true;
            } else if (this.hasLeftBox() && this.canMoveTo(this.getLeftBox())) {
                canMoveAdjacent = true;
            }
            return canMoveAdjacent;
        },
        /**
         * Whether the pawn in this box can be removed
         */
        canRemovePawn : function () {
            var canRemove = false;
            if (api.fn.getStep() === 'remove') {
                canRemove = game.step.canRemove(this.box.id);
            }
            return canRemove;
        },
        /**
         * Remove the pawn in this box
         * Return true if the action is successful
         */
        removePawn : function () {
            var removed = false;
            if (this.canRemovePawn()) {
                api.internal.removePawn(this.box.id);
                removed = true;
            }
            return removed;
        }
    };
    return api;
});
