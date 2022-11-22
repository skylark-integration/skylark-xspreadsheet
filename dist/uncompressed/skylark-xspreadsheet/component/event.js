define(function () {
    'use strict';
    function bind(target, name, fn) {
        target.addEventListener(name, fn);
    }
    function unbind(target, name, fn) {
        target.removeEventListener(name, fn);
    }
    function unbindClickoutside(el) {
        if (el.xclickoutside) {
            unbind(window.document.body, 'click', el.xclickoutside);
            delete el.xclickoutside;
        }
    }
    function bindClickoutside(el, cb) {
        el.xclickoutside = evt => {
            if (evt.detail === 2 || el.contains(evt.target))
                return;
            if (cb)
                cb(el);
            else {
                el.hide();
                unbindClickoutside(el);
            }
        };
        bind(window.document.body, 'click', el.xclickoutside);
    }
    function mouseMoveUp(target, movefunc, upfunc) {
        bind(target, 'mousemove', movefunc);
        const t = target;
        t.xEvtUp = evt => {
            unbind(target, 'mousemove', movefunc);
            unbind(target, 'mouseup', target.xEvtUp);
            upfunc(evt);
        };
        bind(target, 'mouseup', target.xEvtUp);
    }
    function calTouchDirection(spanx, spany, evt, cb) {
        let direction = '';
        if (Math.abs(spanx) > Math.abs(spany)) {
            direction = spanx > 0 ? 'right' : 'left';
            cb(direction, spanx, evt);
        } else {
            direction = spany > 0 ? 'down' : 'up';
            cb(direction, spany, evt);
        }
    }
    function bindTouch(target, {move, end}) {
        let startx = 0;
        let starty = 0;
        bind(target, 'touchstart', evt => {
            const {pageX, pageY} = evt.touches[0];
            startx = pageX;
            starty = pageY;
        });
        bind(target, 'touchmove', evt => {
            if (!move)
                return;
            const {pageX, pageY} = evt.changedTouches[0];
            const spanx = pageX - startx;
            const spany = pageY - starty;
            if (Math.abs(spanx) > 10 || Math.abs(spany) > 10) {
                calTouchDirection(spanx, spany, evt, move);
                startx = pageX;
                starty = pageY;
            }
            evt.preventDefault();
        });
        bind(target, 'touchend', evt => {
            if (!end)
                return;
            const {pageX, pageY} = evt.changedTouches[0];
            const spanx = pageX - startx;
            const spany = pageY - starty;
            calTouchDirection(spanx, spany, evt, end);
        });
    }
    return {
        bind: bind,
        unbind: unbind,
        unbindClickoutside: unbindClickoutside,
        bindClickoutside: bindClickoutside,
        mouseMoveUp: mouseMoveUp,
        bindTouch: bindTouch
    };
});