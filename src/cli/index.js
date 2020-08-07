/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-04 23:10:29
 * @LastEditTime: 2020-08-07 23:52:12
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const { fire } = require('./command.js');
const match = require('./match.js');
const store = require('../store');
const { extract } = require('../search.js');
const { parseFullPath } = require('../store/endpoint.js');
const logger = require('../util/log.js');

function storeCommand(cmd) {
  store.command = cmd;
}

function storeRootPath(root) {
  store.root = root;
}

function searchHandler(target) {
  const newState = match(target);
  const results = newState.results;
  if (newState.inUsual) {
    // 从 ul 匹配的 直接 fire
    console.log('rrr>>>> ', results);
    const targetPath = parseFullPath(results[0]);
    fire(targetPath); // TODO
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
    fire(parseFullPath(toUsual));
  } else {
    // 没有结果
    // 也存一下
    
    logger
      .err('Failed to find!')
      .info('Please give me a more precise name.')
      .exit();
  }
}

module.exports = {
  searchHandler,
  storeCommand,
  storeRootPath,
};
