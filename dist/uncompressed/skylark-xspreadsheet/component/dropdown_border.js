define([
    './dropdown',
    './icon',
    './border_palette'
], function (Dropdown, Icon, BorderPalette) {
    'use strict';
    return class DropdownBorder extends Dropdown {
        constructor() {
            const icon = new Icon('border-all');
            const borderPalette = new BorderPalette();
            borderPalette.change = v => {
                this.change(v);
                this.hide();
            };
            super(icon, 'auto', false, 'bottom-left', borderPalette.el);
        }
    };
});