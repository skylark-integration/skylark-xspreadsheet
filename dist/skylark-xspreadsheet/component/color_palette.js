/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","../config"],function(c,e){"use strict";const f=["#ffffff","#000100","#e7e5e6","#445569","#5b9cd6","#ed7d31","#a5a5a5","#ffc001","#4371c6","#71ae47"],d=[["#f2f2f2","#7f7f7f","#d0cecf","#d5dce4","#deeaf6","#fce5d5","#ededed","#fff2cd","#d9e2f3","#e3efd9"],["#d8d8d8","#595959","#afabac","#adb8ca","#bdd7ee","#f7ccac","#dbdbdb","#ffe59a","#b3c6e7","#c5e0b3"],["#bfbfbf","#3f3f3f","#756f6f","#8596b0","#9cc2e6","#f4b184","#c9c9c9","#fed964","#8eaada","#a7d08c"],["#a5a5a5","#262626","#3a3839","#333f4f","#2e75b5","#c45a10","#7b7b7b","#bf8e01","#2f5596","#538136"],["#7f7f7f","#0c0c0c","#171516","#222a35","#1f4e7a","#843c0a","#525252","#7e6000","#203864","#365624"]],a=["#c00000","#fe0000","#fdc101","#ffff01","#93d051","#00b04e","#01b0f1","#0170c1","#012060","#7030a0"];function t(f){return c.h("td","").child(c.h("div",`${e.cssPrefix}-color-palette-cell`).on("click.stop",()=>this.change(f)).css("background-color",f))}return class{constructor(){this.el=c.h("div",`${e.cssPrefix}-color-palette`),this.change=(()=>{});const l=c.h("table","").children(c.h("tbody","").children(c.h("tr",`${e.cssPrefix}-theme-color-placeholders`).children(...f.map(c=>t.call(this,c))),...d.map(f=>c.h("tr",`${e.cssPrefix}-theme-colors`).children(...f.map(c=>t.call(this,c)))),c.h("tr",`${e.cssPrefix}-standard-colors`).children(...a.map(c=>t.call(this,c)))));this.el.child(l)}}});
//# sourceMappingURL=../sourcemaps/component/color_palette.js.map
