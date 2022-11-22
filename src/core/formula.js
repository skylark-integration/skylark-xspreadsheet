define([
    '../locale/locale',
    './helper'
], function (m_locale, m_helper) {
    'use strict';
    const baseFormulas = [
        {
            key: 'SUM',
            title: m_locale.tf('formula.sum'),
            render: ary => ary.reduce((a, b) => m_helper.numberCalc('+', a, b), 0)
        },
        {
            key: 'AVERAGE',
            title: m_locale.tf('formula.average'),
            render: ary => ary.reduce((a, b) => Number(a) + Number(b), 0) / ary.length
        },
        {
            key: 'MAX',
            title: m_locale.tf('formula.max'),
            render: ary => Math.max(...ary.map(v => Number(v)))
        },
        {
            key: 'MIN',
            title: m_locale.tf('formula.min'),
            render: ary => Math.min(...ary.map(v => Number(v)))
        },
        {
            key: 'IF',
            title: m_locale.tf('formula._if'),
            render: ([b, t, f]) => b ? t : f
        },
        {
            key: 'AND',
            title: m_locale.tf('formula.and'),
            render: ary => ary.every(it => it)
        },
        {
            key: 'OR',
            title: m_locale.tf('formula.or'),
            render: ary => ary.some(it => it)
        },
        {
            key: 'CONCAT',
            title: m_locale.tf('formula.concat'),
            render: ary => ary.join('')
        }
    ];
    const formulas = baseFormulas;
    const formulam = {};
    baseFormulas.forEach(f => {
        formulam[f.key] = f;
    });
    
    return  {
        formulam,
        formulas,
        baseFormulas
    };
});