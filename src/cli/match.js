/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-02 14:20:53
 * @LastEditTime: 2020-08-19 21:44:02
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: realization of matching strategy
 * @TODO: 异步的去做这个逻辑 还是 配置化？
 */
const { scan, traceProbe } = require('../search');
const { parseFullPath } = require('../store/endpoint.js');
const store = require('../store');
const fs = require('fs');
const { probe } = require('../probe.js');
const logger = require('../util/log');

// 开始 scan usualList
//   找到结果是 endpoint -> 送去 parse -> 送去 fire
//   为空 -> 去 endpoints 去 scan

function handleTrace(traceRes, state) {
  state.prefixes = traceRes.addition.prefixes;
  state.endpoints = traceRes.addition.endpoints;
  state.updatePath = traceRes.addition.updatePath;
  // 深度的更新只有 溯源的时候才更新
  state.newDepth =
    state.updatePath === store.root
      ? traceRes.addition.probeDepth
      : state.newDepth;
  const results = traceRes.results;
  if (results.length) {
    const res = preFire(results, state.prefixes);
    if (res) {
      logger.info('回溯成功!!');
      state.results = res;
      return true;
    }
  }
  return false;
}
/**
 *
 * @param {string} target
 * @returns {object} state
 */
function match(target, { exact }) {
  const state = {
    inUsual: false,
    newDepth: store.currentDepth,
    prefixes: [],
    endpoints: [],
    results: [],
    updatePath: '',
  };
  let results = scan(target, store.usualList, exact);
  if (results.length) {
    // ul 有匹配结果
    const res = preFire(results);
    if (res) {
      // 不用更新
      state.inUsual = true;
      state.results = res;
      logger.err('ul 中直接找到');
      return state;
    } else {
      // 路径不存在
      logger.err('ul 中 路径不存在');
      const traceRes = traceProbe(
        target,
        parseFullPath(results[0]),
        store,
        exact
      );
      // 回溯成功 这里路径必然存在 更新 store.prefix store.endpoints
      // traceRes.addition
      // 处理 增量
      if (handleTrace(traceRes, state)) {
        return state;
      }
      logger.err('trace 了也失败');
      console.log(state);
      // 回溯失败 则落到这个 if 之外
    }
  } else {
    // 未匹配到 去 endpoints 匹配
    logger.err('未匹配到 去 endpoints 匹配');
    results = scan(target, store.endpoints, exact);
    if (results.length) {
      // 匹配成功
      const res = preFire(results);
      if (res) {
        // 路径存在 移入 ul
        state.results = res;

        return state;
      }
      logger.err('ep 中 路径不存在');
      // 路径不存在 TODO 这里和上面一样了
      const traceRes = traceProbe(
        target,
        parseFullPath(results[0]),
        store,
        exact
      );
      // 回溯成功 更新 store.prefix store.endpoints
      // traceRes.addition
      // 处理 增量
      if (handleTrace(traceRes, state)) {
        return state;
      }
    } else {
      // 匹配失败 从 root 全量更新
      logger.err(
        '匹配失败 从 root 全量更新' + ` currentDepth: ${store.currentDepth}`
      );
      const traceRes = traceProbe(target, store.root, store, exact);
      // 路径存在 这里路径必须存在
      if (handleTrace(traceRes, state)) {
        return state;
      }
      // 全量失败 则落到这个 if 之外
    }
  }
  logger.err('oops 此时是 trace 之后 或者 endpoints 中 scan 之后');

  // oops 此时是 trace 之后 或者 endpoints 中 scan 之后
  // 这两者都失败了 但是 trace 已经更新了全部
  // 此时 对于 所有的 增量 endpoints 都进行 深入 3
  if (state.endpoints.length) {
    console.log('---------------');
    console.log(state);
    console.log('---------------');
    let maxDepth = 0;
    const endpoints = state.endpoints.slice();
    // state.endpoints = []
    for (let i = 0; i < endpoints.length; ++i) {
      const endpoint = endpoints[i];
      const fullPath = parseFullPath(endpoint, state.prefixes);

      const { endpoints: newEps, probeDepth } = probe(
        fullPath,
        2,
        state.prefixes
      );
      // console.log('>>>> depth', fullPath, probeDepth);
      if (maxDepth < probeDepth) {
        maxDepth = probeDepth;
      }
      results = scan(target, newEps, exact);
      // console.log('<<<<<<<<<<>>>>>>>>');
      // console.log(newEps);
      // console.log('<<<<<<<<<<>>>>>>>>');
      // console.log(state.endpoints);
      newEps.shift()
      // state.endpoints.splice(i, 1);
      state.endpoints.push(...newEps);
      if (results.length) {
        state.newDepth += maxDepth;
        state.results = results;
        return state; // 找到就不继续了
      }
    }
    logger.err('not found');
    state.newDepth += maxDepth;
  }
  return state;
}
// 放到外面去做
// 更新 store 的 currentDepth prefixes endpoints usualList

// 如果结果有多个路径 过滤一遍存在的路径 如果数量仍 > 1 提示用户选择 TODO
/**
 *
 * @param {Array} results endpoints[]
 */
function preFire(results, prefixes) {
  const filtered = results.filter((ep) => {
    const fullPath = parseFullPath(ep, prefixes);
    return fs.existsSync(fullPath);
  });
  if (filtered.length >= 1) {
    console.log('yes! fire! ', filtered);
    return filtered;
  }
  return false;
}

module.exports = match;
