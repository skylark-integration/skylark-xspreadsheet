define([
    './modal',
    './form_input',
    './form_select',
    './form_field',
    './button',
    '../locale/locale',
    './element',
    '../config'
], function (Modal, FormInput, FormSelect, FormField, Button, m_locale, m_element, m_config) {
    'use strict';
    const fieldLabelWidth = 100;
    return class ModalValidation extends Modal {
        constructor() {
            const mf = new FormField(new FormSelect('cell', ['cell'], '100%', it => m_locale.t(`dataValidation.modeType.${ it }`)), { required: true }, `${ m_locale.t('dataValidation.range') }:`, fieldLabelWidth);
            const rf = new FormField(new FormInput('120px', 'E3 or E3:F12'), {
                required: true,
                pattern: /^([A-Z]{1,2}[1-9]\d*)(:[A-Z]{1,2}[1-9]\d*)?$/
            });
            const cf = new FormField(new FormSelect('list', [
                'list',
                'number',
                'date',
                'phone',
                'email'
            ], '100%', it => m_locale.t(`dataValidation.type.${ it }`), it => this.criteriaSelected(it)), { required: true }, `${ m_locale.t('dataValidation.criteria') }:`, fieldLabelWidth);
            const of = new FormField(new FormSelect('be', [
                'be',
                'nbe',
                'eq',
                'neq',
                'lt',
                'lte',
                'gt',
                'gte'
            ], '160px', it => m_locale.t(`dataValidation.operator.${ it }`), it => this.criteriaOperatorSelected(it)), { required: true }).hide();
            const minvf = new FormField(new FormInput('70px', '10'), { required: true }).hide();
            const maxvf = new FormField(new FormInput('70px', '100'), {
                required: true,
                type: 'number'
            }).hide();
            const svf = new FormField(new FormInput('120px', 'a,b,m_config'), { required: true });
            const vf = new FormField(new FormInput('70px', '10'), {
                required: true,
                type: 'number'
            }).hide();
            super(m_locale.t('contextmenu.validation'), [
                m_element.h('div', `${ m_config.cssPrefix }-form-fields`).children(mf.el, rf.el),
                m_element.h('div', `${ m_config.cssPrefix }-form-fields`).children(cf.el, of.el, minvf.el, maxvf.el, vf.el, svf.el),
                m_element.h('div', `${ m_config.cssPrefix }-buttons`).children(new Button('cancel').on('click', () => this.btnClick('cancel')), new Button('remove').on('click', () => this.btnClick('remove')), new Button('save', 'primary').on('click', () => this.btnClick('save')))
            ]);
            this.mf = mf;
            this.rf = rf;
            this.cf = cf;
            this.of = of;
            this.minvf = minvf;
            this.maxvf = maxvf;
            this.vf = vf;
            this.svf = svf;
            this.change = () => {
            };
        }
        showVf(it) {
            const hint = it === 'date' ? '2018-11-12' : '10';
            const {vf} = this;
            vf.input.hint(hint);
            vf.show();
        }
        criteriaSelected(it) {
            const {of, minvf, maxvf, vf, svf} = this;
            if (it === 'date' || it === 'number') {
                of.show();
                minvf.rule.type = it;
                maxvf.rule.type = it;
                if (it === 'date') {
                    minvf.hint('2018-11-12');
                    maxvf.hint('2019-11-12');
                } else {
                    minvf.hint('10');
                    maxvf.hint('100');
                }
                minvf.show();
                maxvf.show();
                vf.hide();
                svf.hide();
            } else {
                if (it === 'list') {
                    svf.show();
                } else {
                    svf.hide();
                }
                vf.hide();
                of.hide();
                minvf.hide();
                maxvf.hide();
            }
        }
        criteriaOperatorSelected(it) {
            if (!it)
                return;
            const {minvf, maxvf, vf} = this;
            if (it === 'be' || it === 'nbe') {
                minvf.show();
                maxvf.show();
                vf.hide();
            } else {
                const type = this.cf.val();
                vf.rule.type = type;
                if (type === 'date') {
                    vf.hint('2018-11-12');
                } else {
                    vf.hint('10');
                }
                vf.show();
                minvf.hide();
                maxvf.hide();
            }
        }
        btnClick(action) {
            if (action === 'cancel') {
                this.hide();
            } else if (action === 'remove') {
                this.change('remove');
                this.hide();
            } else if (action === 'save') {
                const attrs = [
                    'mf',
                    'rf',
                    'cf',
                    'of',
                    'svf',
                    'vf',
                    'minvf',
                    'maxvf'
                ];
                for (let i = 0; i < attrs.length; i += 1) {
                    const field = this[attrs[i]];
                    if (field.isShow()) {
                        if (!field.validate())
                            return;
                    }
                }
                const mode = this.mf.val();
                const ref = this.rf.val();
                const type = this.cf.val();
                const operator = this.of.val();
                let value = this.svf.val();
                if (type === 'number' || type === 'date') {
                    if (operator === 'be' || operator === 'nbe') {
                        value = [
                            this.minvf.val(),
                            this.maxvf.val()
                        ];
                    } else {
                        value = this.vf.val();
                    }
                }
                this.change('save', mode, ref, {
                    type,
                    operator,
                    required: false,
                    value
                });
                this.hide();
            }
        }
        setValue(v) {
            if (v) {
                const {mf, rf, cf, of, svf, vf, minvf, maxvf} = this;
                const {mode, ref, validator} = v;
                const {type, operator, value} = validator || { type: 'list' };
                mf.val(mode || 'cell');
                rf.val(ref);
                cf.val(type);
                of.val(operator);
                if (Array.isArray(value)) {
                    minvf.val(value[0]);
                    maxvf.val(value[1]);
                } else {
                    svf.val(value || '');
                    vf.val(value || '');
                }
                this.criteriaSelected(type);
                this.criteriaOperatorSelected(operator);
            }
            this.show();
        }
    };
});