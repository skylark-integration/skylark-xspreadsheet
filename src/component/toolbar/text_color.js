define([
    './dropdown_item',
    '../dropdown_color'
], function (DropdownItem, DropdownColor) {
    'use strict';
    return class TextColor extends DropdownItem {
        constructor(color) {
            super('color', undefined, color);
        }
        dropdown() {
            const {tag, value} = this;
            return new DropdownColor(tag, value);
        }
    };
});