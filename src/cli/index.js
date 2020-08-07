/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-04 23:10:29
 * @LastEditTime: 2020-08-08 00:40:16
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
  let targetEndpoint;
  const newState = match(target);
  const results = newState.results;
  if (newState.inUsual) {
    // 从 ul 匹配的 直接 fire
    console.log('rrr>>>> ', results);
    targetEndpoint = results[0];
  } else if (results.length) {
    // 有匹配结果
    // 多结果的提示
    // 移入 ul
    const first = results[0];
    targetEndpoint = extract(target, first);
    // store.usualList.push(toUsual);
    if (targetEndpoint.matcher === first.matcher) {
      // 如果能替换 则替换
      console.log('>>>> first', first, targetEndpoint);
      newState.endpoints = newState.endpoints.filter(
        (v) => v.matcher !== first.matcher
      );
    }
    // targetEndpoint = toUsual;
  }
  if (newState.updatePath) {
    // 如果 trace 了 替换 或者 是在 endpoints 中有结果
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
      store.usualList = store.usualList.filter(
        (ep) => !removePrefixIds.includes(ep.prefixId)
      );
      store.endpoints.push(...newState.endpoints);
    } else {
      store.endpoints = newState.endpoints;
    }
    store.prefixes = newState.prefixes;
  }
  if (!targetEndpoint) {
    // 没有结果 必然是 trace 之后了也无结果
    logger.err('Failed to find!').info('Please give me a more precise name.');
    store.save(() => logger.exit);
  } else {
    if (!newState.inUsual) {
      // 从 endpoints 中找的 尝试 替换出旧节点
      store.endpoints = store.endpoints.filter(
        (v) => v.matcher !== targetEndpoint.matcher
      );
      store.usualList.push(targetEndpoint);
    }
    const targetPath = parseFullPath(targetEndpoint);
    fire(targetPath);
  }
}


module.exports = {
  searchHandler,
  storeCommand,
  storeRootPath,
};
