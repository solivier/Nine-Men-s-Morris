Nine-Men-s-Morris
=================

Artificial Intelligence for a game called Nine Men's Morris.
Project realised for a school project

IAs are located in /public_html/lib/ia/ you can add your own IA just by using the API.
To change IA just change the following lines of this files : 

Modify the line : 
```js
// public_html/lib/sys/Game.js

blackPlayerIa : 'Herethenameofyouria',

```
Just add the name of your IA.


And to give a name to your IA follow this exemple :

```js
/*global define, require*/
define(['sys/api'], function (a) {
    'use strict';
    var IA = function () {};
    IA.prototype = {
        name : 'Herethenameofyouria',
        
        //HERE YOUR LOGIC
    }
};
```


The API is located at "public_html/lib/sys/api.js"

To run the game just run the file public_html/index.html

Contributors : Maxime Richard, Olivier Soulet
