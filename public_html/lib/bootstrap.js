/*global require*/
/**
 * Bootstrap file
 * Entry point of the game
 */
require.config({
    baseUrl: 'lib',
    paths: {
        jquery: 'jquery/jquery-1.9.1.min'
    }
});
require(['sys/event', 'sys/api'], function (event, api) {
    'use strict';
    event.gameStarting();
    window.api = api;
});