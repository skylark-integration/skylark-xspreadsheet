define([
    './element',
    './event',
    '../config'
], function (m_element, m_event, m_config) {
    'use strict';
    function tooltip(html, target) {
        if (target.classList.contains('active')) {
            return;
        }
        const {left, top, width, height} = target.getBoundingClientRect();
        const el = m_element.h('div', `${ m_config.cssPrefix }-tooltip`).html(html).show();
        document.body.appendChild(el.el);
        const elBox = el.box();
        el.css('left', `${ left + width / 2 - elBox.width / 2 }px`).css('top', `${ top + height + 2 }px`);
        m_event.bind(target, 'mouseleave', () => {
            if (document.body.contains(el.el)) {
                document.body.removeChild(el.el);
            }
        });
        m_event.bind(target, 'click', () => {
            if (document.body.contains(el.el)) {
                document.body.removeChild(el.el);
            }
        });
    }

    return tooltip;
});