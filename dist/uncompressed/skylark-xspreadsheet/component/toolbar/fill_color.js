define([
    './dropdown_item',
    '../dropdown_color'
], function (DropdownItem, DropdownColor) {
    'use strict';
    return class FillColor extends DropdownItem {
        constructor(color) {
            super('bgcolor', undefined, color);
        }
        dropdown() {
            const {tag, value} = this;
            return new DropdownColor(tag, value);
        }
    };
});