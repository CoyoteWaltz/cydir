/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-04 23:10:29
 * @LastEditTime: 2020-08-17 22:14:11
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const match = require('./match.js');
const store = require('../store');
const logger = require('../util/log.js');
const { extract } = require('../search');
const { parseFullPath } = require('../store/endpoint.js');
const { fire } = require('./command.js');
const { checkAbsPath } = require('../probe.js');

function storeCommand(cmd) {
  store.command = cmd;
}

function storeRootPath(root) {
  store.root = root;
}

function searchHandler(target, confirm, { exact }) {
  if (!store.checkTypes()) {
    return;
  }
  if (checkAbsPath(target)) {
    return fire(target, confirm);
  }
  let targetEndpoint;
  const newState = match(target, { exact });
  const results = newState.results;
  console.log('--------', newState);
  store.currentDepth = newState.newDepth;
  if (newState.inUsual) {
    // 从 ul 匹配的 直接 fire
    targetEndpoint = results[0];
  } else if (results.length) {
    // 有匹配结果
    // 多结果的提示
    // 移入 ul
    const first = results[0];
    targetEndpoint = extract(target, first, exact);
    if (targetEndpoint.matcher === first.matcher) {
      // 如果能替换 则替换
      newState.endpoints = newState.endpoints.filter(
        (v) => v.matcher !== first.matcher
      );
    }
  }
  if (newState.updatePath) {
    logger.err('updatePath!');
    // 如果 trace 了 替换 或者 是在 endpoints 中有结果
    if (newState.updatePath !== store.root) {
      // 必须判断是否为 root 不然会多留一个
      logger.err('not root');
      const filterFn = (ep) =>
      !parseFullPath(ep, store.prefixes).startsWith(newState.updatePath);
      
      // 过滤在更新的路径下的目录 endpoints
      store.endpoints = store.endpoints.filter(filterFn);
      store.usualList = store.usualList.filter(filterFn);
      store.endpoints.push(...newState.endpoints);
    } else {
      store.endpoints = newState.endpoints;
      store.usualList = []; // reset
    }
    store.prefixes = newState.prefixes;
  }
  if (!targetEndpoint) {
    // 没有结果 必然是 trace 之后了也无结果
    logger.err('Failed to find!').info('Please give me a more precise name.');
    store.save(logger.exit);
  } else {
    if (!newState.inUsual) {
      // 从 endpoints 中找的 尝试 替换出旧节点
      store.endpoints = store.endpoints.filter(
        (v) => v.matcher !== targetEndpoint.matcher
      );
      store.usualList.push(targetEndpoint);
    }
    const targetPath = parseFullPath(targetEndpoint);
    fire(targetPath, confirm);
  }
}

function resetHandler() {
  store.reset();
}

module.exports = {
  searchHandler,
  resetHandler,
  storeCommand,
  storeRootPath,
};
