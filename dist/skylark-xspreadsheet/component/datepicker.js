/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./calendar","./element","../config"],function(e,t,s){"use strict";return class{constructor(){this.calendar=new e(new Date),this.el=t.h("div",`${s.cssPrefix}-datepicker`).child(this.calendar.el).hide()}setValue(e){const{calendar:t}=this;return"string"==typeof e?/^\d{4}-\d{1,2}-\d{1,2}$/.test(e)&&t.setValue(new Date(e.replace(new RegExp("-","g"),"/"))):e instanceof Date&&t.setValue(e),this}change(e){this.calendar.selectChange=(t=>{e(t),this.hide()})}show(){this.el.show()}hide(){this.el.hide()}}});
//# sourceMappingURL=../sourcemaps/component/datepicker.js.map
