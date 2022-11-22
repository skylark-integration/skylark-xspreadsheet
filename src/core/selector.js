define([
    './cell_range'
], function (m_cell_range) {
    'use strict';
    class Selector {
        constructor() {
            this.range = new m_cell_range.CellRange(0, 0, 0, 0);
            this.ri = 0;
            this.ci = 0;
        }
        multiple() {
            return this.range.multiple();
        }
        setIndexes(ri, ci) {
            this.ri = ri;
            this.ci = ci;
        }
        size() {
            return this.range.size();
        }
    }

    return Selector;
});