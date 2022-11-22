define([
    './element',
    './icon',
    './dropdown_color',
    './dropdown_linetype',
    '../config'
], function (m_element, Icon, DropdownColor, DropdownLineType, m_config) {
    'use strict';
    function buildTable(...trs) {
        return m_element.h('table', '').child(m_element.h('tbody', '').children(...trs));
    }
    function buildTd(iconName) {
        return m_element.h('td', '').child(m_element.h('div', `${ m_config.cssPrefix }-border-palette-cell`).child(new Icon(`border-${ iconName }`)).on('click', () => {
            this.mode = iconName;
            const {mode, style, color} = this;
            this.change({
                mode,
                style,
                color
            });
        }));
    }
    return class BorderPalette {
        constructor() {
            this.color = '#000';
            this.style = 'thin';
            this.mode = 'all';
            this.change = () => {
            };
            this.ddColor = new DropdownColor('line-color', this.color);
            this.ddColor.change = color => {
                this.color = color;
            };
            this.ddType = new DropdownLineType(this.style);
            this.ddType.change = ([s]) => {
                this.style = s;
            };
            this.el = m_element.h('div', `${ m_config.cssPrefix }-border-palette`);
            const table = buildTable(m_element.h('tr', '').children(m_element.h('td', `${ m_config.cssPrefix }-border-palette-left`).child(buildTable(m_element.h('tr', '').children(...[
                'all',
                'inside',
                'horizontal',
                'vertical',
                'outside'
            ].map(it => buildTd.call(this, it))), m_element.h('tr', '').children(...[
                'left',
                'top',
                'right',
                'bottom',
                'none'
            ].map(it => buildTd.call(this, it))))), m_element.h('td', `${ m_config.cssPrefix }-border-palette-right`).children(m_element.h('div', `${ m_config.cssPrefix }-toolbar-btn`).child(this.ddColor.el), m_element.h('div', `${ m_config.cssPrefix }-toolbar-btn`).child(this.ddType.el))));
            this.el.child(table);
        }
    };
});