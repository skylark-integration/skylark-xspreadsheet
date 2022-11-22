define([
    './element',
    '../config',
    './button',
    '../canvas/draw',
    './table',
    '../locale/locale'
], function (m_element, m_config, Button, m_draw, m_table, m_locale) {
    'use strict';
    const PAGER_SIZES = [
        [
            'A3',
            11.69,
            16.54
        ],
        [
            'A4',
            8.27,
            11.69
        ],
        [
            'A5',
            5.83,
            8.27
        ],
        [
            'B4',
            9.84,
            13.9
        ],
        [
            'B5',
            6.93,
            9.84
        ]
    ];
    const PAGER_ORIENTATIONS = [
        'landscape',
        'portrait'
    ];
    function inches2px(inc) {
        return parseInt(96 * inc, 10);
    }
    function btnClick(type) {
        if (type === 'cancel') {
            this.el.hide();
        } else {
            this.toPrint();
        }
    }
    function pagerSizeChange(evt) {
        const {paper} = this;
        const {value} = evt.target;
        const ps = PAGER_SIZES[value];
        paper.w = inches2px(ps[1]);
        paper.undefined = inches2px(ps[2]);
        this.preview();
    }
    function pagerOrientationChange(evt) {
        const {paper} = this;
        const {value} = evt.target;
        const v = PAGER_ORIENTATIONS[value];
        paper.orientation = v;
        this.preview();
    }
    return class Print {
        constructor(data) {
            this.paper = {
                w: inches2px(PAGER_SIZES[0][1]),
                h: inches2px(PAGER_SIZES[0][2]),
                padding: 50,
                orientation: PAGER_ORIENTATIONS[0],
                get width() {
                    return this.orientation === 'landscape' ? this.undefined : this.w;
                },
                get height() {
                    return this.orientation === 'landscape' ? this.w : this.undefined;
                }
            };
            this.data = data;
            this.el = m_element.h('div', `${ m_config.cssPrefix }-print`).children(m_element.h('div', `${ m_config.cssPrefix }-print-bar`).children(m_element.h('div', '-title').child('Print settings'), m_element.h('div', '-right').children(m_element.h('div', `${ m_config.cssPrefix }-buttons`).children(new Button('cancel').on('click', btnClick.bind(this, 'cancel')), new Button('next', 'primary').on('click', btnClick.bind(this, 'next'))))), m_element.h('div', `${ m_config.cssPrefix }-print-content`).children(this.contentEl = m_element.h('div', '-content'), m_element.h('div', '-sider').child(m_element.h('form', '').children(m_element.h('fieldset', '').children(m_element.h('label', '').child(`${ m_locale.t('print.size') }`), m_element.h('select', '').children(...PAGER_SIZES.map((it, index) => m_element.h('option', '').attr('value', index).child(`${ it[0] } ( ${ it[1] }''x${ it[2] }'' )`))).on('change', pagerSizeChange.bind(this))), m_element.h('fieldset', '').children(m_element.h('label', '').child(`${ m_locale.t('print.orientation') }`), m_element.h('select', '').children(...PAGER_ORIENTATIONS.map((it, index) => m_element.h('option', '').attr('value', index).child(`${ m_locale.t('print.orientations')[index] }`))).on('change', pagerOrientationChange.bind(this))))))).hide();
        }
        resetData(data) {
            this.data = data;
        }
        preview() {
            const {data, paper} = this;
            const {width, height, padding} = paper;
            const iwidth = width - padding * 2;
            const iheight = height - padding * 2;
            const cr = data.contentRange();
            const pages = parseInt(cr.undefined / iheight, 10) + 1;
            const scale = iwidth / cr.w;
            let left = padding;
            const top = padding;
            if (scale > 1) {
                left += (iwidth - cr.w) / 2;
            }
            let ri = 0;
            let yoffset = 0;
            this.contentEl.html('');
            this.canvases = [];
            const mViewRange = {
                sri: 0,
                sci: 0,
                eri: 0,
                eci: 0
            };
            for (let i = 0; i < pages; i += 1) {
                let th = 0;
                let yo = 0;
                const wrap = m_element.h('div', `${ m_config.cssPrefix }-canvas-card`);
                const canvas = m_element.h('canvas', `${ m_config.cssPrefix }-canvas`);
                this.canvases.push(canvas.el);
                const draw = new m_draw.Draw(canvas.el, width, height);
                draw.save();
                draw.translate(left, top);
                if (scale < 1)
                    draw.scale(scale, scale);
                for (; ri <= cr.eri; ri += 1) {
                    const rh = data.rows.getHeight(ri);
                    th += rh;
                    if (th < iheight) {
                        for (let ci = 0; ci <= cr.eci; ci += 1) {
                            m_table.renderCell(draw, data, ri, ci, yoffset);
                            mViewRange.eci = ci;
                        }
                    } else {
                        yo = -(th - rh);
                        break;
                    }
                }
                mViewRange.eri = ri;
                draw.restore();
                draw.save();
                draw.translate(left, top);
                if (scale < 1)
                    draw.scale(scale, scale);
                const yof = yoffset;
                data.eachMergesInView(mViewRange, ({sri, sci}) => {
                    m_table.renderCell(draw, data, sri, sci, yof);
                });
                draw.restore();
                mViewRange.sri = mViewRange.eri;
                mViewRange.sci = mViewRange.eci;
                yoffset += yo;
                this.contentEl.child(m_element.h('div', `${ m_config.cssPrefix }-canvas-card-wraper`).child(wrap.child(canvas)));
            }
            this.el.show();
        }
        toPrint() {
            this.el.hide();
            const {paper} = this;
            const iframe = m_element.h('iframe', '').hide();
            const {el} = iframe;
            window.document.body.appendChild(el);
            const {contentWindow} = el;
            const idoc = contentWindow.document;
            const style = document.createElement('style');
            style.innerHTML = `
      @page { size: ${ paper.width }px ${ paper.height }px; };
      canvas {
        page-break-before: auto;        
        page-break-after: always;
        image-rendering: pixelated;
      };
    `;
            idoc.head.appendChild(style);
            this.canvases.forEach(it => {
                const cn = it.cloneNode(false);
                const ctx = cn.getContext('2d');
                ctx.drawImage(it, 0, 0);
                idoc.body.appendChild(cn);
            });
            contentWindow.print();
        }
    };
});