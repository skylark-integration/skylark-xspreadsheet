define([
    './element',
    './icon',
    '../config',
    './event'
], function (m_element, Icon, m_config, m_event) {
    'use strict';
    return class Modal {
        constructor(title, content, width = '600px') {
            this.title = title;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-modal`).css('width', width).children(m_element.h('div', `${ m_config.cssPrefix }-modal-header`).children(new Icon('close').on('click.stop', () => this.hide()), this.title), m_element.h('div', `${ m_config.cssPrefix }-modal-content`).children(...content)).hide();
        }
        show() {
            this.dimmer = m_element.h('div', `${ m_config.cssPrefix }-dimmer active`);
            document.body.appendChild(this.dimmer.el);
            const {width, height} = this.el.show().box();
            const {clientHeight, clientWidth} = document.documentElement;
            this.el.offset({
                left: (clientWidth - width) / 2,
                top: (clientHeight - height) / 3
            });
            window.xkeydownEsc = evt => {
                if (evt.keyCode === 27) {
                    this.hide();
                }
            };
            m_event.bind(window, 'keydown', window.xkeydownEsc);
        }
        hide() {
            this.el.hide();
            document.body.removeChild(this.dimmer.el);
            m_event.unbind(window, 'keydown', window.xkeydownEsc);
            delete window.xkeydownEsc;
        }
    };
});