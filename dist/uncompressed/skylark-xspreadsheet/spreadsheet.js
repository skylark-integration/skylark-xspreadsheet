define([
    './component/element',
    './core/data_proxy',
    './component/sheet',
    './component/bottombar',
    './config',
    './locale/locale'
//    './index.less'
], function (m_element, DataProxy, Sheet, Bottombar, m_config, m_locale) {
    'use strict';
    class Spreadsheet {
        constructor(selectors, options = {}) {
            let targetEl = selectors;
            this.options = options;
            this.sheetIndex = 1;
            this.datas = [];
            if (typeof selectors === 'string') {
                targetEl = document.querySelector(selectors);
            }
            this.bottombar = new Bottombar(() => {
                const d = this.addSheet();
                this.sheet.resetData(d);
            }, index => {
                const d = this.datas[index];
                this.sheet.resetData(d);
            }, () => {
                this.deleteSheet();
            }, (index, value) => {
                this.datas[index].name = value;
            });
            this.data = this.addSheet();
            const rootEl = m_element.h('div', `${ m_config.cssPrefix }`).on('contextmenu', evt => evt.preventDefault());
            targetEl.appendChild(rootEl.el);
            this.sheet = new Sheet(rootEl, this.data);
            rootEl.child(this.bottombar.el);
        }
        addSheet(name, active = true) {
            const n = name || `sheet${ this.sheetIndex }`;
            const d = new DataProxy(n, this.options);
            d.change = (...args) => {
                this.sheet.trigger('change', ...args);
            };
            this.datas.push(d);
            this.bottombar.addItem(n, active);
            this.sheetIndex += 1;
            return d;
        }
        deleteSheet() {
            const [oldIndex, nindex] = this.bottombar.deleteItem();
            if (oldIndex >= 0) {
                this.datas.splice(oldIndex, 1);
                if (nindex >= 0)
                    this.sheet.resetData(this.datas[nindex]);
            }
        }
        loadData(data) {
            const ds = Array.isArray(data) ? data : [data];
            this.bottombar.clear();
            this.datas = [];
            if (ds.length > 0) {
                for (let i = 0; i < ds.length; i += 1) {
                    const it = ds[i];
                    const nd = this.addSheet(it.name, i === 0);
                    nd.setData(it);
                    if (i === 0) {
                        this.sheet.resetData(nd);
                    }
                }
            }
            return this;
        }
        getData() {
            return this.datas.map(it => it.getData());
        }
        cellText(ri, ci, text, sheetIndex = 0) {
            this.datas[sheetIndex].setCellText(ri, ci, text, 'finished');
            return this;
        }
        cell(ri, ci, sheetIndex = 0) {
            return this.datas[sheetIndex].getCell(ri, ci);
        }
        cellStyle(ri, ci, sheetIndex = 0) {
            return this.datas[sheetIndex].getCellStyle(ri, ci);
        }
        reRender() {
            this.sheet.table.render();
            return this;
        }
        on(eventName, func) {
            this.sheet.on(eventName, func);
            return this;
        }
        validate() {
            const {validations} = this.data;
            return validations.errors.size <= 0;
        }
        change(cb) {
            this.sheet.on('change', cb);
            return this;
        }
        static locale(lang, message) {
            m_locale.locale(lang, message);
        }
    }

    return Spreadsheet;

});