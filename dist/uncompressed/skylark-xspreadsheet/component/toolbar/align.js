define([
    './dropdown_item',
    '../dropdown_align'
], function (DropdownItem, DropdownAlign) {
    'use strict';
    
    class Align extends DropdownItem {
        constructor(value) {
            super('align', '', value);
        }
        dropdown() {
            const {value} = this;
            return new DropdownAlign([
                'left',
                'center',
                'right'
            ], value);
        }
    };

    return Align;
});