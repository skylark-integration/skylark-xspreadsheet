define([
    './align',
    './valign',
    './autofilter',
    './bold',
    './italic',
    './strike',
    './underline',
    './border',
    './clearformat',
    './paintformat',
    './text_color',
    './fill_color',
    './font_size',
    './font',
    './format',
    './formula',
    './freeze',
    './merge',
    './redo',
    './undo',
    './print',
    './textwrap',
    './more',
    '../element',
    '../../config',
    '../event'
], function (Align, Valign, Autofilter, Bold, Italic, Strike, Underline, Border, Clearformat, Paintformat, TextColor, FillColor, FontSize, Font, Format, Formula, Freeze, Merge, Redo, Undo, Print, Textwrap, More, a, b, c) {
    'use strict';
    function buildDivider() {
        return a.h('div', `${ b.cssPrefix }-toolbar-divider`);
    }
    function initBtns2() {
        this.btns2 = [];
        this.items.forEach(it => {
            if (Array.isArray(it)) {
                it.forEach(({el}) => {
                    const rect = el.box();
                    const {marginLeft, marginRight} = el.computedStyle();
                    this.btns2.push([
                        el,
                        rect.width + parseInt(marginLeft, 10) + parseInt(marginRight, 10)
                    ]);
                });
            } else {
                const rect = it.box();
                const {marginLeft, marginRight} = it.computedStyle();
                this.btns2.push([
                    it,
                    rect.width + parseInt(marginLeft, 10) + parseInt(marginRight, 10)
                ]);
            }
        });
    }
    function moreResize() {
        const {el, btns, moreEl, btns2} = this;
        const {moreBtns, contentEl} = moreEl.dd;
        el.css('width', `${ this.widthFn() - 60 }px`);
        const elBox = el.box();
        let sumWidth = 160;
        let sumWidth2 = 12;
        const list1 = [];
        const list2 = [];
        btns2.forEach(([it, w], index) => {
            sumWidth += w;
            if (index === btns2.length - 1 || sumWidth < elBox.width) {
                list1.push(it);
            } else {
                sumWidth2 += w;
                list2.push(it);
            }
        });
        btns.html('').children(...list1);
        moreBtns.html('').children(...list2);
        contentEl.css('width', `${ sumWidth2 }px`);
        if (list2.length > 0) {
            moreEl.show();
        } else {
            moreEl.hide();
        }
    }
    return class Toolbar {
        constructor(data, widthFn, isHide = false) {
            this.data = data;
            this.change = () => {
            };
            this.widthFn = widthFn;
            this.isHide = isHide;
            const style = data.defaultStyle();
            this.items = [
                [
                    this.undoEl = new Undo(),
                    this.redoEl = new Redo(),
                    new Print(),
                    this.paintformatEl = new Paintformat(),
                    this.clearformatEl = new Clearformat()
                ],
                buildDivider(),
                [this.formatEl = new Format()],
                buildDivider(),
                [
                    this.fontEl = new Font(),
                    this.fontSizeEl = new FontSize()
                ],
                buildDivider(),
                [
                    this.boldEl = new Bold(),
                    this.italicEl = new Italic(),
                    this.underlineEl = new Underline(),
                    this.strikeEl = new Strike(),
                    this.textColorEl = new TextColor(style.color)
                ],
                buildDivider(),
                [
                    this.fillColorEl = new FillColor(style.bgcolor),
                    this.borderEl = new Border(),
                    this.mergeEl = new Merge()
                ],
                buildDivider(),
                [
                    this.alignEl = new Align(style.align),
                    this.valignEl = new Valign(style.valign),
                    this.textwrapEl = new Textwrap()
                ],
                buildDivider(),
                [
                    this.freezeEl = new Freeze(),
                    this.autofilterEl = new Autofilter(),
                    this.formulaEl = new Formula(),
                    this.moreEl = new More()
                ]
            ];
            this.el = a.h('div', `${ b.cssPrefix }-toolbar`);
            this.btns = a.h('div', `${ b.cssPrefix }-toolbar-btns`);
            this.items.forEach(it => {
                if (Array.isArray(it)) {
                    it.forEach(i => {
                        this.btns.child(i.el);
                        i.change = (...args) => {
                            this.change(...args);
                        };
                    });
                } else {
                    this.btns.child(it.el);
                }
            });
            this.el.child(this.btns);
            if (isHide) {
                this.el.hide();
            } else {
                this.reset();
                setTimeout(() => {
                    initBtns2.call(this);
                    moreResize.call(this);
                }, 0);
                c.bind(window, 'resize', () => {
                    moreResize.call(this);
                });
            }
        }
        paintformatActive() {
            return this.paintformatEl.active();
        }
        paintformatToggle() {
            this.paintformatEl.toggle();
        }
        trigger(type) {
            this[`${ type }El`].click();
        }
        resetData(data) {
            this.data = data;
            this.reset();
        }
        reset() {
            if (this.isHide)
                return;
            const {data} = this;
            const style = data.getSelectedCellStyle();
            this.undoEl.setState(!data.canUndo());
            this.redoEl.setState(!data.canRedo());
            this.mergeEl.setState(data.canUnmerge(), !data.selector.multiple());
            this.autofilterEl.setState(!data.canAutofilter());
            const {font, format} = style;
            this.formatEl.setState(format);
            this.fontEl.setState(font.name);
            this.fontSizeEl.setState(font.size);
            this.boldEl.setState(font.bold);
            this.italicEl.setState(font.italic);
            this.underlineEl.setState(style.underline);
            this.strikeEl.setState(style.strike);
            this.textColorEl.setState(style.color);
            this.fillColorEl.setState(style.bgcolor);
            this.alignEl.setState(style.align);
            this.valignEl.setState(style.valign);
            this.textwrapEl.setState(style.textwrap);
            this.freezeEl.setState(data.freezeIsActive());
        }
    };
});