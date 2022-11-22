define(['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Strike extends ToggleItem {
        constructor() {
            super('strike', 'Ctrl+U');
        }
    };
});