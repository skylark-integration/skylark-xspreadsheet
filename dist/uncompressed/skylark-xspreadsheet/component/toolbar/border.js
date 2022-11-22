define([
    './dropdown_item',
    '../dropdown_border'
], function (DropdownItem, DropdownBorder) {
    'use strict';
    class Border extends DropdownItem {
        constructor() {
            super('border');
        }
        dropdown() {
            return new DropdownBorder();
        }
    }

    return Border;
});