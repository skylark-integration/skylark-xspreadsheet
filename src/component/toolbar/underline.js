define(['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Underline extends ToggleItem {
        constructor() {
            super('underline', 'Ctrl+U');
        }
    };
});