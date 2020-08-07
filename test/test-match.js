/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-03 22:49:25
 * @LastEditTime: 2020-08-08 00:09:26
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const match = require('../src/cli/match.js');
const store = require('../src/store');

const { probe, distance } = require('../src/probe.js');
const path = require('path');
const fs = require('fs');
const { parseFullPath } = require('../src/store/endpoint.js');
// 验证 prefix
const { prefixes, endpoints } = require('../prefixtmp.json');

// const newpp = match('integration')

// console.log(store.prefixes.map((v, i) => `${i}  ${v}`));

const ul = `[{
  "prefixId": 39,
  "matcher": "5_5_10_dc_convex_hull",
  "fullPath": "/Users/koyote/programming/opencv_cpp_linux/5_5_10_dc_convex_hull"
},
{
  "prefixId": 39,
  "matcher": "5_5_4_dxc_dis",
  "fullPath": "/Users/koyote/programming/opencv_cpp_linux/5_5_4_dc_dis"
},
{
  "prefixId": 39,
  "matcher": "img",
  "fullPath": "/Users/koyote/programming/opencv_cpp_linux/img"
}]`;

// store.usualList.push(...JSON.parse(ul))
// const state = match('5_5_4_dc_dis');
// const state = match('fasttext_module');
const state = match('tmptttt');


// console.log(state.prefixes.map((v, i) => `${i}  ${v}`))


// state.endpoints.forEach((ep) => {
//   // const fullPath = path.join(prefixes[prefixId], matcher);
//   // console.log(ep);
//   const fullPath = parseFullPath(ep, state.prefixes);
//   // console.log(fullPath);
//   // console.log(distance(fullPath, store.root));

//   if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
//     logger.err(fullPath).info(ep.matcher);
//   }
// });

console.log(state.results);
console.log(state.prefixes.length);