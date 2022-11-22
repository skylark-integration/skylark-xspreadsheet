define(['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Autofilter extends ToggleItem {
        constructor() {
            super('autofilter');
        }
        setState() {
        }
    };
});