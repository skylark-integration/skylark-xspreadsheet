define([
    './element',
    '../config',
    '../locale/locale'
], function (m_element, m_config, m_locale) {
    'use strict';
    return class Button extends m_element.Element {
        constructor(title, type = '') {
            super('div', `${ m_config.cssPrefix }-button ${ type }`);
            this.child(m_locale.t(`button.${ title }`));
        }
    };
});