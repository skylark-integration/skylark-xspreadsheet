define(['./icon_item'], function (IconItem) {
    'use strict';
    return class Redo extends IconItem {
        constructor() {
            super('redo', 'Ctrl+Y');
        }
    };
});