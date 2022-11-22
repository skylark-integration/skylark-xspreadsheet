define([
    './dropdown',
    './element',
    './icon',
    '../config'
], function (Dropdown, m_element, Icon, m_config) {
    'use strict';
    function buildItemWithIcon(iconName) {
        return m_element.h('div', `${ m_config.cssPrefix }-item`).child(new Icon(iconName));
    }
    return class DropdownAlign extends Dropdown {
        constructor(aligns, align) {
            const icon = new Icon(`align-${ align }`);
            const naligns = aligns.map(it => buildItemWithIcon(`align-${ it }`).on('click', () => {
                this.setTitle(it);
                this.change(it);
            }));
            super(icon, 'auto', true, 'bottom-left', ...naligns);
        }
        setTitle(align) {
            this.title.setName(`align-${ align }`);
            this.hide();
        }
    };
});