define([
    './element',
    './icon',
    '../config'
], function (m_element, Icon, m_config) {
    'use strict';
    function xtoast(title, content) {
        const el = m_element.h('div', `${ m_config.cssPrefix }-toast`);
        const dimmer = m_element.h('div', `${ m_config.cssPrefix }-dimmer active`);
        const remove = () => {
            document.body.removeChild(el.el);
            document.body.removeChild(dimmer.el);
        };
        el.children(m_element.h('div', `${ m_config.cssPrefix }-toast-header`).children(new Icon('close').on('click.stop', () => remove()), title), m_element.h('div', `${ m_config.cssPrefix }-toast-content`).html(content));
        document.body.appendChild(el.el);
        document.body.appendChild(dimmer.el);
        const {width, height} = el.box();
        const {clientHeight, clientWidth} = document.documentElement;
        el.offset({
            left: (clientWidth - width) / 2,
            top: (clientHeight - height) / 3
        });
    }
    return {
        xtoast
    };
});