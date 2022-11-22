define([
    './dropdown_item',
    '../dropdown_formula'
], function (DropdownItem, DropdownFormula) {
    'use strict';
    return class Format extends DropdownItem {
        constructor() {
            super('formula');
        }
        getValue(it) {
            return it.key;
        }
        dropdown() {
            return new DropdownFormula();
        }
    };
});