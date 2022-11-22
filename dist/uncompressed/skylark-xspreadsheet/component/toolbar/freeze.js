define(['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Freeze extends ToggleItem {
        constructor() {
            super('freeze');
        }
    };
});