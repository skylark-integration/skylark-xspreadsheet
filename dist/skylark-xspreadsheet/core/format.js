/**
 * skylark-xspreadsheet - A version of xspreadsheet.js that ported to running on skylarkjs.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["../locale/locale"],function(e){"use strict";const t=e=>e,r=e=>{if(/^(-?\d*.?\d*)$/.test(e)){const t=Number(e).toFixed(2).toString(),[r,...a]=t.split("\\.");return[r.replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,"),...a]}return e},a=[{key:"normal",title:e.tf("format.normal"),type:"string",render:t},{key:"text",title:e.tf("format.text"),type:"string",render:t},{key:"number",title:e.tf("format.number"),type:"number",label:"1,000.12",render:r},{key:"percent",title:e.tf("format.percent"),type:"number",label:"10.12%",render:e=>`${e}%`},{key:"rmb",title:e.tf("format.rmb"),type:"number",label:"￥10.00",render:e=>`￥${r(e)}`},{key:"usd",title:e.tf("format.usd"),type:"number",label:"$10.00",render:e=>`$${r(e)}`},{key:"eur",title:e.tf("format.eur"),type:"number",label:"€10.00",render:e=>`€${r(e)}`},{key:"date",title:e.tf("format.date"),type:"date",label:"26/09/2008",render:t},{key:"time",title:e.tf("format.time"),type:"date",label:"15:59:00",render:t},{key:"datetime",title:e.tf("format.datetime"),type:"date",label:"26/09/2008 15:59:00",render:t},{key:"duration",title:e.tf("format.duration"),type:"date",label:"24:01:00",render:t}],l={};return a.forEach(e=>{l[e.key]=e}),{formatm:l,baseFormats:a}});
//# sourceMappingURL=../sourcemaps/core/format.js.map
