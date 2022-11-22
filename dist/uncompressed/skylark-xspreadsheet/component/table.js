define([
    '../core/alphabet',
    '../core/font',
    '../core/cell',
    '../core/formula',
    '../core/format',
    '../canvas/draw'
], function (m_alphabet, m_font, m_cell, m_formula, m_format, m_draw) {
    'use strict';
    const cellPaddingWidth = 5;
    const tableFixedHeaderCleanStyle = { fillStyle: '#f4f5f8' };
    const tableGridStyle = {
        fillStyle: '#fff',
        lineWidth: m_draw.thinLineWidth,
        strokeStyle: '#e6e6e6'
    };
    function tableFixedHeaderStyle() {
        return {
            textAlign: 'center',
            textBaseline: 'middle',
            font: `500 ${ m_draw.npx(12) }px Source Sans Pro`,
            fillStyle: '#585757',
            lineWidth: m_draw.thinLineWidth(),
            strokeStyle: '#e6e6e6'
        };
    }
    function getDrawBox(data, rindex, cindex, yoffset = 0) {
        const {left, top, width, height} = data.cellRect(rindex, cindex);
        return new m_draw.DrawBox(left, top + yoffset, width, height, cellPaddingWidth);
    }
    
    function renderCell(draw, data, rindex, cindex, yoffset = 0) {
        const {sortedRowMap, rows, cols} = data;
        if (rows.isHide(rindex) || cols.isHide(cindex))
            return;
        let nrindex = rindex;
        if (sortedRowMap.has(rindex)) {
            nrindex = sortedRowMap.get(rindex);
        }
        const cell = data.getCell(nrindex, cindex);
        if (cell === null)
            return;
        let frozen = false;
        if ('editable' in cell && cell.editable === false) {
            frozen = true;
        }
        const style = data.getCellStyleOrDefault(nrindex, cindex);
        const dbox = getDrawBox(data, rindex, cindex, yoffset);
        dbox.bgcolor = style.bgcolor;
        if (style.border !== undefined) {
            dbox.setBorders(style.border);
            draw.strokeBorders(dbox);
        }
        draw.rect(dbox, () => {
            let cellText = m_cell.render(cell.text || '', m_formula.formulam, (y, x) => data.getCellTextOrDefault(x, y));
            if (style.format) {
                cellText = m_format.formatm[style.format].render(cellText);
            }
            const font = Object.assign({}, style.font);
            font.size = m_font.getFontSizePxByPt(font.size);
            draw.text(cellText, dbox, {
                align: style.align,
                valign: style.valign,
                font,
                color: style.color,
                strike: style.strike,
                underline: style.underline
            }, style.textwrap);
            const error = data.validations.getError(rindex, cindex);
            if (error) {
                draw.error(dbox);
            }
            if (frozen) {
                draw.frozen(dbox);
            }
        });
    }
    function renderAutofilter(viewRange) {
        const {data, draw} = this;
        if (viewRange) {
            const {autoFilter} = data;
            if (!autoFilter.active())
                return;
            const afRange = autoFilter.hrange();
            if (viewRange.intersects(afRange)) {
                afRange.each((ri, ci) => {
                    const dbox = getDrawBox(data, ri, ci);
                    draw.dropdown(dbox);
                });
            }
        }
    }
    function renderContent(viewRange, fw, fh, tx, ty) {
        const {draw, data} = this;
        draw.save();
        draw.translate(fw, fh).translate(tx, ty);
        const {exceptRowSet} = data;
        const filteredTranslateFunc = ri => {
            const ret = exceptRowSet.has(ri);
            if (ret) {
                const height = data.rows.getHeight(ri);
                draw.translate(0, -height);
            }
            return !ret;
        };
        const exceptRowTotalHeight = data.exceptRowTotalHeight(viewRange.sri, viewRange.eri);
        draw.save();
        draw.translate(0, -exceptRowTotalHeight);
        viewRange.each((ri, ci) => {
            renderCell(draw, data, ri, ci);
        }, ri => filteredTranslateFunc(ri));
        draw.restore();
        const rset = new Set();
        draw.save();
        draw.translate(0, -exceptRowTotalHeight);
        data.eachMergesInView(viewRange, ({sri, sci, eri}) => {
            if (!exceptRowSet.has(sri)) {
                renderCell(draw, data, sri, sci);
            } else if (!rset.has(sri)) {
                rset.add(sri);
                const height = data.rows.sumHeight(sri, eri + 1);
                draw.translate(0, -height);
            }
        });
        draw.restore();
        renderAutofilter.call(this, viewRange);
        draw.restore();
    }
    function renderSelectedHeaderCell(x, y, w, h) {
        const {draw} = this;
        draw.save();
        draw.attr({ fillStyle: 'rgba(75, 137, 255, 0.08)' }).fillRect(x, y, w, h);
        draw.restore();
    }
    function renderFixedHeaders(type, viewRange, w, h, tx, ty) {
        const {draw, data} = this;
        const sumHeight = viewRange.h;
        const sumWidth = viewRange.w;
        const nty = ty + h;
        const ntx = tx + w;
        draw.save();
        draw.attr(tableFixedHeaderCleanStyle);
        if (type === 'all' || type === 'left')
            draw.fillRect(0, nty, w, sumHeight);
        if (type === 'all' || type === 'top')
            draw.fillRect(ntx, 0, sumWidth, h);
        const {sri, sci, eri, eci} = data.selector.range;
        draw.attr(tableFixedHeaderStyle());
        if (type === 'all' || type === 'left') {
            data.rowEach(viewRange.sri, viewRange.eri, (i, y1, rowHeight) => {
                const y = nty + y1;
                const ii = i;
                draw.line([
                    0,
                    y
                ], [
                    w,
                    y
                ]);
                if (sri <= ii && ii < eri + 1) {
                    renderSelectedHeaderCell.call(this, 0, y, w, rowHeight);
                }
                draw.fillText(ii + 1, w / 2, y + rowHeight / 2);
                if (i > 0 && data.rows.isHide(i - 1)) {
                    draw.save();
                    draw.attr({ strokeStyle: '#c6c6c6' });
                    draw.line([
                        5,
                        y + 5
                    ], [
                        w - 5,
                        y + 5
                    ]);
                    draw.restore();
                }
            });
            draw.line([
                0,
                sumHeight + nty
            ], [
                w,
                sumHeight + nty
            ]);
            draw.line([
                w,
                nty
            ], [
                w,
                sumHeight + nty
            ]);
        }
        if (type === 'all' || type === 'top') {
            data.colEach(viewRange.sci, viewRange.eci, (i, x1, colWidth) => {
                const x = ntx + x1;
                const ii = i;
                draw.line([
                    x,
                    0
                ], [
                    x,
                    h
                ]);
                if (sci <= ii && ii < eci + 1) {
                    renderSelectedHeaderCell.call(this, x, 0, colWidth, h);
                }
                draw.fillText(m_alphabet.stringAt(ii), x + colWidth / 2, h / 2);
                if (i > 0 && data.cols.isHide(i - 1)) {
                    draw.save();
                    draw.attr({ strokeStyle: '#c6c6c6' });
                    draw.line([
                        x + 5,
                        5
                    ], [
                        x + 5,
                        h - 5
                    ]);
                    draw.restore();
                }
            });
            draw.line([
                sumWidth + ntx,
                0
            ], [
                sumWidth + ntx,
                h
            ]);
            draw.line([
                0,
                h
            ], [
                sumWidth + ntx,
                h
            ]);
        }
        draw.restore();
    }
    function renderFixedLeftTopCell(fw, fh) {
        const {draw} = this;
        draw.save();
        draw.attr({ fillStyle: '#f4f5f8' }).fillRect(0, 0, fw, fh);
        draw.restore();
    }
    function renderContentGrid({sri, sci, eri, eci, w, h}, fw, fh, tx, ty) {
        const {draw, data} = this;
        const {settings} = data;
        draw.save();
        draw.attr(tableGridStyle).translate(fw + tx, fh + ty);
        draw.clearRect(0, 0, w, h);
        if (!settings.showGrid) {
            draw.restore();
            return;
        }
        data.rowEach(sri, eri, (i, y, ch) => {
            if (i !== sri)
                draw.line([
                    0,
                    y
                ], [
                    w,
                    y
                ]);
            if (i === eri)
                draw.line([
                    0,
                    y + ch
                ], [
                    w,
                    y + ch
                ]);
        });
        data.colEach(sci, eci, (i, x, cw) => {
            if (i !== sci)
                draw.line([
                    x,
                    0
                ], [
                    x,
                    h
                ]);
            if (i === eci)
                draw.line([
                    x + cw,
                    0
                ], [
                    x + cw,
                    h
                ]);
        });
        draw.restore();
    }
    function renderFreezeHighlightLine(fw, fh, ftw, fth) {
        const {draw, data} = this;
        const twidth = data.viewWidth() - fw;
        const theight = data.viewHeight() - fh;
        draw.save().translate(fw, fh).attr({ strokeStyle: 'rgba(75, 137, 255, .6)' });
        draw.line([
            0,
            fth
        ], [
            twidth,
            fth
        ]);
        draw.line([
            ftw,
            0
        ], [
            ftw,
            theight
        ]);
        draw.restore();
    }
    class Table {
        constructor(el, data) {
            this.el = el;
            this.draw = new m_draw.Draw(el, data.viewWidth(), data.viewHeight());
            this.data = data;
        }
        resetData(data) {
            this.data = data;
            this.render();
        }
        render() {
            const {data} = this;
            const {rows, cols} = data;
            const fw = cols.indexWidth;
            const fh = rows.height;
            this.draw.resize(data.viewWidth(), data.viewHeight());
            this.clear();
            const viewRange = data.viewRange();
            const tx = data.freezeTotalWidth();
            const ty = data.freezeTotalHeight();
            const {x, y} = data.scroll;
            renderContentGrid.call(this, viewRange, fw, fh, tx, ty);
            renderContent.call(this, viewRange, fw, fh, -x, -y);
            renderFixedHeaders.call(this, 'all', viewRange, fw, fh, tx, ty);
            renderFixedLeftTopCell.call(this, fw, fh);
            const [fri, fci] = data.freeze;
            if (fri > 0 || fci > 0) {
                if (fri > 0) {
                    const vr = viewRange.clone();
                    vr.sri = 0;
                    vr.eri = fri - 1;
                    vr.h = ty;
                    renderContentGrid.call(this, vr, fw, fh, tx, 0);
                    renderContent.call(this, vr, fw, fh, -x, 0);
                    renderFixedHeaders.call(this, 'top', vr, fw, fh, tx, 0);
                }
                if (fci > 0) {
                    const vr = viewRange.clone();
                    vr.sci = 0;
                    vr.eci = fci - 1;
                    vr.w = tx;
                    renderContentGrid.call(this, vr, fw, fh, 0, ty);
                    renderFixedHeaders.call(this, 'left', vr, fw, fh, 0, ty);
                    renderContent.call(this, vr, fw, fh, 0, -y);
                }
                const freezeViewRange = data.freezeViewRange();
                renderContentGrid.call(this, freezeViewRange, fw, fh, 0, 0);
                renderFixedHeaders.call(this, 'all', freezeViewRange, fw, fh, 0, 0);
                renderContent.call(this, freezeViewRange, fw, fh, 0, 0);
                renderFreezeHighlightLine.call(this, fw, fh, tx, ty);
            }
        }
        clear() {
            this.draw.clear();
        }
    }
    return {
        renderCell,
        Table
    };
});