define([
    './dropdown_item',
    '../dropdown_fontsize'
], function (DropdownItem, DropdownFontsize) {
    'use strict';
    return class Format extends DropdownItem {
        constructor() {
            super('font-size');
        }
        getValue(it) {
            return it.pt;
        }
        dropdown() {
            return new DropdownFontsize();
        }
    };
});