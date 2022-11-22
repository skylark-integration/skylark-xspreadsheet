define([
    './element',
    '../config',
    '../locale/locale'
], function (m_element, m_config, m_locale) {
    'use strict';
    const patterns = {
        number: /(^\d+$)|(^\d+(\.\d{0,4})?$)/,
        date: /^\d{4}-\d{1,2}-\d{1,2}$/
    };
    return class FormField {
        constructor(input, rule, label, labelWidth) {
            this.label = '';
            this.rule = rule;
            if (label) {
                this.label = m_element.h('label', 'label').css('width', `${ labelWidth }px`).html(label);
            }
            this.tip = m_element.h('div', 'tip').child('tip').hide();
            this.input = input;
            this.input.vchange = () => this.validate();
            this.el = m_element.h('div', `${ m_config.cssPrefix }-form-field`).children(this.label, input.el, this.tip);
        }
        isShow() {
            return this.el.css('display') !== 'none';
        }
        show() {
            this.el.show();
        }
        hide() {
            this.el.hide();
            return this;
        }
        val(v) {
            return this.input.val(v);
        }
        hint(hint) {
            this.input.hint(hint);
        }
        validate() {
            const {input, rule, tip, el} = this;
            const v = input.val();
            if (rule.required) {
                if (/^\s*$/.test(v)) {
                    tip.html(m_locale.t('validation.required'));
                    el.addClass('error');
                    return false;
                }
            }
            if (rule.type || rule.pattern) {
                const pattern = rule.pattern || patterns[rule.type];
                if (!pattern.test(v)) {
                    tip.html(m_locale.t('validation.notMatch'));
                    el.addClass('error');
                    return false;
                }
            }
            el.removeClass('error');
            return true;
        }
    };
});