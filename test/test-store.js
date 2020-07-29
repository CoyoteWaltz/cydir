/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-29 23:27:45
 * @LastEditTime: 2020-07-29 23:38:30
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const store = require('../src/store.js');

// store.root = '/Users/koyote/programming';
// store.command = 'code';
store.setDepth(Infinity);
store.save(() => {
  console.log('<<<<<-------');
  console.log('endPoints: ', store.endPoints.length);
  console.log('prefixes: ', store.prefixes.length);
  console.log('depth: ', store.currentDepth);
});
// console.log(store);
