define(['./icon_item'], function (IconItem) {
    'use strict';
    return class Undo extends IconItem {
        constructor() {
            super('undo', 'Ctrl+Z');
        }
    };
});