/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./element","./event","./resizer","./scrollbar","./selector","./editor","./print","./contextmenu","./table","./toolbar/index","./modal_validation","./sort_filter","./message","../config","../core/formula"],function(t,e,l,i,s,a,o,r,c,h,n,d,f,u,g){"use strict";function b(t,e){let l;return(...i)=>{const s=this,a=i;l||(l=setTimeout(()=>{l=null,t.apply(s,a)},e))}}function w(t,e,l,i=!0,s=!1){if(-1===e&&-1===l)return;const{table:a,selector:o,toolbar:r,data:c,contextMenu:h}=this;h.setMode(-1===e||-1===l?"row-col":"range");const n=c.getCell(e,l);t?(o.setEnd(e,l,s),this.trigger("cells-selected",n,o.range)):(o.set(e,l,i),this.trigger("cell-selected",n,e,l)),r.reset(),a.render()}function p(t,e){const{selector:l,data:i}=this,{rows:s,cols:a}=i;let[o,r]=l.indexes;const{eri:c,eci:h}=l.range;t&&([o,r]=l.moveIndexes),"left"===e?r>0&&(r-=1):"right"===e?(h!==r&&(r=h),r<a.len-1&&(r+=1)):"up"===e?o>0&&(o-=1):"down"===e?(c!==o&&(o=c),o<s.len-1&&(o+=1)):"row-first"===e?r=0:"row-last"===e?r=a.len-1:"col-first"===e?o=0:"col-last"===e&&(o=s.len-1),t&&(l.moveIndexes=[o,r]),w.call(this,t,o,r),function(){const{data:t,verticalScrollbar:e,horizontalScrollbar:l}=this,{l:i,t:s,left:a,top:o,width:r,height:c}=t.getSelectedRect(),h=this.getTableOffset();if(Math.abs(a)+r>h.width)l.move({left:i+r-h.width});else{const e=t.freezeTotalWidth();a<e&&l.move({left:i-1-e})}if(Math.abs(o)+c>h.height)e.move({top:s+c-h.height-1});else{const l=t.freezeTotalHeight();o<l&&e.move({top:s-1-l})}}.call(this)}function v(){const{data:t,verticalScrollbar:e}=this,{height:l}=this.getTableOffset(),i=t.exceptRowTotalHeight(0,-1);e.set(l,t.rows.totalHeight()-i)}function m(){const{data:t,horizontalScrollbar:e}=this,{width:l}=this.getTableOffset();t&&e.set(l,t.cols.totalWidth())}function x(){const{tableEl:t,overlayerEl:e,overlayerCEl:l,table:i,toolbar:s,selector:a,el:o}=this,r=this.getTableOffset(),c=this.getRect();t.attr(c),e.offset(c),l.offset(r),o.css("width",`${c.width}px`),v.call(this),m.call(this),function(){const{selector:t,data:e,editor:l}=this,[i,s]=e.freeze;if(i>0||s>0){const t=e.freezeTotalWidth(),i=e.freezeTotalHeight();l.setFreezeLengths(t,i)}t.resetAreaOffset()}.call(this),i.render(),s.reset(),a.reset()}function k(){const{data:t,selector:e}=this;t.clearClipboard(),e.hideClipboard()}function z(){const{data:t,selector:e}=this;t.copy(),e.showClipboard()}function C(){const{data:t,selector:e}=this;t.cut(),e.showClipboard()}function D(t,e){const{data:l}=this;if("read"!==l.settings.mode)if(l.paste(t,t=>f.xtoast("Tip",t)))x.call(this);else if(e){const t=e.clipboardData.getData("text/plain");this.data.pasteFromText(t),x.call(this)}}function y(t,e){this.data.unhideRowsOrCols(t,e),x.call(this)}function S(t){const{selector:l,data:i,table:s,sortFilter:a}=this,{offsetX:o,offsetY:r}=t,c=t.target.className===`${u.cssPrefix}-selector-corner`,h=i.getCellRectByXY(o,r),{left:n,top:d,width:g,height:b}=h;let{ri:p,ci:v}=h;const{autoFilter:m}=i;if(m.includes(p,v)&&n+g-20<o&&d+b-20<r){const t=m.items(v,(t,e)=>i.rows.getCell(t,e));return a.hide(),a.set(v,t,m.getFilter(v),m.getSort(v)),void a.setOffset({left:n,top:d+b+2})}t.shiftKey||(c?l.showAutofill(p,v):w.call(this,!1,p,v),e.mouseMoveUp(window,t=>{({ri:p,ci:v}=i.getCellRectByXY(t.offsetX,t.offsetY)),c?l.showAutofill(p,v):1!==t.buttons||t.shiftKey||w.call(this,!0,p,v,!0,!0)},()=>{c&&l.arange&&"read"!==i.settings.mode&&i.autofill(l.arange,"all",t=>f.xtoast("Tip",t))&&s.render(),l.hideAutofill(),function(){const{toolbar:t}=this;t.paintformatActive()&&(D.call(this,"format"),k.call(this),t.paintformatToggle())}.call(this)})),c||1!==t.buttons||t.shiftKey&&w.call(this,!0,p,v)}function R(){const{editor:t,data:e}=this,l=e.getSelectedRect(),i=this.getTableOffset();let s="top";l.top>i.height/2&&(s="bottom"),t.setOffset(l,s)}function T(){const{editor:t,data:e}=this;"read"!==e.settings.mode&&(R.call(this),t.setCell(e.getSelectedCell(),e.getSelectedValidator()),k.call(this))}function F(t,e="finished"){const{data:l,table:i}=this;if("read"===l.settings.mode)return;l.setSelectedCellText(t,e);const{ri:s,ci:a}=l.selector;"finished"===e?i.render():this.trigger("cell-edited",t,s,a)}function A(t){const{data:e}=this;"read"!==e.settings.mode&&("insert-row"===t?e.insert("row"):"delete-row"===t?e.delete("row"):"insert-column"===t?e.insert("column"):"delete-column"===t?e.delete("column"):"delete-cell"===t?e.deleteCell():"delete-cell-format"===t?e.deleteCell("format"):"delete-cell-text"===t?e.deleteCell("text"):"cell-printable"===t?e.setSelectedCellAttr("printable",!0):"cell-non-printable"===t?e.setSelectedCellAttr("printable",!1):"cell-editable"===t?e.setSelectedCellAttr("editable",!0):"cell-non-editable"===t&&e.setSelectedCellAttr("editable",!1),k.call(this),x.call(this))}function O(t,e){const{data:l}=this;if("undo"===t)this.undo();else if("redo"===t)this.redo();else if("print"===t)this.print.preview();else if("paintformat"===t)!0===e?z.call(this):k.call(this);else if("clearformat"===t)A.call(this,"delete-cell-format");else if("link"===t);else if("chart"===t);else if("autofilter"===t)(function(){const{data:t}=this;t.autofilter(),x.call(this)}).call(this);else if("freeze"===t)if(e){const{ri:t,ci:e}=l.selector;this.freeze(t,e)}else this.freeze(0,0);else l.setSelectedCellAttr(t,e),"formula"!==t||l.selector.multiple()||T.call(this),x.call(this)}function M(){const{selector:t,overlayerEl:l,rowResizer:i,colResizer:s,verticalScrollbar:a,horizontalScrollbar:o,editor:r,contextMenu:c,toolbar:h,modalValidation:n,sortFilter:d}=this;l.on("mousemove",t=>{(function(t){if(0!==t.buttons)return;if(t.target.className===`${u.cssPrefix}-resizer-hover`)return;const{offsetX:e,offsetY:l}=t,{rowResizer:i,colResizer:s,tableEl:a,data:o}=this,{rows:r,cols:c}=o;if(e>c.indexWidth&&l>r.height)return i.hide(),void s.hide();const h=a.box(),n=o.getCellRectByXY(t.offsetX,t.offsetY);n.ri>=0&&-1===n.ci?(n.width=c.indexWidth,i.show(n,{width:h.width}),r.isHide(n.ri-1)?i.showUnhide(n.ri):i.hideUnhide()):i.hide(),-1===n.ri&&n.ci>=0?(n.height=r.height,s.show(n,{height:h.height}),c.isHide(n.ci-1)?s.showUnhide(n.ci):s.hideUnhide()):s.hide()}).call(this,t)}).on("mousedown",t=>{r.clear(),c.hide(),2===t.buttons?(this.data.xyInSelectedRect(t.offsetX,t.offsetY)?c.setPosition(t.offsetX,t.offsetY):(S.call(this,t),c.setPosition(t.offsetX,t.offsetY)),t.stopPropagation()):2===t.detail?T.call(this):S.call(this,t)}).on("mousewheel.stop",t=>{(function(t){const{verticalScrollbar:e,horizontalScrollbar:l,data:i}=this,{top:s}=e.scroll(),{left:a}=l.scroll(),{rows:o,cols:r}=i,{deltaY:c,deltaX:h}=t,n=(t,e)=>{let l=t,i=0;do{i=e(l),l+=1}while(i<=0);return i},d=t=>{if(t>0){const t=i.scroll.ri+1;if(t<o.len){const l=n(t,t=>o.getHeight(t));e.move({top:s+l-1})}}else{const t=i.scroll.ri-1;if(t>=0){const l=n(t,t=>o.getHeight(t));e.move({top:0===t?0:s-l})}}},f=Math.abs(c),u=Math.abs(h),g=Math.max(f,u);/Firefox/i.test(window.navigator.userAgent)&&b(d(t.detail),50),g===u&&b((t=>{if(t>0){const t=i.scroll.ci+1;if(t<r.len){const e=n(t,t=>r.getWidth(t));l.move({left:a+e-1})}}else{const t=i.scroll.ci-1;if(t>=0){const e=n(t,t=>r.getWidth(t));l.move({left:0===t?0:a-e})}}})(h),50),g===f&&b(d(c),50)}).call(this,t)}).on("mouseout",t=>{const{offsetX:e,offsetY:l}=t;l<=0&&s.hide(),e<=0&&i.hide()}),t.inputChange=(t=>{F.call(this,t,"input"),T.call(this)}),e.bindTouch(l.el,{move:(t,e)=>{(function(t,e){const{verticalScrollbar:l,horizontalScrollbar:i}=this,{top:s}=l.scroll(),{left:a}=i.scroll();"left"===t||"right"===t?i.move({left:a-e}):"up"!==t&&"down"!==t||l.move({top:s-e})}).call(this,t,e)}}),h.change=((t,e)=>O.call(this,t,e)),d.ok=((t,e,l,i)=>(function(t,e,l,i){this.data.setAutoFilter(t,e,l,i),x.call(this)}).call(this,t,e,l,i)),i.finishedFn=((t,e)=>{(function(t,e){const{ri:l}=t,{table:i,selector:s,data:a}=this;a.rows.setHeight(l,e),i.render(),s.resetAreaOffset(),v.call(this),R.call(this)}).call(this,t,e)}),s.finishedFn=((t,e)=>{(function(t,e){const{ci:l}=t,{table:i,selector:s,data:a}=this;a.cols.setWidth(l,e),i.render(),s.resetAreaOffset(),m.call(this),R.call(this)}).call(this,t,e)}),i.unhideFn=(t=>{y.call(this,"row",t)}),s.unhideFn=(t=>{y.call(this,"col",t)}),a.moveFn=((t,e)=>{(function(t){const{data:e,table:l,selector:i}=this;e.scrolly(t,()=>{i.resetBRLAreaOffset(),R.call(this),l.render()})}).call(this,t,e)}),o.moveFn=((t,e)=>{(function(t){const{data:e,table:l,selector:i}=this;e.scrollx(t,()=>{i.resetBRTAreaOffset(),R.call(this),l.render()})}).call(this,t,e)}),r.change=((t,e)=>{F.call(this,e,t)}),n.change=((t,...e)=>{"save"===t?this.data.addValidation(...e):this.data.removeValidation()}),c.itemClick=(t=>{"validation"===t?n.setValue(this.data.getSelectedValidation()):"copy"===t?z.call(this):"cut"===t?C.call(this):"paste"===t?D.call(this,"all"):"paste-value"===t?D.call(this,"text"):"paste-format"===t?D.call(this,"format"):"hide"===t?function(){this.data.hideRowsOrCols(),x.call(this)}.call(this):A.call(this,t)}),e.bind(window,"resize",()=>{this.reload()}),e.bind(window,"click",t=>{this.focusing=l.contains(t.target)}),e.bind(window,"paste",t=>{D.call(this,"all",t),t.preventDefault()}),e.bind(window,"keydown",t=>{if(!this.focusing)return;const e=t.keyCode||t.which,{key:l,ctrlKey:i,shiftKey:s,metaKey:a}=t;if(i||a)switch(e){case 90:this.undo(),t.preventDefault();break;case 89:this.redo(),t.preventDefault();break;case 67:z.call(this),t.preventDefault();break;case 88:C.call(this),t.preventDefault();break;case 85:h.trigger("underline"),t.preventDefault();break;case 86:break;case 37:p.call(this,s,"row-first"),t.preventDefault();break;case 38:p.call(this,s,"col-first"),t.preventDefault();break;case 39:p.call(this,s,"row-last"),t.preventDefault();break;case 40:p.call(this,s,"col-last"),t.preventDefault();break;case 32:w.call(this,!1,-1,this.data.selector.ci,!1),t.preventDefault();break;case 66:h.trigger("bold");break;case 73:h.trigger("italic")}else{switch(e){case 32:s&&w.call(this,!1,this.data.selector.ri,-1,!1);break;case 27:c.hide(),k.call(this);break;case 37:p.call(this,s,"left"),t.preventDefault();break;case 38:p.call(this,s,"up"),t.preventDefault();break;case 39:p.call(this,s,"right"),t.preventDefault();break;case 40:p.call(this,s,"down"),t.preventDefault();break;case 9:r.clear(),p.call(this,!1,s?"left":"right"),t.preventDefault();break;case 13:r.clear(),p.call(this,!1,s?"up":"down"),t.preventDefault();break;case 8:A.call(this,"delete-cell-text"),t.preventDefault()}"Delete"===l?(A.call(this,"delete-cell-text"),t.preventDefault()):e>=65&&e<=90||e>=48&&e<=57||e>=96&&e<=105||"="===t.key?(F.call(this,t.key,"input"),T.call(this)):113===e&&T.call(this)}})}return class{constructor(e,f){this.eventMap=new Map;const{view:b,showToolbar:p,showContextmenu:v}=f.settings;this.el=t.h("div",`${u.cssPrefix}-sheet`),this.toolbar=new h(f,b.width,!p),this.print=new o(f),e.children(this.toolbar.el,this.el,this.print.el),this.data=f,this.tableEl=t.h("canvas",`${u.cssPrefix}-table`),this.rowResizer=new l(!1,f.rows.height),this.colResizer=new l(!0,f.cols.minWidth),this.verticalScrollbar=new i(!0),this.horizontalScrollbar=new i(!1),this.editor=new a(g.formulas,()=>this.getTableOffset(),f.rows.height),this.modalValidation=new n,this.contextMenu=new r(()=>this.getRect(),!v),this.selector=new s(f),this.overlayerCEl=t.h("div",`${u.cssPrefix}-overlayer-content`).children(this.editor.el,this.selector.el),this.overlayerEl=t.h("div",`${u.cssPrefix}-overlayer`).child(this.overlayerCEl),this.sortFilter=new d,this.el.children(this.tableEl,this.overlayerEl.el,this.rowResizer.el,this.colResizer.el,this.verticalScrollbar.el,this.horizontalScrollbar.el,this.contextMenu.el,this.modalValidation.el,this.sortFilter.el),this.table=new c.Table(this.tableEl.el,f),M.call(this),x.call(this),w.call(this,!1,0,0)}on(t,e){return this.eventMap.set(t,e),this}trigger(t,...e){const{eventMap:l}=this;l.has(t)&&l.get(t).call(this,...e)}resetData(t){this.editor.clear(),this.data=t,v.call(this),m.call(this),this.toolbar.resetData(t),this.print.resetData(t),this.selector.resetData(t),this.table.resetData(t)}loadData(t){return this.data.setData(t),x.call(this),this}freeze(t,e){const{data:l}=this;return l.setFreeze(t,e),x.call(this),this}undo(){this.data.undo(),x.call(this)}redo(){this.data.redo(),x.call(this)}reload(){return x.call(this),this}getRect(){const{data:t}=this;return{width:t.viewWidth(),height:t.viewHeight()}}getTableOffset(){const{rows:t,cols:e}=this.data,{width:l,height:i}=this.getRect();return{width:l-e.indexWidth,height:i-t.height,left:e.indexWidth,top:t.height}}}});
//# sourceMappingURL=../sourcemaps/component/sheet.js.map