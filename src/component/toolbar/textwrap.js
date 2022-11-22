define(['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Textwrap extends ToggleItem {
        constructor() {
            super('textwrap');
        }
    };
});