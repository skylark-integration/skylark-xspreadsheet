define([
    './dropdown',
    './element',
    '../core/font',
    '../config'
], function (Dropdown, m_element, m_font, m_config) {
    'use strict';
    return class DropdownFontSize extends Dropdown {
        constructor() {
            const nfontSizes = m_font.fontSizes.map(it => m_element.h('div', `${ m_config.cssPrefix }-item`).on('click', () => {
                this.setTitle(`${ it.pt }`);
                this.change(it);
            }).child(`${ it.pt }`));
            super('10', '60px', true, 'bottom-left', ...nfontSizes);
        }
    };
});