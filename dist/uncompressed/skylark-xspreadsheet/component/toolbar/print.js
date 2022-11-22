define(['./icon_item'], function (IconItem) {
    'use strict';
    return class Print extends IconItem {
        constructor() {
            super('print', 'Ctrl+P');
        }
    };
});