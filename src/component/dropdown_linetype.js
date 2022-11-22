define([
    './dropdown',
    './element',
    './icon',
    '../config'
], function (Dropdown, m_element, Icon, m_config) {
    'use strict';
    const lineTypes = [
        [
            'thin',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="1" style="user-select: none;"><line x1="0" y1="0.5" x2="50" y2="0.5" stroke-width="1" stroke="black" style="user-select: none;"></line></svg>'
        ],
        [
            'medium',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="2" style="user-select: none;"><line x1="0" y1="1.0" x2="50" y2="1.0" stroke-width="2" stroke="black" style="user-select: none;"></line></svg>'
        ],
        [
            'thick',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="3" style="user-select: none;"><line x1="0" y1="1.5" x2="50" y2="1.5" stroke-width="3" stroke="black" style="user-select: none;"></line></svg>'
        ],
        [
            'dashed',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="1" style="user-select: none;"><line x1="0" y1="0.5" x2="50" y2="0.5" stroke-width="1" stroke="black" stroke-dasharray="2" style="user-select: none;"></line></svg>'
        ],
        [
            'dotted',
            '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="1" style="user-select: none;"><line x1="0" y1="0.5" x2="50" y2="0.5" stroke-width="1" stroke="black" stroke-dasharray="1" style="user-select: none;"></line></svg>'
        ]
    ];
    return class DropdownLineType extends Dropdown {
        constructor(type) {
            const icon = new Icon('line-type');
            let beforei = 0;
            const lineTypeEls = lineTypes.map((it, iti) => m_element.h('div', `${ m_config.cssPrefix }-item state ${ type === it[0] ? 'checked' : '' }`).on('click', () => {
                lineTypeEls[beforei].toggle('checked');
                lineTypeEls[iti].toggle('checked');
                beforei = iti;
                this.hide();
                this.change(it);
            }).child(m_element.h('div', `${ m_config.cssPrefix }-line-type`).html(it[1])));
            super(icon, 'auto', false, 'bottom-left', ...lineTypeEls);
        }
    };
});