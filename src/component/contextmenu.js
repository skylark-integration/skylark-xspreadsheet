define([
    './element',
    './event',
    '../config',
    '../locale/locale'
], function (m_element, m_event, m_config, m_locale) {
    'use strict';
    const menuItems = [
        {
            key: 'copy',
            title: m_locale.tf('contextmenu.copy'),
            label: 'Ctrl+C'
        },
        {
            key: 'cut',
            title: m_locale.tf('contextmenu.cut'),
            label: 'Ctrl+X'
        },
        {
            key: 'paste',
            title: m_locale.tf('contextmenu.paste'),
            label: 'Ctrl+V'
        },
        {
            key: 'paste-value',
            title: m_locale.tf('contextmenu.pasteValue'),
            label: 'Ctrl+Shift+V'
        },
        {
            key: 'paste-format',
            title: m_locale.tf('contextmenu.pasteFormat'),
            label: 'Ctrl+Alt+V'
        },
        { key: 'divider' },
        {
            key: 'insert-row',
            title: m_locale.tf('contextmenu.insertRow')
        },
        {
            key: 'insert-column',
            title: m_locale.tf('contextmenu.insertColumn')
        },
        { key: 'divider' },
        {
            key: 'delete-row',
            title: m_locale.tf('contextmenu.deleteRow')
        },
        {
            key: 'delete-column',
            title: m_locale.tf('contextmenu.deleteColumn')
        },
        {
            key: 'delete-cell-text',
            title: m_locale.tf('contextmenu.deleteCellText')
        },
        {
            key: 'hide',
            title: m_locale.tf('contextmenu.hide')
        },
        { key: 'divider' },
        {
            key: 'validation',
            title: m_locale.tf('contextmenu.validation')
        },
        { key: 'divider' },
        {
            key: 'cell-printable',
            title: m_locale.tf('contextmenu.cellprintable')
        },
        {
            key: 'cell-non-printable',
            title: m_locale.tf('contextmenu.cellnonprintable')
        },
        { key: 'divider' },
        {
            key: 'cell-editable',
            title: m_locale.tf('contextmenu.celleditable')
        },
        {
            key: 'cell-non-editable',
            title: m_locale.tf('contextmenu.cellnoneditable')
        }
    ];
    function buildMenuItem(item) {
        if (item.key === 'divider') {
            return m_element.h('div', `${ m_config.cssPrefix }-item divider`);
        }
        return m_element.h('div', `${ m_config.cssPrefix }-item`).on('click', () => {
            this.itemClick(item.key);
            this.hide();
        }).children(item.title(), m_element.h('div', 'label').child(item.label || ''));
    }
    function buildMenu() {
        return menuItems.map(it => buildMenuItem.call(this, it));
    }

    class ContextMenu {
        constructor(viewFn, isHide = false) {
            this.menuItems = buildMenu.call(this);
            this.el = m_element.h('div', `${ m_config.cssPrefix }-contextmenu`).children(...this.menuItems).hide();
            this.viewFn = viewFn;
            this.itemClick = () => {
            };
            this.isHide = isHide;
            this.setMode('range');
        }
        setMode(mode) {
            const hideEl = this.menuItems[12];
            if (mode === 'row-col') {
                hideEl.show();
            } else {
                hideEl.hide();
            }
        }
        hide() {
            const {el} = this;
            el.hide();
            m_event.unbindClickoutside(el);
        }
        setPosition(x, y) {
            if (this.isHide)
                return;
            const {el} = this;
            const {width} = el.show().offset();
            const view = this.viewFn();
            const vhf = view.height / 2;
            let left = x;
            if (view.width - x <= width) {
                left -= width;
            }
            el.css('left', `${ left }px`);
            if (y > vhf) {
                el.css('bottom', `${ view.height - y }px`).css('max-height', `${ y }px`).css('top', 'auto');
            } else {
                el.css('top', `${ y }px`).css('max-height', `${ view.height - y }px`).css('bottom', 'auto');
            }
            m_event.bindClickoutside(el);
        }
    }

    return ContextMenu;
});