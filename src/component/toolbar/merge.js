define(['./toggle_item'], function (ToggleItem) {
    'use strict';
    return class Merge extends ToggleItem {
        constructor() {
            super('merge');
        }
        setState(active, disabled) {
            this.el.active(active).disabled(disabled);
        }
    };
});