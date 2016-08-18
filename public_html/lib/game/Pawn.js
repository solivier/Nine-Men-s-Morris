/*global define*/
/**
 * Pawn object
 */
define(function () {
    'use strict';
    var Pawn = function (color) {
        this.color = color;
    };
    Pawn.prototype = {
        color: null
    };
    return Pawn;
});