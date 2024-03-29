define(['./alphabet'], function (m_alphabet) {
    'use strict';
    class CellRange {
        constructor(sri, sci, eri, eci, w = 0, h = 0) {
            this.sri = sri;
            this.sci = sci;
            this.eri = eri;
            this.eci = eci;
            this.w = w;
            this.h = h;
        }
        set(sri, sci, eri, eci) {
            this.sri = sri;
            this.sci = sci;
            this.eri = eri;
            this.eci = eci;
        }
        multiple() {
            return this.eri - this.sri > 0 || this.eci - this.sci > 0;
        }
        includes(...args) {
            let [ri, ci] = [
                0,
                0
            ];
            if (args.length === 1) {
                [ci, ri] = m_alphabet.expr2xy(args[0]);
            } else if (args.length === 2) {
                [ri, ci] = args;
            }
            const {sri, sci, eri, eci} = this;
            return sri <= ri && ri <= eri && sci <= ci && ci <= eci;
        }
        each(cb, rowFilter = () => true) {
            const {sri, sci, eri, eci} = this;
            for (let i = sri; i <= eri; i += 1) {
                if (rowFilter(i)) {
                    for (let j = sci; j <= eci; j += 1) {
                        cb(i, j);
                    }
                }
            }
        }
        contains(other) {
            return this.sri <= other.sri && this.sci <= other.sci && this.eri >= other.eri && this.eci >= other.eci;
        }
        within(other) {
            return this.sri >= other.sri && this.sci >= other.sci && this.eri <= other.eri && this.eci <= other.eci;
        }
        disjoint(other) {
            return this.sri > other.eri || this.sci > other.eci || other.sri > this.eri || other.sci > this.eci;
        }
        intersects(other) {
            return this.sri <= other.eri && this.sci <= other.eci && other.sri <= this.eri && other.sci <= this.eci;
        }
        union(other) {
            const {sri, sci, eri, eci} = this;
            return new CellRange(other.sri < sri ? other.sri : sri, other.sci < sci ? other.sci : sci, other.eri > eri ? other.eri : eri, other.eci > eci ? other.eci : eci);
        }
        difference(other) {
            const ret = [];
            const addRet = (sri, sci, eri, eci) => {
                ret.push(new CellRange(sri, sci, eri, eci));
            };
            const {sri, sci, eri, eci} = this;
            const dsr = other.sri - sri;
            const dsc = other.sci - sci;
            const der = eri - other.eri;
            const dec = eci - other.eci;
            if (dsr > 0) {
                addRet(sri, sci, other.sri - 1, eci);
                if (der > 0) {
                    addRet(other.eri + 1, sci, eri, eci);
                    if (dsc > 0) {
                        addRet(other.sri, sci, other.eri, other.sci - 1);
                    }
                    if (dec > 0) {
                        addRet(other.sri, other.eci + 1, other.eri, eci);
                    }
                } else {
                    if (dsc > 0) {
                        addRet(other.sri, sci, eri, other.sci - 1);
                    }
                    if (dec > 0) {
                        addRet(other.sri, other.eci + 1, eri, eci);
                    }
                }
            } else if (der > 0) {
                addRet(other.eri + 1, sci, eri, eci);
                if (dsc > 0) {
                    addRet(sri, sci, other.eri, other.sci - 1);
                }
                if (dec > 0) {
                    addRet(sri, other.eci + 1, other.eri, eci);
                }
            }
            if (dsc > 0) {
                addRet(sri, sci, eri, other.sci - 1);
                if (dec > 0) {
                    addRet(sri, other.eri + 1, eri, eci);
                    if (dsr > 0) {
                        addRet(sri, other.sci, other.sri - 1, other.eci);
                    }
                    if (der > 0) {
                        addRet(other.sri + 1, other.sci, eri, other.eci);
                    }
                } else {
                    if (dsr > 0) {
                        addRet(sri, other.sci, other.sri - 1, eci);
                    }
                    if (der > 0) {
                        addRet(other.sri + 1, other.sci, eri, eci);
                    }
                }
            } else if (dec > 0) {
                addRet(eri, other.eci + 1, eri, eci);
                if (dsr > 0) {
                    addRet(sri, sci, other.sri - 1, other.eci);
                }
                if (der > 0) {
                    addRet(other.eri + 1, sci, eri, other.eci);
                }
            }
            return ret;
        }
        size() {
            return [
                this.eri - this.sri + 1,
                this.eci - this.sci + 1
            ];
        }
        toString() {
            const {sri, sci, eri, eci} = this;
            let ref = m_alphabet.xy2expr(sci, sri);
            if (this.multiple()) {
                ref = `${ ref }:${ m_alphabet.xy2expr(eci, eri) }`;
            }
            return ref;
        }
        clone() {
            const {sri, sci, eri, eci, w, h} = this;
            return new CellRange(sri, sci, eri, eci, w, h);
        }
        equals(other) {
            return this.eri === other.eri && this.eci === other.eci && this.sri === other.sri && this.sci === other.sci;
        }
        static valueOf(ref) {
            const refs = ref.split(':');
            const [sci, sri] = m_alphabet.expr2xy(refs[0]);
            let [eri, eci] = [
                sri,
                sci
            ];
            if (refs.length > 1) {
                [eci, eri] = m_alphabet.expr2xy(refs[1]);
            }
            return new CellRange(sri, sci, eri, eci);
        }
    }

    return {
        CellRange
    };
});