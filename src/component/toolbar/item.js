define([
    '../../config',
    '../tooltip',
    '../element',
    '../../locale/locale'
], function (a, tooltip, b, c) {
    'use strict';
    return class Item {
        constructor(tag, shortcut, value) {
            this.tip = c.t(`toolbar.${ tag.replace(/-[a-z]/g, c => c[1].toUpperCase()) }`);
            if (shortcut)
                this.tip += ` (${ shortcut })`;
            this.tag = tag;
            this.shortcut = shortcut;
            this.value = value;
            this.el = this.element();
            this.change = () => {
            };
        }
        element() {
            const {tip} = this;
            return b.h('div', `${ a.cssPrefix }-toolbar-btn`).on('mouseenter', evt => {
                tooltip(tip, evt.target);
            }).attr('data-tooltip', tip);
        }
        setState() {
        }
    };
});