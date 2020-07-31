/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-29 23:23:33
 * @LastEditTime: 2020-07-31 23:13:41
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const { probe, distance } = require('../src/probe.js');
const path = require('path');
const fs = require('fs');
const store = require('../src/store');
// 验证 prefix
const { prefixes, endpoints } = require('../prefixtmp.json');

// endpoints.forEach(({ prefixId, matcher }) => {
//   const fullPath = path.join(prefixes[prefixId], matcher);
//   // console.log(fullPath);
//   console.log(distance(fullPath, store.root));

//   if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
//     logger.err(fullPath).info(matcher);
//   }
// });

let d = distance('/Users/koyote/programming/FrontEnd', '/Users/koyote/programming');
console.log('dddd: ', d);



