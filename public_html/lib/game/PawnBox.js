/*global define, require*/
/**
 * Pawn box, can contain a Pawn object when a player has placed a Pawn
 */
define(['jquery'], function ($) {
    'use strict';
    var PawnBox = function (id, x, y, col, row) {
        this.x = x;
        this.y = y;
        this.col = col;
        this.row = row;
        this.id = id;
    };
    PawnBox.prototype = {
        id: null, //ID (same ID as its representation in the DOM)
        pawn: null,
        top: null, //Reference to the top neighbor if available
        right: null, //Reference to the right neighbor if available
        bottom: null, //Reference to the bottom neighbor if available
        left: null, //Reference to the left neighbor if available
        x: null, //In pixel
        y: null, //In pixel
        col: null, //In grid
        row: null, //In grid
        /**
         * Whether the contained pawn can move to an adjacent box
         */
        canMoveAdjacent : function () {
            return (
                (this.top !== null && this.top.pawn === null)
                    || (this.right !== null && this.right.pawn === null)
                    || (this.bottom !== null && this.bottom.pawn === null)
                    || (this.left !== null && this.left.pawn === null)
            );
        },
        /**
         * Whether this box is part of a mill
         */
        isMill: function () {
            return this.getMills().length > 0;
        },
        /**
         * Whether this box is the middle of that mill
         */
        isMiddleOfMill : function () {
            return (this.isMiddleOfVerticalMill() || this.isMiddleOfHorizontalMill());
        },
        /**
         * Whether this box is part of a vertical mill
         */
        isMiddleOfVerticalMill : function () {
            var isVerticalMill = false;
            if (
                this.pawn !== null
                    && this.top !== null
                    && this.bottom !== null
                    && this.top.pawn !== null
                    && this.bottom.pawn !== null
                    && this.pawn.color === this.top.pawn.color
                    && this.pawn.color === this.bottom.pawn.color
            ) {
                isVerticalMill = true;
            }
            return isVerticalMill;
        },
        /**
         * Whether this box is part of a horizintal mill
         */
        isMiddleOfHorizontalMill : function () {
            var isHorizontalMill = false;
            if (
                this.pawn !== null
                    && this.right !== null
                    && this.left !== null
                    && this.right.pawn !== null
                    && this.left.pawn !== null
                    && this.pawn.color === this.right.pawn.color
                    && this.pawn.color === this.left.pawn.color
            ) {
                isHorizontalMill = true;
            }
            return isHorizontalMill;
        },
        /**
         * Return the horizontal mill if there is one (only if this box is the middle of that mill)
         */
        getHorizontalMill : function () {
            var mill = null;
            if (this.isMiddleOfHorizontalMill()) {
                mill = [this.left.id, this.id, this.right.id];
            }
            return mill;
        },
        /**
         * Return the vertical mill if there is one (only if this box is the middle of that mill)
         */
        getVerticalMill : function () {
            var mill = null;
            if (this.isMiddleOfVerticalMill()) {
                mill = [this.top.id, this.id, this.bottom.id];
            }
            return mill;
        },
        /**
         * Return any mill this box can be part of
         */
        getMills : function () {
            var mills = [];
            var that = this;
            function addMillConditional(box) {
                var horizontalMill = box.getHorizontalMill(),
                    verticalMill = box.getVerticalMill();
                if (
                    horizontalMill !== null
                        && horizontalMill[0] !== that.id
                        && horizontalMill[1] !== that.id
                        && horizontalMill[2] !== that.id
                ) {
                    horizontalMill = null;
                }
                if (
                    verticalMill !== null
                        && verticalMill[0] !== that.id
                        && verticalMill[1] !== that.id
                        && verticalMill[2] !== that.id
                ) {
                    verticalMill = null;
                }
                if (horizontalMill !== null || verticalMill !== null) {
                    mills.push({
                        middle: box,
                        horizontal: horizontalMill,
                        vertical: verticalMill
                    });
                }
            }
            if (this.pawn !== null) {
                if (
                    this.top !== null
                        && this.top.pawn !== null
                        && this.top.pawn.color === this.pawn.color
                        && this.top.isMiddleOfMill()
                ) {
                    addMillConditional(this.top);
                }
                if (
                    this.right !== null
                        && this.right.pawn !== null
                        && this.right.pawn.color === this.pawn.color
                        && this.right.isMiddleOfMill()
                ) {
                    addMillConditional(this.right);
                }
                if (
                    this.bottom !== null
                        && this.bottom.pawn !== null
                        && this.bottom.pawn.color === this.pawn.color
                        && this.bottom.isMiddleOfMill()
                ) {
                    addMillConditional(this.bottom);
                }
                if (
                    this.left !== null
                        && this.left.pawn !== null
                        && this.left.pawn.color === this.pawn.color
                        && this.left.isMiddleOfMill()
                ) {
                    addMillConditional(this.left);
                }
                if (this.isMiddleOfMill()) {
                    addMillConditional(this);
                }
            }
            return mills;
        },
        /**
         * Set a new pawn in this box (of none if null is passed)
         */
        setPawn : function (pawn) {
            this.pawn = pawn;
            if (pawn !== null) {
                switch (pawn.color) {
                case 'white':
                    $(require('game/Gameboard').pawnBoxIdToDom(this.id)).css('background', 'url(img/white-pawn.png)');
                    break;
                case 'black':
                    $(require('game/Gameboard').pawnBoxIdToDom(this.id)).css('background', 'url(img/black-pawn.png)');
                    break;
                default:
                    throw new Error('Unknown pawn color: ' + pawn.color);
                }
            } else {
                $(require('game/Gameboard').pawnBoxIdToDom(this.id)).css('background', 'none');
            }
        }
    };
    return PawnBox;
});