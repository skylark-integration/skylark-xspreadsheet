define([
    './element',
    './suggest',
    '../config'
], function (m_element, Suggest, m_config) {
    'use strict';
    return class FormSelect {
        constructor(key, items, width, getTitle = it => it, change = () => {
        }) {
            this.key = key;
            this.getTitle = getTitle;
            this.vchange = () => {
            };
            this.el = m_element.h('div', `${ m_config.cssPrefix }-form-select`);
            this.suggest = new Suggest(items.map(it => ({
                key: it,
                title: this.getTitle(it)
            })), it => {
                this.itemClick(it.key);
                change(it.key);
                this.vchange(it.key);
            }, width, this.el);
            this.el.children(this.itemEl = m_element.h('div', 'input-text').html(this.getTitle(key)), this.suggest.el).on('click', () => this.show());
        }
        show() {
            this.suggest.search('');
        }
        itemClick(it) {
            this.key = it;
            this.itemEl.html(this.getTitle(it));
        }
        val(v) {
            if (v !== undefined) {
                this.key = v;
                this.itemEl.html(this.getTitle(v));
                return this;
            }
            return this.key;
        }
    };
});