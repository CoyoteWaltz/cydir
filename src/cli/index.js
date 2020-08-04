/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-04 23:10:29
 * @LastEditTime: 2020-08-05 00:08:09
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const match = require('./match.js');
const store = require('../store');
const { extract } = require('../search.js');

function searchHandler(target) {
  const newState = match(target);
  const results = newState.results;
  if (newState.inUsual) {
    // 从 ul 匹配的 直接 fire
    // fire(results); // TODO
  } else if (results.length) {
    // 有匹配结果
    // 多结果的提示
    // 移入 ul
    const first = results[0];
    const toUsual = extract(target, first);
    store.usualList.push(toUsual);
    if (toUsual.matcher === first.matcher) {
      //
      console.log('>>>> first', first, toUsual);
      newState.newEndpoints = newState.newEndpoints.filter(
        (v) => v.matcher !== first.matcher
      );
    }
    if (newState.updatePath) {
      // 如果 trace 了 替换
      if (newState.updatePath !== store.root) {
        // 必须判断是否为 root 不然会多留一个
        console.log('update path! ', newState);
        const removePrefixIds = store.prefixes
          .map((v, i) => {
            if (v.startsWith(newState.updatePath)) {
              return i;
            }
            return -1;
          })
          .filter((v) => v >= 0);
        console.log('removed prefix! ', removePrefixIds);
        console.log('---------');
        store.endpoints = store.endpoints.filter(
          (ep) => !removePrefixIds.includes(ep.prefixId)
        );

        store.endpoints.push(...newState.newEndpoints);
      } else {
        store.endpoints = newState.newEndpoints;
      }
      store.prefixes = newState.newPrefixes;
    }
  }
}

module.exports = {
  searchHandler,
};
