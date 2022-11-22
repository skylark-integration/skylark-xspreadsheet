define([
    './dropdown_item',
    '../dropdown_align'
], function (DropdownItem, DropdownAlign) {
    'use strict';
    return class Valign extends DropdownItem {
        constructor(value) {
            super('valign', '', value);
        }
        dropdown() {
            const {value} = this;
            return new DropdownAlign([
                'top',
                'middle',
                'bottom'
            ], value);
        }
    };
});