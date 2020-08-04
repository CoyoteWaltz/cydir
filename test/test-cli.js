/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-04 23:27:47
 * @LastEditTime: 2020-08-05 00:14:03
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const fs = require('fs');
const { toJSON } = require('../src/util/chores');

const cli = require('../src/cli');
const store = require('../src/store');
cli.searchHandler('tp131');

console.log(store.usualList);


// fs.writeFileSync('./test-cli.json', toJSON(store))
fs.writeFileSync('./test-cli.json', JSON.stringify(store, null, 2))