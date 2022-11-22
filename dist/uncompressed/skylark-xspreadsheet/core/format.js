define(['../locale/locale'], function (m_locale) {
    'use strict';
    const formatStringRender = v => v;
    const formatNumberRender = v => {
        if (/^(-?\d*.?\d*)$/.test(v)) {
            const v1 = Number(v).toFixed(2).toString();
            const [first, ...parts] = v1.split('\\.');
            return [
                first.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
                ...parts
            ];
        }
        return v;
    };
    const baseFormats = [
        {
            key: 'normal',
            title: m_locale.tf('format.normal'),
            type: 'string',
            render: formatStringRender
        },
        {
            key: 'text',
            title: m_locale.tf('format.text'),
            type: 'string',
            render: formatStringRender
        },
        {
            key: 'number',
            title: m_locale.tf('format.number'),
            type: 'number',
            label: '1,000.12',
            render: formatNumberRender
        },
        {
            key: 'percent',
            title: m_locale.tf('format.percent'),
            type: 'number',
            label: '10.12%',
            render: v => `${ v }%`
        },
        {
            key: 'rmb',
            title: m_locale.tf('format.rmb'),
            type: 'number',
            label: '\uFFE510.00',
            render: v => `￥${ formatNumberRender(v) }`
        },
        {
            key: 'usd',
            title: m_locale.tf('format.usd'),
            type: 'number',
            label: '$10.00',
            render: v => `$${ formatNumberRender(v) }`
        },
        {
            key: 'eur',
            title: m_locale.tf('format.eur'),
            type: 'number',
            label: '\u20AC10.00',
            render: v => `€${ formatNumberRender(v) }`
        },
        {
            key: 'date',
            title: m_locale.tf('format.date'),
            type: 'date',
            label: '26/09/2008',
            render: formatStringRender
        },
        {
            key: 'time',
            title: m_locale.tf('format.time'),
            type: 'date',
            label: '15:59:00',
            render: formatStringRender
        },
        {
            key: 'datetime',
            title: m_locale.tf('format.datetime'),
            type: 'date',
            label: '26/09/2008 15:59:00',
            render: formatStringRender
        },
        {
            key: 'duration',
            title: m_locale.tf('format.duration'),
            type: 'date',
            label: '24:01:00',
            render: formatStringRender
        }
    ];
    const formatm = {};
    baseFormats.forEach(f => {
        formatm[f.key] = f;
    });

    return {
        formatm,
        baseFormats
    };
});