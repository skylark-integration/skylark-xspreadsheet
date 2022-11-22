/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","../config","../locale/locale"],function(t,i,e){"use strict";const s={number:/(^\d+$)|(^\d+(\.\d{0,4})?$)/,date:/^\d{4}-\d{1,2}-\d{1,2}$/};return class{constructor(e,s,l,r){this.label="",this.rule=s,l&&(this.label=t.h("label","label").css("width",`${r}px`).html(l)),this.tip=t.h("div","tip").child("tip").hide(),this.input=e,this.input.vchange=(()=>this.validate()),this.el=t.h("div",`${i.cssPrefix}-form-field`).children(this.label,e.el,this.tip)}isShow(){return"none"!==this.el.css("display")}show(){this.el.show()}hide(){return this.el.hide(),this}val(t){return this.input.val(t)}hint(t){this.input.hint(t)}validate(){const{input:t,rule:i,tip:l,el:r}=this,h=t.val();if(i.required&&/^\s*$/.test(h))return l.html(e.t("validation.required")),r.addClass("error"),!1;if(i.type||i.pattern){if(!(i.pattern||s[i.type]).test(h))return l.html(e.t("validation.notMatch")),r.addClass("error"),!1}return r.removeClass("error"),!0}}});
//# sourceMappingURL=../sourcemaps/component/form_field.js.map
