define([
    './element',
    '../config'
], function (m_element, m_config) {
    'use strict';
    return class FormInput {
        constructor(width, hint) {
            this.vchange = () => {
            };
            this.el = m_element.h('div', `${ m_config.cssPrefix }-form-input`);
            this.input = m_element.h('input', '').css('width', width).on('input', evt => this.vchange(evt)).attr('placeholder', hint);
            this.el.child(this.input);
        }
        focus() {
            setTimeout(() => {
                this.input.el.focus();
            }, 10);
        }
        hint(v) {
            this.input.attr('placeholder', v);
        }
        val(v) {
            return this.input.val(v);
        }
    };
});