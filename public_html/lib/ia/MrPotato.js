/*global define, Math*/
/**
 * Each time he plays, Mr Patate do something randomly and ends his turn by a quote chosen among the most famous ones.
 */
define(['sys/api'], function (api) {
    'use strict';
    var MrPotato = function () {};
    MrPotato.prototype = {
        name : 'Mr Potato',
        quotes : [
            "You can do anything, but not everything.",
            "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.",
            "The richest man is not he who has the most, but he who needs the least.",
            "You miss 100 percent of the shots you never take.",
            "Courage is not the absence of fear, but rather the judgement that something else is more important than fear.",
            "You must be the change you wish to see in the world.",
            "When hungry, eat your rice; when tired, close your eyes. Fools may laugh at me, but wise men will know what I mean.",
            "The third-rate mind is only happy when it is thinking with the majority. The second-rate mind is only happy when it is thinking with the minority. The first-rate mind is only happy when it is thinking.",
            "To the man who only has a hammer, everything he encounters begins to look like a nail.",
            "We are what we repeatedly do; excellence, then, is not an act but a habit.",
            "A wise man gets more use from his enemies than a fool from his friends.",
            "Do not seek to follow in the footsteps of the men of old; seek what they sought.",
            "Everyone is a genius at least once a year. The real geniuses simply have their bright ideas closer together.",
            "What we think, or what we know, or what we believe is, in the end, of little consequence. The only consequence is what we do.",
            "The real voyage of discovery consists not in seeking new lands but seeing with new eyes.",
            "Work like you don’t need money, love like you’ve never been hurt, and dance like no one’s watching.",
            "Try a thing you haven’t done three times. Once, to get over the fear of doing it. Twice, to learn how to do it. And a third time, to figure out whether you like it or not.",
            "Even if you’re on the right track, you’ll get run over if you just sit there.",
            "People often say that motivation doesn’t last. Well, neither does bathing – that’s why we recommend it daily.",
            "Believe those who are seeking the truth. Doubt those who find it."
        ],
        play : function () {
            var actionDone = false; //IA MUST DO ONLY ONE ACTION AND STOP WORKING
            while (actionDone !== true) {
                switch (api.fn.getStep()) {
                case 'place':
                    actionDone = api(this.rand(1, 24)).placePawn();
                    break;
                case 'move':
                    actionDone = api(this.rand(1, 24)).moveTo(api(this.rand(1, 24)));
                    break;
                case 'remove':
                    actionDone = api(this.rand(1, 24)).removePawn();
                    break;
                }
            }
            api.fn.addMessage('Mr Potato', this.quotes[this.rand(0, this.quotes.length - 1)]);
        },
        rand : function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
    return new MrPotato();
});