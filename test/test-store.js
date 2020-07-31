/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-29 23:27:45
 * @LastEditTime: 2020-07-31 23:20:56
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const store = require('../src/store');

store.root = '/Users/koyote/programming';
store.command = 'code';
store.setDepth(Infinity);
store.save(() => {
  console.log('<<<<<-------');
  console.log('endpoints: ', store.endpoints.length);
  console.log('prefixes: ', store.prefixes.length);
  console.log('depth: ', store.currentDepth);
});
// console.log(store);
