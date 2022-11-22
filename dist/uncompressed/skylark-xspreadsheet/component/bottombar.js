define([
    './element',
    './event',
    '../config',
    './icon',
    './form_input',
    './dropdown',
    './message',
    '../locale/locale'
], function (m_element, m_event, m_config, Icon, FormInput, Dropdown, m_message, m_locale) {
    'use strict';
    class DropdownMore extends Dropdown {
        constructor(click) {
            const icon = new Icon('ellipsis');
            super(icon, 'auto', false, 'top-left');
            this.contentClick = click;
        }
        reset(items) {
            const eles = items.map((it, i) => m_element.h('div', `${ m_config.cssPrefix }-item`).css('width', '150px').css('font-weight', 'normal').on('click', () => {
                this.contentClick(i);
                this.hide();
            }).child(it));
            this.setContentChildren(...eles);
        }
        setTitle() {
        }
    }
    const menuItems = [{
            key: 'delete',
            title: m_locale.tf('contextmenu.deleteSheet')
        }];
    function buildMenuItem(item) {
        return m_element.h('div', `${ m_config.cssPrefix }-item`).child(item.title()).on('click', () => {
            this.itemClick(item.key);
            this.hide();
        });
    }
    function buildMenu() {
        return menuItems.map(it => buildMenuItem.call(this, it));
    }
    class ContextMenu {
        constructor() {
            this.el = m_element.h('div', `${ m_config.cssPrefix }-contextmenu`).css('width', '160px').children(...buildMenu.call(this)).hide();
            this.itemClick = () => {
            };
        }
        hide() {
            const {el} = this;
            el.hide();
            m_event.unbindClickoutside(el);
        }
        setOffset(offset) {
            const {el} = this;
            el.offset(offset);
            el.show();
            m_event.bindClickoutside(el);
        }
    }
    return class Bottombar {
        constructor(addFunc = () => {
        }, swapFunc = () => {
        }, deleteFunc = () => {
        }, updateFunc = () => {
        }) {
            this.swapFunc = swapFunc;
            this.updateFunc = updateFunc;
            this.dataNames = [];
            this.activeEl = null;
            this.deleteEl = null;
            this.items = [];
            this.moreEl = new DropdownMore(i => {
                this.clickSwap2(this.items[i]);
            });
            this.contextMenu = new ContextMenu();
            this.contextMenu.itemClick = deleteFunc;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-bottombar`).children(this.contextMenu.el, this.menuEl = m_element.h('ul', `${ m_config.cssPrefix }-menu`).child(m_element.h('li', '').children(new Icon('add').on('click', () => {
                if (this.dataNames.length < 10) {
                    addFunc();
                } else {
                    m_message.xtoast('tip', 'it less than or equal to 10');
                }
            }), m_element.h('span', '').child(this.moreEl))));
        }
        addItem(name, active) {
            this.dataNames.push(name);
            const item = m_element.h('li', active ? 'active' : '').child(name);
            item.on('click', () => {
                this.clickSwap2(item);
            }).on('contextmenu', evt => {
                const {offsetLeft, offsetHeight} = evt.target;
                this.contextMenu.setOffset({
                    left: offsetLeft,
                    bottom: offsetHeight + 1
                });
                this.deleteEl = item;
            }).on('dblclick', () => {
                const v = item.html();
                const input = new FormInput('auto', '');
                input.val(v);
                input.input.on('blur', ({target}) => {
                    const {value} = target;
                    const nindex = this.dataNames.findIndex(it => it === v);
                    this.renameItem(nindex, value);
                });
                item.html('').child(input.el);
                input.focus();
            });
            if (active) {
                this.clickSwap(item);
            }
            this.items.push(item);
            this.menuEl.child(item);
            this.moreEl.reset(this.dataNames);
        }
        renameItem(index, value) {
            this.dataNames.splice(index, 1, value);
            this.moreEl.reset(this.dataNames);
            this.items[index].html('').child(value);
            this.updateFunc(index, value);
        }
        clear() {
            this.items.forEach(it => {
                this.menuEl.removeChild(it.el);
            });
            this.items = [];
            this.dataNames = [];
            this.moreEl.reset(this.dataNames);
        }
        deleteItem() {
            const {activeEl, deleteEl} = this;
            if (this.items.length > 1) {
                const index = this.items.findIndex(it => it === deleteEl);
                this.items.splice(index, 1);
                this.dataNames.splice(index, 1);
                this.menuEl.removeChild(deleteEl.el);
                this.moreEl.reset(this.dataNames);
                if (activeEl === deleteEl) {
                    const [f] = this.items;
                    this.activeEl = f;
                    this.activeEl.toggle();
                    return [
                        index,
                        0
                    ];
                }
                return [
                    index,
                    -1
                ];
            }
            return [-1];
        }
        clickSwap2(item) {
            const index = this.items.findIndex(it => it === item);
            this.clickSwap(item);
            this.activeEl.toggle();
            this.swapFunc(index);
        }
        clickSwap(item) {
            if (this.activeEl !== null) {
                this.activeEl.toggle();
            }
            this.activeEl = item;
        }
    };
});