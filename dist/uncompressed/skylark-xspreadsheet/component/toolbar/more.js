define([
    '../dropdown',
    './dropdown_item',
    '../../config',
    '../element',
    '../icon'
], function (Dropdown, DropdownItem, a, b, Icon) {
    'use strict';
    class DropdownMore extends Dropdown {
        constructor() {
            const icon = new Icon('ellipsis');
            const moreBtns = b.h('div', `${ a.cssPrefix }-toolbar-more`);
            super(icon, 'auto', false, 'bottom-right', moreBtns);
            this.moreBtns = moreBtns;
            this.contentEl.css('max-width', '420px');
        }
    }
    return class More extends DropdownItem {
        constructor() {
            super('more');
            this.el.hide();
        }
        dropdown() {
            return new DropdownMore();
        }
        show() {
            this.el.show();
        }
        hide() {
            this.el.hide();
        }
    };
});