define([
    './element',
    '../config'
], function (m_element, m_config) {
    'use strict';
    return class Icon extends m_element.Element {
        constructor(name) {
            super('div', `${ m_config.cssPrefix }-icon`);
            this.iconNameEl = m_element.h('div', `${ m_config.cssPrefix }-icon-img ${ name }`);
            this.child(this.iconNameEl);
        }
        setName(name) {
            this.iconNameEl.className(`${ m_config.cssPrefix }-icon-img ${ name }`);
        }
    };
});