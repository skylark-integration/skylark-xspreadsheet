define([
    './dropdown',
    './icon',
    './element',
    '../core/formula',
    '../config'
], function (Dropdown, Icon, m_element, m_formula, m_config) {
    'use strict';
    return class DropdownFormula extends Dropdown {
        constructor() {
            const nformulas = m_formula.baseFormulas.map(it => m_element.h('div', `${ m_config.cssPrefix }-item`).on('click', () => {
                this.hide();
                this.change(it);
            }).child(it.key));
            super(new Icon('formula'), '180px', true, 'bottom-left', ...nformulas);
        }
    };
});