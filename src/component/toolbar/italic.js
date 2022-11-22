define(['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Italic extends ToggleItem {
        constructor() {
            super('font-italic', 'Ctrl+I');
        }
    };
});