define([
    './dropdown',
    './element',
    '../core/font',
    '../config'
], function (Dropdown, m_element, m_font, m_config) {
    'use strict';
    return class DropdownFont extends Dropdown {
        constructor() {
            const nfonts = m_font.baseFonts.map(it => m_element.h('div', `${ m_config.cssPrefix }-item`).on('click', () => {
                this.setTitle(it.title);
                this.change(it);
            }).child(it.title));
            super(m_font.baseFonts[0].title, '160px', true, 'bottom-left', ...nfonts);
        }
    };
});