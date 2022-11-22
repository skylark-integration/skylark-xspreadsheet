define([
    './element',
    './button',
    './event',
    '../config',
    '../locale/locale'
], function (m_element, Button, m_event, m_config, m_locale) {
    'use strict';
    function buildMenu(clsName) {
        return m_element.h('div', `${ m_config.cssPrefix }-item ${ clsName }`);
    }
    function buildSortItem(it) {
        return buildMenu('state').child(m_locale.t(`sort.${ it }`)).on('click.stop', () => this.itemClick(it));
    }
    function buildFilterBody(items) {
        const {filterbEl, filterValues} = this;
        filterbEl.html('');
        const itemKeys = Object.keys(items);
        itemKeys.forEach((it, index) => {
            const cnt = items[it];
            const active = filterValues.includes(it) ? 'checked' : '';
            filterbEl.child(m_element.h('div', `${ m_config.cssPrefix }-item state ${ active }`).on('click.stop', () => this.filterClick(index, it)).children(it === '' ? m_locale.t('filter.empty') : it, m_element.h('div', 'label').html(`(${ cnt })`)));
        });
    }
    function resetFilterHeader() {
        const {filterhEl, filterValues, values} = this;
        filterhEl.html(`${ filterValues.length } / ${ values.length }`);
        filterhEl.checked(filterValues.length === values.length);
    }
    return class SortFilter {
        constructor() {
            this.filterbEl = m_element.h('div', `${ m_config.cssPrefix }-body`);
            this.filterhEl = m_element.h('div', `${ m_config.cssPrefix }-header state`).on('click.stop', () => this.filterClick(0, 'all'));
            this.el = m_element.h('div', `${ m_config.cssPrefix }-sort-filter`).children(this.sortAscEl = buildSortItem.call(this, 'asc'), this.sortDescEl = buildSortItem.call(this, 'desc'), buildMenu('divider'), m_element.h('div', `${ m_config.cssPrefix }-filter`).children(this.filterhEl, this.filterbEl), m_element.h('div', `${ m_config.cssPrefix }-buttons`).children(new Button('cancel').on('click', () => this.btnClick('cancel')), new Button('ok', 'primary').on('click', () => this.btnClick('ok')))).hide();
            this.ci = null;
            this.sortDesc = null;
            this.values = null;
            this.filterValues = [];
        }
        btnClick(it) {
            if (it === 'ok') {
                const {ci, sort, filterValues} = this;
                if (this.ok) {
                    this.ok(ci, sort, 'in', filterValues);
                }
            }
            this.hide();
        }
        itemClick(it) {
            this.sort = it;
            const {sortAscEl, sortDescEl} = this;
            sortAscEl.checked(it === 'asc');
            sortDescEl.checked(it === 'desc');
        }
        filterClick(index, it) {
            const {filterbEl, filterValues, values} = this;
            const children = filterbEl.children();
            if (it === 'all') {
                if (children.length === filterValues.length) {
                    this.filterValues = [];
                    children.forEach(i => m_element.h(i).checked(false));
                } else {
                    this.filterValues = Array.from(values);
                    children.forEach(i => m_element.h(i).checked(true));
                }
            } else {
                const checked = m_element.h(children[index]).toggle('checked');
                if (checked) {
                    filterValues.push(it);
                } else {
                    filterValues.splice(filterValues.findIndex(i => i === it), 1);
                }
            }
            resetFilterHeader.call(this);
        }
        set(ci, items, filter, sort) {
            this.ci = ci;
            const {sortAscEl, sortDescEl} = this;
            if (sort !== null) {
                this.sort = sort.order;
                sortAscEl.checked(sort.asc());
                sortDescEl.checked(sort.desc());
            } else {
                this.sortDesc = null;
                sortAscEl.checked(false);
                sortDescEl.checked(false);
            }
            this.values = Object.keys(items);
            this.filterValues = filter ? Array.from(filter.value) : Object.keys(items);
            buildFilterBody.call(this, items, filter);
            resetFilterHeader.call(this);
        }
        setOffset(v) {
            this.el.offset(v).show();
            let tindex = 1;
            m_event.bindClickoutside(this.el, () => {
                if (tindex <= 0) {
                    this.hide();
                }
                tindex -= 1;
            });
        }
        show() {
            this.el.show();
        }
        hide() {
            this.el.hide();
            m_event.unbindClickoutside(this.el);
        }
    };
});