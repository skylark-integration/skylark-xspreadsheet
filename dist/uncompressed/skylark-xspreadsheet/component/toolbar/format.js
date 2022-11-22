define([
    './dropdown_item',
    '../dropdown_format'
], function (DropdownItem, DropdownFormat) {
    'use strict';
    return class Format extends DropdownItem {
        constructor() {
            super('format');
        }
        getValue(it) {
            return it.key;
        }
        dropdown() {
            return new DropdownFormat();
        }
    };
});