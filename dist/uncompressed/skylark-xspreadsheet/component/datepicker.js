define([
    './calendar',
    './element',
    '../config'
], function (Calendar, m_element, m_config) {
    'use strict';
    return class Datepicker {
        constructor() {
            this.calendar = new Calendar(new Date());
            this.el = m_element.h('div', `${ m_config.cssPrefix }-datepicker`).child(this.calendar.el).hide();
        }
        setValue(date) {
            const {calendar} = this;
            if (typeof date === 'string') {
                if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(date)) {
                    calendar.setValue(new Date(date.replace(new RegExp('-', 'g'), '/')));
                }
            } else if (date instanceof Date) {
                calendar.setValue(date);
            }
            return this;
        }
        change(cb) {
            this.calendar.selectChange = d => {
                cb(d);
                this.hide();
            };
        }
        show() {
            this.el.show();
        }
        hide() {
            this.el.hide();
        }
    };
});