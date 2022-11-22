define([
    './dropdown',
    './element',
    '../core/format',
    '../config'
], function (Dropdown, m_element, m_format, m_config) {
    'use strict';
    return class DropdownFormat extends Dropdown {
        constructor() {
            let nformats = m_format.baseFormats.slice(0);
            nformats.splice(2, 0, { key: 'divider' });
            nformats.splice(8, 0, { key: 'divider' });
            nformats = nformats.map(it => {
                const item = m_element.h('div', `${ m_config.cssPrefix }-item`);
                if (it.key === 'divider') {
                    item.addClass('divider');
                } else {
                    item.child(it.title()).on('click', () => {
                        this.setTitle(it.title());
                        this.change(it);
                    });
                    if (it.label)
                        item.child(m_element.h('div', 'label').html(it.label));
                }
                return item;
            });
            super('Normal', '220px', true, 'bottom-left', ...nformats);
        }
        setTitle(key) {
            for (let i = 0; i < m_format.baseFormats.length; i += 1) {
                if (m_format.baseFormats[i].key === key) {
                    this.title.html(m_format.baseFormats[i].title());
                }
            }
            this.hide();
        }
    };
});