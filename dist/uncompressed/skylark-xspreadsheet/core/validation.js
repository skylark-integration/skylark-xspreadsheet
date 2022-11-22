define([
    './validator',
    './cell_range'
], function (Validator, m_cell_range) {
    'use strict';
    class Validation {
        constructor(mode, refs, validator) {
            this.refs = refs;
            this.mode = mode;
            this.validator = validator;
        }
        includes(ri, ci) {
            const {refs} = this;
            for (let i = 0; i < refs.length; i += 1) {
                const cr = m_cell_range.CellRange.valueOf(refs[i]);
                if (cr.includes(ri, ci))
                    return true;
            }
            return false;
        }
        addRef(ref) {
            this.remove(m_cell_range.CellRange.valueOf(ref));
            this.refs.push(ref);
        }
        remove(cellRange) {
            const nrefs = [];
            this.refs.forEach(it => {
                const cr = m_cell_range.CellRange.valueOf(it);
                if (cr.intersects(cellRange)) {
                    const crs = cr.difference(cellRange);
                    crs.forEach(it1 => nrefs.push(it1.toString()));
                } else {
                    nrefs.push(it);
                }
            });
            this.refs = nrefs;
        }
        getData() {
            const {refs, mode, validator} = this;
            const {type, required, operator, value} = validator;
            return {
                refs,
                mode,
                type,
                required,
                operator,
                value
            };
        }
        static valueOf({refs, mode, type, required, operator, value}) {
            return new Validation(mode, refs, new Validator(type, required, value, operator));
        }
    }
    class Validations {
        constructor() {
            this._ = [];
            this.errors = new Map();
        }
        getError(ri, ci) {
            return this.errors.get(`${ ri }_${ ci }`);
        }
        validate(ri, ci, text) {
            const v = this.get(ri, ci);
            const key = `${ ri }_${ ci }`;
            const {errors} = this;
            if (v !== null) {
                const [flag, message] = v.validator.validate(text);
                if (!flag) {
                    errors.set(key, message);
                } else {
                    errors.delete(key);
                }
            } else {
                errors.delete(key);
            }
            return true;
        }
        add(mode, ref, {type, required, value, operator}) {
            const validator = new Validator(type, required, value, operator);
            const v = this.getByValidator(validator);
            if (v !== null) {
                v.addRef(ref);
            } else {
                this._.push(new Validation(mode, [ref], validator));
            }
        }
        getByValidator(validator) {
            for (let i = 0; i < this._.length; i += 1) {
                const v = this._[i];
                if (v.validator.equals(validator)) {
                    return v;
                }
            }
            return null;
        }
        get(ri, ci) {
            for (let i = 0; i < this._.length; i += 1) {
                const v = this._[i];
                if (v.includes(ri, ci))
                    return v;
            }
            return null;
        }
        remove(cellRange) {
            this.each(it => {
                it.remove(cellRange);
            });
        }
        each(cb) {
            this._.forEach(it => cb(it));
        }
        getData() {
            return this._.filter(it => it.refs.length > 0).map(it => it.getData());
        }
        setData(d) {
            this._ = d.map(it => Validation.valueOf(it));
        }
    }
    return {
        Validations
    };
});