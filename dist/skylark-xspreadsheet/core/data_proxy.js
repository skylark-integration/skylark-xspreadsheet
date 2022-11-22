/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./selector","./scroll","./history","./clipboard","./auto_filter","./merge","./helper","./row","./col","./validation","./cell_range","./alphabet","../locale/locale"],function(e,t,s,i,l,r,o,n,h,a,c,g,d){"use strict";const f={mode:"edit",view:{height:()=>document.documentElement.clientHeight,width:()=>document.documentElement.clientWidth},showGrid:!0,showToolbar:!0,showContextmenu:!0,row:{len:100,height:25},col:{len:26,width:100,indexWidth:60,minWidth:60},style:{bgcolor:"#ffffff",align:"left",valign:"middle",textwrap:!1,strike:!1,underline:!1,color:"#0a0a0a",font:{name:"Arial",size:10,bold:!1,italic:!1},format:"normal"}};function u(e,t,s=(()=>{})){const{merges:i}=this,l=t.clone(),[r,o]=e.size(),[n,h]=t.size();return r>n&&(l.eri=t.sri+r-1),o>h&&(l.eci=t.sci+o-1),!i.intersects(l)||(s(d.t("error.pasteForMergedCell")),!1)}function w(e,t,s,i=!1){const{rows:l,merges:r}=this;"all"!==s&&"format"!==s||(l.deleteCells(t,s),r.deleteWithin(t)),l.copyPaste(e,t,s,i,(e,t,s)=>{if(s&&s.merge){const[i,l]=s.merge;if(i<=0&&l<=0)return;r.add(new c.CellRange(e,t,e+i,t+l))}})}function m(e,t,s){const{styles:i,rows:l}=this,r=l.getCellOrNew(e,t);let n={};void 0!==r.style&&(n=o.cloneDeep(i[r.style])),n=o.merge(n,{border:s}),r.style=this.addStyle(n)}return class{constructor(c,g){this.settings=o.merge(f,g||{}),this.name=c||"sheet",this.freeze=[0,0],this.styles=[],this.merges=new r.Merges,this.rows=new n.Rows(this.settings.row),this.cols=new h.Cols(this.settings.col),this.validations=new a.Validations,this.hyperlinks={},this.comments={},this.selector=new e,this.scroll=new t,this.history=new s,this.clipboard=new i,this.autoFilter=new l,this.change=(()=>{}),this.exceptRowSet=new Set,this.sortedRowMap=new Map,this.unsortedRowMap=new Map}addValidation(e,t,s){this.changeData(()=>{this.validations.add(e,t,s)})}removeValidation(){const{range:e}=this.selector;this.changeData(()=>{this.validations.remove(e)})}getSelectedValidator(){const{ri:e,ci:t}=this.selector,s=this.validations.get(e,t);return s?s.validator:null}getSelectedValidation(){const{ri:e,ci:t,range:s}=this.selector,i=this.validations.get(e,t),l={ref:s.toString()};return null!==i&&(l.mode=i.mode,l.validator=i.validator),l}canUndo(){return this.history.canUndo()}canRedo(){return this.history.canRedo()}undo(){this.history.undo(this.getData(),e=>{this.setData(e)})}redo(){this.history.redo(this.getData(),e=>{this.setData(e)})}copy(){this.clipboard.copy(this.selector.range)}cut(){this.clipboard.cut(this.selector.range)}paste(e="all",t=(()=>{})){const{clipboard:s,selector:i}=this;return!s.isClear()&&(!!u.call(this,s.range,i.range,t)&&(this.changeData(()=>{s.isCopy()?w.call(this,s.range,i.range,e):s.isCut()&&function(e,t){const{clipboard:s,rows:i,merges:l}=this;i.cutPaste(e,t),l.move(e,t.sri-e.sri,t.sci-e.sci),s.clear()}.call(this,s.range,i.range)}),!0))}pasteFromText(e){const t=e.split("\r\n").map(e=>e.replace(/"/g,"").split("\t"));t.length>0&&(t.length-=1);const{rows:s,selector:i}=this;this.changeData(()=>{s.paste(t,i.range)})}autofill(e,t,s=(()=>{})){const i=this.selector.range;return!!u.call(this,i,e,s)&&(this.changeData(()=>{w.call(this,i,e,t,!0)}),!0)}clearClipboard(){this.clipboard.clear()}calSelectedRangeByEnd(e,t){const{selector:s,rows:i,cols:l,merges:r}=this;let{sri:o,sci:n,eri:h,eci:a}=s.range;const g=s.ri,d=s.ci;let[f,u]=[e,t];return e<0&&(f=i.len-1),t<0&&(u=l.len-1),[o,h]=f>g?[g,f]:[f,g],[n,a]=u>d?[d,u]:[u,d],s.range=r.union(new c.CellRange(o,n,h,a)),s.range=r.union(s.range),s.range}calSelectedRangeByStart(e,t){const{selector:s,rows:i,cols:l,merges:r}=this;let o=r.getFirstIncludes(e,t);return null===o&&(o=new c.CellRange(e,t,e,t),-1===e&&(o.sri=0,o.eri=i.len-1),-1===t&&(o.sci=0,o.eci=l.len-1)),s.range=o,o}setSelectedCellAttr(e,t){this.changeData(()=>{const{selector:s,styles:i,rows:l}=this;if("merge"===e)t?this.merge():this.unmerge();else if("border"===e)(function({mode:e,style:t,color:s}){const{styles:i,selector:l,rows:r}=this,{sri:n,sci:h,eri:a,eci:c}=l.range,g=!this.isSignleSelected();if(g||"inside"!==e&&"horizontal"!==e&&"vertical"!==e)if("outside"!==e||g){if("none"===e)l.range.each((e,t)=>{const s=r.getCell(e,t);if(s&&void 0!==s.style){const e=o.cloneDeep(i[s.style]);delete e.border,s.style=this.addStyle(e)}});else if("all"===e||"inside"===e||"outside"===e||"horizontal"===e||"vertical"===e){const i=[];for(let l=n;l<=a;l+=1)for(let o=h;o<=c;o+=1){const d=[];for(let e=0;e<i.length;e+=1){const[t,s,r,n]=i[e];if(l===t+r+1&&d.push(e),t<=l&&l<=t+r&&o===s){o+=n+1;break}}if(d.forEach(e=>i.splice(e,1)),o>c)break;const f=r.getCell(l,o);let[u,w]=[0,0];f&&f.merge&&([u,w]=f.merge,i.push([l,o,u,w]));const p=u>0&&l+u===a,y=w>0&&o+w===c;let C={};"all"===e?C={bottom:[t,s],top:[t,s],left:[t,s],right:[t,s]}:"inside"===e?(!y&&o<c&&(C.right=[t,s]),!p&&l<a&&(C.bottom=[t,s])):"horizontal"===e?!p&&l<a&&(C.bottom=[t,s]):"vertical"===e?!y&&o<c&&(C.right=[t,s]):"outside"===e&&g&&(n===l&&(C.top=[t,s]),(p||a===l)&&(C.bottom=[t,s]),h===o&&(C.left=[t,s]),(y||c===o)&&(C.right=[t,s])),Object.keys(C).length>0&&m.call(this,l,o,C),o+=w}}else if("top"===e||"bottom"===e)for(let i=h;i<=c;i+=1)"top"===e&&(m.call(this,n,i,{top:[t,s]}),i+=r.getCellMerge(n,i)[1]),"bottom"===e&&(m.call(this,a,i,{bottom:[t,s]}),i+=r.getCellMerge(a,i)[1]);else if("left"===e||"right"===e)for(let i=n;i<=a;i+=1)"left"===e&&(m.call(this,i,h,{left:[t,s]}),i+=r.getCellMerge(i,h)[0]),"right"===e&&(m.call(this,i,c,{right:[t,s]}),i+=r.getCellMerge(i,c)[0])}else m.call(this,n,h,{top:[t,s],bottom:[t,s],left:[t,s],right:[t,s]})}).call(this,t);else if("formula"===e){const{ri:e,ci:i,range:r}=s;if(s.multiple()){const[i,o]=s.size(),{sri:n,sci:h,eri:a,eci:c}=r;if(i>1)for(let e=h;e<=c;e+=1){l.getCellOrNew(a+1,e).text=`=${t}(${g.xy2expr(e,n)}:${g.xy2expr(e,a)})`}else if(o>1){l.getCellOrNew(e,c+1).text=`=${t}(${g.xy2expr(h,e)}:${g.xy2expr(c,e)})`}}else{l.getCellOrNew(e,i).text=`=${t}()`}}else s.range.each((s,r)=>{const n=l.getCellOrNew(s,r);let h={};if(void 0!==n.style&&(h=o.cloneDeep(i[n.style])),"format"===e)h.format=t,n.style=this.addStyle(h);else if("font-bold"===e||"font-italic"===e||"font-name"===e||"font-size"===e){const s={};s[e.split("-")[1]]=t,h.font=Object.assign(h.font||{},s),n.style=this.addStyle(h)}else"strike"===e||"textwrap"===e||"underline"===e||"align"===e||"valign"===e||"color"===e||"bgcolor"===e?(h[e]=t,n.style=this.addStyle(h)):n[e]=t})})}setSelectedCellText(e,t="input"){const{autoFilter:s,selector:i,rows:l}=this,{ri:r,ci:o}=i;let n=r;this.unsortedRowMap.has(r)&&(n=this.unsortedRowMap.get(r));const h=l.getCell(n,o),a=h?h.text:"";if(this.setCellText(n,o,e,t),s.active()){const t=s.getFilter(o);if(t){const s=t.value.findIndex(e=>e===a);s>=0&&t.value.splice(s,1,e)}}}getSelectedCell(){const{ri:e,ci:t}=this.selector;let s=e;return this.unsortedRowMap.has(e)&&(s=this.unsortedRowMap.get(e)),this.rows.getCell(s,t)}xyInSelectedRect(e,t){const{left:s,top:i,width:l,height:r}=this.getSelectedRect(),o=e-this.cols.indexWidth,n=t-this.rows.height;return o>s&&o<s+l&&n>i&&n<i+r}getSelectedRect(){return this.getRect(this.selector.range)}getClipboardRect(){const{clipboard:e}=this;return e.isClear()?{left:-100,top:-100}:this.getRect(e.range)}getRect(e){const{scroll:t,rows:s,cols:i,exceptRowSet:l}=this,{sri:r,sci:o,eri:n,eci:h}=e;if(r<0&&o<0)return{left:0,l:0,top:0,t:0,scroll:t};const a=i.sumWidth(0,o),c=s.sumHeight(0,r,l),g=s.sumHeight(r,n+1,l),d=i.sumWidth(o,h+1);let f=a-t.x,u=c-t.y;const w=this.freezeTotalHeight(),m=this.freezeTotalWidth();return m>0&&m>a&&(f=a),w>0&&w>c&&(u=c),{l:a,t:c,left:f,top:u,height:g,width:d,scroll:t}}getCellRectByXY(e,t){const{scroll:s,merges:i,rows:l,cols:r}=this;let{ri:n,top:h,height:a}=function(e,t){const{rows:s}=this,i=this.freezeTotalHeight();let l=s.height;i+s.height<e&&(l-=t);const r=this.exceptRowSet;let o=0,n=l,{height:h}=s;for(;o<s.len&&!(n>e);o+=1)r.has(o)||(n+=h=s.getHeight(o));return(n-=h)<=0?{ri:-1,top:0,height:h}:{ri:o-1,top:n,height:h}}.call(this,t,s.y),{ci:c,left:g,width:d}=function(e,t){const{cols:s}=this,i=this.freezeTotalWidth();let l=s.indexWidth;i+s.indexWidth<e&&(l-=t);const[r,n,h]=o.rangeReduceIf(0,s.len,l,s.indexWidth,e,e=>s.getWidth(e));return n<=0?{ci:-1,left:0,width:s.indexWidth}:{ci:r-1,left:n,width:h}}.call(this,e,s.x);if(-1===c&&(d=r.totalWidth()),-1===n&&(a=l.totalHeight()),n>=0||c>=0){const e=i.getFirstIncludes(n,c);e&&(n=e.sri,c=e.sci,({left:g,top:h,width:d,height:a}=this.cellRect(n,c)))}return{ri:n,ci:c,left:g,top:h,width:d,height:a}}isSignleSelected(){const{sri:e,sci:t,eri:s,eci:i}=this.selector.range,l=this.getCell(e,t);if(l&&l.merge){const[r,o]=l.merge;if(e+r===s&&t+o===i)return!0}return!this.selector.multiple()}canUnmerge(){const{sri:e,sci:t,eri:s,eci:i}=this.selector.range,l=this.getCell(e,t);if(l&&l.merge){const[r,o]=l.merge;if(e+r===s&&t+o===i)return!0}return!1}merge(){const{selector:e,rows:t}=this;if(this.isSignleSelected())return;const[s,i]=e.size();if(s>1||i>1){const{sri:l,sci:r}=e.range;this.changeData(()=>{const o=t.getCellOrNew(l,r);o.merge=[s-1,i-1],this.merges.add(e.range),this.rows.deleteCells(e.range),this.rows.setCell(l,r,o)})}}unmerge(){const{selector:e}=this;if(!this.isSignleSelected())return;const{sri:t,sci:s}=e.range;this.changeData(()=>{this.rows.deleteCell(t,s,"merge"),this.merges.deleteWithin(e.range)})}canAutofilter(){return!this.autoFilter.active()}autofilter(){const{autoFilter:e,selector:t}=this;this.changeData(()=>{e.active()?(e.clear(),this.exceptRowSet=new Set,this.sortedRowMap=new Map,this.unsortedRowMap=new Map):e.ref=t.range.toString()})}setAutoFilter(e,t,s,i){const{autoFilter:l}=this;l.addFilter(e,s,i),l.setSort(e,t),this.resetAutoFilter()}resetAutoFilter(){const{autoFilter:e,rows:t}=this;if(!e.active())return;const{sort:s}=e,{rset:i,fset:l}=e.filteredRows((e,s)=>t.getCell(e,s)),r=Array.from(l),o=Array.from(l);s&&r.sort((e,t)=>"asc"===s.order?e-t:"desc"===s.order?t-e:0),this.exceptRowSet=i,this.sortedRowMap=new Map,this.unsortedRowMap=new Map,r.forEach((e,t)=>{this.sortedRowMap.set(o[t],e),this.unsortedRowMap.set(e,o[t])})}deleteCell(e="all"){const{selector:t}=this;this.changeData(()=>{this.rows.deleteCells(t.range,e),"all"!==e&&"format"!==e||this.merges.deleteWithin(t.range)})}insert(e,t=1){this.changeData(()=>{const{sri:s,sci:i}=this.selector.range,{rows:l,merges:r,cols:o}=this;let n=s;"row"===e?l.insert(s,t):"column"===e&&(l.insertColumn(i,t),n=i,o.len+=1),r.shift(e,n,t,(e,t,s,i)=>{const r=l.getCell(e,t);r.merge[0]+=s,r.merge[1]+=i})})}delete(e){this.changeData(()=>{const{rows:t,merges:s,selector:i,cols:l}=this,{range:r}=i,{sri:o,sci:n,eri:h,eci:a}=i.range,[c,g]=i.range.size();let d=o,f=c;"row"===e?t.delete(o,h):"column"===e&&(t.deleteColumn(n,a),d=r.sci,f=g,l.len-=1),s.shift(e,d,-f,(e,s,i,l)=>{const r=t.getCell(e,s);r.merge[0]+=i,r.merge[1]+=l,0===r.merge[0]&&0===r.merge[1]&&delete r.merge})})}scrollx(e,t){const{scroll:s,freeze:i,cols:l}=this,[,r]=i,[n,h,a]=o.rangeReduceIf(r,l.len,0,0,e,e=>l.getWidth(e));let c=h;e>0&&(c+=a),s.x!==c&&(s.ci=e>0?n:0,s.x=c,t())}scrolly(e,t){const{scroll:s,freeze:i,rows:l}=this,[r]=i,[n,h,a]=o.rangeReduceIf(r,l.len,0,0,e,e=>l.getHeight(e));let c=h;e>0&&(c+=a),s.y!==c&&(s.ri=e>0?n:0,s.y=c,t())}cellRect(e,t){const{rows:s,cols:i}=this,l=i.sumWidth(0,t),r=s.sumHeight(0,e),o=s.getCell(e,t);let n=i.getWidth(t),h=s.getHeight(e);if(null!==o&&o.merge){const[l,r]=o.merge;if(l>0)for(let t=1;t<=l;t+=1)h+=s.getHeight(e+t);if(r>0)for(let e=1;e<=r;e+=1)n+=i.getWidth(t+e)}return{left:l,top:r,width:n,height:h,cell:o}}getCell(e,t){return this.rows.getCell(e,t)}getCellTextOrDefault(e,t){const s=this.getCell(e,t);return s&&s.text?s.text:""}getCellStyle(e,t){const s=this.getCell(e,t);return s&&void 0!==s.style?this.styles[s.style]:null}getCellStyleOrDefault(e,t){const{styles:s,rows:i}=this,l=i.getCell(e,t),r=l&&void 0!==l.style?s[l.style]:{};return o.merge(this.defaultStyle(),r)}getSelectedCellStyle(){const{ri:e,ci:t}=this.selector;return this.getCellStyleOrDefault(e,t)}setCellText(e,t,s,i){const{rows:l,history:r,validations:o}=this;"finished"===i?(l.setCellText(e,t,""),r.add(this.getData()),l.setCellText(e,t,s)):(l.setCellText(e,t,s),this.change(this.getData())),o.validate(e,t,s)}freezeIsActive(){const[e,t]=this.freeze;return e>0||t>0}setFreeze(e,t){this.changeData(()=>{this.freeze=[e,t]})}freezeTotalWidth(){return this.cols.sumWidth(0,this.freeze[1])}freezeTotalHeight(){return this.rows.sumHeight(0,this.freeze[0])}setRowHeight(e,t){this.changeData(()=>{this.rows.setHeight(e,t)})}setColWidth(e,t){this.changeData(()=>{this.cols.setWidth(e,t)})}viewHeight(){const{view:e,showToolbar:t}=this.settings;let s=e.height();return s-=41,t&&(s-=41),s}viewWidth(){return this.settings.view.width()}freezeViewRange(){const[e,t]=this.freeze;return new c.CellRange(0,0,e-1,t-1,this.freezeTotalWidth(),this.freezeTotalHeight())}contentRange(){const{rows:e,cols:t}=this,[s,i]=e.maxCell(),l=e.sumHeight(0,s+1),r=t.sumWidth(0,i+1);return new c.CellRange(0,0,s,i,r,l)}exceptRowTotalHeight(e,t){const{exceptRowSet:s,rows:i}=this;let l=0;return Array.from(s).forEach(s=>{if(s<e||s>t){const e=i.getHeight(s);l+=e}}),l}viewRange(){const{scroll:e,rows:t,cols:s,freeze:i,exceptRowSet:l}=this;let{ri:r,ci:o}=e;r<=0&&([r]=i),o<=0&&([,o]=i);let[n,h]=[0,0],[a,g]=[t.len,s.len];for(let e=r;e<t.len&&(l.has(e)||(h+=t.getHeight(e),a=e),!(h>this.viewHeight()));e+=1);for(let e=o;e<s.len&&(g=e,!((n+=s.getWidth(e))>this.viewWidth()));e+=1);return new c.CellRange(r,o,a,g,n,h)}eachMergesInView(e,t){this.merges.filterIntersects(e).forEach(e=>t(e))}hideRowsOrCols(){const{rows:e,cols:t,selector:s}=this,[i,l]=s.size(),{sri:r,sci:o,eri:n,eci:h}=s.range;if(i===e.len)for(let e=o;e<=h;e+=1)t.setHide(e,!0);else if(l===t.len)for(let t=r;t<=n;t+=1)e.setHide(t,!0)}unhideRowsOrCols(e,t){this[`${e}s`].unhide(t)}rowEach(e,t,s){let i=0;const{rows:l}=this,r=this.exceptRowSet,o=[...r];let n=0;for(let t=0;t<o.length;t+=1)o[t]<e&&(n+=1);for(let o=e+n;o<=t+n;o+=1)if(r.has(o))n+=1;else{const e=l.getHeight(o);if(e>0&&(s(o,i,e),(i+=e)>this.viewHeight()))break}}colEach(e,t,s){let i=0;const{cols:l}=this;for(let r=e;r<=t;r+=1){const e=l.getWidth(r);if(e>0&&(s(r,i,e),(i+=e)>this.viewWidth()))break}}defaultStyle(){return this.settings.style}addStyle(e){const{styles:t}=this;for(let s=0;s<t.length;s+=1){const i=t[s];if(o.equals(i,e))return s}return t.push(e),t.length-1}changeData(e){this.history.add(this.getData()),e(),this.change(this.getData())}setData(e){return Object.keys(e).forEach(t=>{if("merges"===t||"rows"===t||"cols"===t||"validations"===t)this[t].setData(e[t]);else if("freeze"===t){const[s,i]=g.expr2xy(e[t]);this.freeze=[i,s]}else"autofilter"===t?this.autoFilter.setData(e[t]):void 0!==e[t]&&(this[t]=e[t])}),this}getData(){const{name:e,freeze:t,styles:s,merges:i,rows:l,cols:r,validations:o,autoFilter:n}=this;return{name:e,freeze:g.xy2expr(t[1],t[0]),styles:s,merges:i.getData(),rows:l.getData(),cols:r.getData(),validations:o.getData(),autofilter:n.getData()}}}});
//# sourceMappingURL=../sourcemaps/core/data_proxy.js.map