/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-31 21:35:39
 * @LastEditTime: 2020-08-03 23:18:15
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */
const path = require('path');
const fs = require('fs');
const { scan, traceProbe, extract } = require('../src/search.js');
const store = require('../src/store');

const { root, prefixes, endpoints, currentDepth } = store;

const { parseFullPath } = require('../src/store/endpoint.js');

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
let target = 'webpack';
// let target = 'go';
let startPath = '/Users/koyote/programming/FrontEnd/learn_gulp/vendor';

const res = traceProbe(target, startPath, store);
console.log(res.results)
console.log(res.addition.updatedPath)
// console.log(res.addition.endpoints)
console.log('-----------');
console.log(res.addition.prefixes.map((v, i) => `${i}  ${v}`))
console.log(store.prefixes.length)

// const res = [
//   {
//     matcher: '/dsf/weeeeee',
//     // matcher: 'dsf',
//     // matcher: '/wweeeee/dsf/eerrdd/',
//     prefixId: 33,
//   },
// ];
// let target = 'dsf';
// // let target = 'we';
// const newp = extract(target, res[0], []);
// console.log('-----<<<<<<<<');
// console.log(newp);
// console.log('full: ', parseFullPath(newp));

