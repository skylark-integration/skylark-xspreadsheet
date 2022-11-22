define([
    './element',
    './icon',
    '../locale/locale'
], function (m_element, Icon, m_locale) {
    'use strict';
    function addMonth(date, step) {
        date.setMonth(date.getMonth() + step);
    }
    function weekday(date, index) {
        const d = new Date(date);
        d.setDate(index - date.getDay() + 1);
        return d;
    }
    function monthDays(year, month, cdate) {
        const startDate = new Date(year, month, 1, 23, 59, 59);
        const datess = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        for (let i = 0; i < 6; i += 1) {
            for (let j = 0; j < 7; j += 1) {
                const index = i * 7 + j;
                const d = weekday(startDate, index);
                const disabled = d.getMonth() !== month;
                const active = d.getMonth() === cdate.getMonth() && d.getDate() === cdate.getDate();
                datess[i][j] = {
                    d,
                    disabled,
                    active
                };
            }
        }
        return datess;
    }
    

    class Calendar {
        constructor(value) {
            this.value = value;
            this.cvalue = new Date(value);
            this.headerLeftEl = m_element.h('div', 'calendar-header-left');
            this.bodyEl = m_element.h('tbody', '');
            this.buildAll();
            this.el = m_element.h('div', 'x-spreadsheet-calendar').children(m_element.h('div', 'calendar-header').children(this.headerLeftEl, m_element.h('div', 'calendar-header-right').children(m_element.h('m_element', 'calendar-prev').on('click.stop', () => this.prev()).child(new Icon('chevron-left')), m_element.h('m_element', 'calendar-next').on('click.stop', () => this.next()).child(new Icon('chevron-right')))), m_element.h('table', 'calendar-body').children(m_element.h('thead', '').child(m_element.h('tr', '').children(...m_locale.t('calendar.weeks').map(week => m_element.h('th', 'cell').child(week)))), this.bodyEl));
            this.selectChange = () => {
            };
        }
        setValue(value) {
            this.value = value;
            this.cvalue = new Date(value);
            this.buildAll();
        }
        prev() {
            const {value} = this;
            addMonth(value, -1);
            this.buildAll();
        }
        next() {
            const {value} = this;
            addMonth(value, 1);
            this.buildAll();
        }
        buildAll() {
            this.buildHeaderLeft();
            this.buildBody();
        }
        buildHeaderLeft() {
            const {value} = this;
            this.headerLeftEl.html(`${ m_locale.t('calendar.months')[value.getMonth()] } ${ value.getFullYear() }`);
        }
        buildBody() {
            const {value, cvalue, bodyEl} = this;
            const mDays = monthDays(value.getFullYear(), value.getMonth(), cvalue);
            const trs = mDays.map(it => {
                const tds = it.map(it1 => {
                    let cls = 'cell';
                    if (it1.disabled)
                        cls += ' disabled';
                    if (it1.active)
                        cls += ' active';
                    return m_element.h('td', '').child(m_element.h('div', cls).on('click.stop', () => {
                        this.selectChange(it1.d);
                    }).child(it1.d.getDate().toString()));
                });
                return m_element.h('tr', '').children(...tds);
            });
            bodyEl.html('').children(...trs);
        }
    }

    return Calendar;
});