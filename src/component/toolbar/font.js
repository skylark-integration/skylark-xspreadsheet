define([
    './dropdown_item',
    '../dropdown_font'
], function (DropdownItem, DropdownFont) {
    'use strict';
    return class Font extends DropdownItem {
        constructor() {
            super('font-name');
        }
        getValue(it) {
            return it.key;
        }
        dropdown() {
            return new DropdownFont();
        }
    };
});