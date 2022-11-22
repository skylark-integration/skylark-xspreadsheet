define([
    './element',
    './event',
    '../config'
], function (m_element, m_event, m_config) {
    'use strict';
    function inputMovePrev(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const {filterItems} = this;
        if (filterItems.length <= 0)
            return;
        if (this.itemIndex >= 0)
            filterItems[this.itemIndex].toggle();
        this.itemIndex -= 1;
        if (this.itemIndex < 0) {
            this.itemIndex = filterItems.length - 1;
        }
        filterItems[this.itemIndex].toggle();
    }
    function inputMoveNext(evt) {
        evt.stopPropagation();
        const {filterItems} = this;
        if (filterItems.length <= 0)
            return;
        if (this.itemIndex >= 0)
            filterItems[this.itemIndex].toggle();
        this.itemIndex += 1;
        if (this.itemIndex > filterItems.length - 1) {
            this.itemIndex = 0;
        }
        filterItems[this.itemIndex].toggle();
    }
    function inputEnter(evt) {
        evt.preventDefault();
        const {filterItems} = this;
        if (filterItems.length <= 0)
            return;
        evt.stopPropagation();
        if (this.itemIndex < 0)
            this.itemIndex = 0;
        filterItems[this.itemIndex].el.click();
        this.hide();
    }
    function inputKeydownHandler(evt) {
        const {keyCode} = evt;
        if (evt.ctrlKey) {
            evt.stopPropagation();
        }
        switch (keyCode) {
        case 37: // left
            evt.stopPropagation();
            break;
        case 38: // up
          inputMovePrev.call(this, evt);
          break;
        case 39: // right
          evt.stopPropagation();
          break;
        case 40: // down
          inputMoveNext.call(this, evt);
          break;
        case 13: // enter
          inputEnter.call(this, evt);
          break;
        case 9:
          inputEnter.call(this, evt);
            break;
        default:
            evt.stopPropagation();
            break;
        }
    }
    class Suggest {
        constructor(items, itemClick, width = '200px') {
            this.filterItems = [];
            this.items = items;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-suggest`).css('width', width).hide();
            this.itemClick = itemClick;
            this.itemIndex = -1;
        }
        setOffset(v) {
            this.el.cssRemoveKeys('top', 'bottom').offset(v);
        }
        hide() {
            const {el} = this;
            this.filterItems = [];
            this.itemIndex = -1;
            el.hide();
            m_event.unbindClickoutside(this.el.parent());
        }
        setItems(items) {
            this.items = items;
        }
        search(word) {
            let {items} = this;
            if (!/^\s*$/.test(word)) {
                items = items.filter(it => (it.key || it).startsWith(word.toUpperCase()));
            }
            items = items.map(it => {
                let {title} = it;
                if (title) {
                    if (typeof title === 'function') {
                        title = title();
                    }
                } else {
                    title = it;
                }
                const item = m_element.h('div', `${ m_config.cssPrefix }-item`).child(title).on('click.stop', () => {
                    this.itemClick(it);
                    this.hide();
                });
                if (it.label) {
                    item.child(m_element.h('div', 'label').html(it.label));
                }
                return item;
            });
            this.filterItems = items;
            if (items.length <= 0) {
                return;
            }
            const {el} = this;
            el.html('').children(...items).show();
            m_event.bindClickoutside(el.parent(), () => {
                this.hide();
            });
        }
        bindInputEvents(input) {
            input.on('keydown', evt => inputKeydownHandler.call(this, evt));
        }
    }

    return Suggest;
});