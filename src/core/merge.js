define(['./cell_range'], function (m_cell_range) {
    'use strict';
    class Merges {
        constructor(d = []) {
            this._ = d;
        }
        forEach(cb) {
            this._.forEach(cb);
        }
        deleteWithin(cr) {
            this._ = this._.filter(it => !it.within(cr));
        }
        getFirstIncludes(ri, ci) {
            for (let i = 0; i < this._.length; i += 1) {
                const it = this._[i];
                if (it.includes(ri, ci)) {
                    return it;
                }
            }
            return null;
        }
        filterIntersects(cellRange) {
            return new Merges(this._.filter(it => it.intersects(cellRange)));
        }
        intersects(cellRange) {
            for (let i = 0; i < this._.length; i += 1) {
                const it = this._[i];
                if (it.intersects(cellRange)) {
                    return true;
                }
            }
            return false;
        }
        union(cellRange) {
            let cr = cellRange;
            this._.forEach(it => {
                if (it.intersects(cr)) {
                    cr = it.union(cr);
                }
            });
            return cr;
        }
        add(cr) {
            this.deleteWithin(cr);
            this._.push(cr);
        }
        shift(type, index, n, cbWithin) {
            this._.forEach(cellRange => {
                const {sri, sci, eri, eci} = cellRange;
                const range = cellRange;
                if (type === 'row') {
                    if (sri >= index) {
                        range.sri += n;
                        range.eri += n;
                    } else if (sri < index && index <= eri) {
                        range.eri += n;
                        cbWithin(sri, sci, n, 0);
                    }
                } else if (type === 'column') {
                    if (sci >= index) {
                        range.sci += n;
                        range.eci += n;
                    } else if (sci < index && index <= eci) {
                        range.eci += n;
                        cbWithin(sri, sci, 0, n);
                    }
                }
            });
        }
        move(cellRange, rn, cn) {
            this._.forEach(it1 => {
                const it = it1;
                if (it.within(cellRange)) {
                    it.eri += rn;
                    it.sri += rn;
                    it.sci += cn;
                    it.eci += cn;
                }
            });
        }
        setData(merges) {
            this._ = merges.map(merge => m_cell_range.CellRange.valueOf(merge));
            return this;
        }
        getData() {
            return this._.map(merge => merge.toString());
        }
    }
    return {
        Merges
    };
});