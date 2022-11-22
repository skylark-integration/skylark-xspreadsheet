define([
    './element',
    './event',
    '../config'
], function (m_element, m_event, m_config) {
    'use strict';
    return class Dropdown extends m_element.Element {
        constructor(title, width, showArrow, placement, ...children) {
            super('div', `${ m_config.cssPrefix }-dropdown ${ placement }`);
            this.title = title;
            this.change = () => {
            };
            this.headerClick = () => {
            };
            if (typeof title === 'string') {
                this.title = m_element.h('div', `${ m_config.cssPrefix }-dropdown-title`).child(title);
            } else if (showArrow) {
                this.title.addClass('arrow-left');
            }
            this.contentEl = m_element.h('div', `${ m_config.cssPrefix }-dropdown-content`).css('width', width).hide();
            this.setContentChildren(...children);
            this.headerEl = m_element.h('div', `${ m_config.cssPrefix }-dropdown-header`);
            this.headerEl.on('click', () => {
                if (this.contentEl.css('display') !== 'block') {
                    this.show();
                } else {
                    this.hide();
                }
            }).children(this.title, showArrow ? m_element.h('div', `${ m_config.cssPrefix }-icon arrow-right`).child(m_element.h('div', `${ m_config.cssPrefix }-icon-img arrow-down`)) : '');
            this.children(this.headerEl, this.contentEl);
        }
        setContentChildren(...children) {
            this.contentEl.html('');
            if (children.length > 0) {
                this.contentEl.children(...children);
            }
        }
        setTitle(title) {
            this.title.html(title);
            this.hide();
        }
        show() {
            const {contentEl} = this;
            contentEl.show();
            this.parent().active();
            m_event.bindClickoutside(this.parent(), () => {
                this.hide();
            });
        }
        hide() {
            this.parent().active(false);
            this.contentEl.hide();
            m_event.unbindClickoutside(this.parent());
        }
    };
});