/*global define*/
/**
 * UI console. Use to display informations on UI (such as game status and IA messages)
 */
define(['jquery'], function ($) {
    'use strict';
    var GConsole = function () {};
    GConsole.prototype = {
        console : null,
        consoleList : null,
        /**
         * Build console
         */
        build : function () {
            this.console = $('<div>')
                .attr('class', 'console');
            this.consoleList = $('<ul>').appendTo($(this.console));
            $(this.console).appendTo($('body'));
        },
        /**
         * Append a new message
         */
        append : function (message, background) {
            $(this.consoleList).append($('<li>').html(message));
            $(this.console).scrollTop(this.console.prop('scrollHeight'));
        }
    };
    return new GConsole();
});