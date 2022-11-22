define(['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Bold extends ToggleItem {
        constructor() {
            super('font-bold', 'Ctrl+B');
        }
    };
});