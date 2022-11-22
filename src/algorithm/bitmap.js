define(function () {
    'use strict';
    const bitmap = (v, digit, flag) => {
        const b = 1 << digit;
        return flag ? v | b : v ^ b;
    };
    return bitmap;
});