/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-31 21:35:39
 * @LastEditTime: 2020-07-31 23:20:29
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */
const path = require('path');
const fs = require('fs');
const { scan, traceProbe } = require('../src/search.js');
const store = require('../src/store');


const { root, prefixes, endpoints, currentDepth } = store;

// const res = scan(target, endpoints);
// console.log(
//   '-------',
//   res.map((v) => {
//     return {
//       prefix: prefixes[v.prefixId],
//       // full: path.resolve(prefixes[v.prefixId], v.matcher),
//       exists: fs.existsSync(path.resolve(prefixes[v.prefixId], v.matcher)),
//       ...v,
//     };
//   })
// );
// let target = 'minip';
let target = 'shell';
let startPath = '/Users/koyote/programming/FrontEnd/learn_gulp';

const res = traceProbe(target, startPath, root, currentDepth);
console.log(res.results)
console.log(res.addition.updatedPath)

