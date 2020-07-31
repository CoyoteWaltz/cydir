/*
 * @Author: CoyoteWaltz
 * @Date: 2020-07-13 23:22:06
 * @LastEditTime: 2020-07-31 23:21:45
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: match the best path
 * @TODO: 写一下匹配结果之后的逻辑
 */

const path = require('path');
const fs = require('fs');

const Fuse = require('fuse.js');
// const {  } = require('./util/constants.js')
const { probe, distance, traceParent } = require('./probe.js');

const scoreThreshold = 0.45;
const diffThreshold = 0.08;

/**
 * fuzzy match endpoints
 * return results 连续 score 相差不过 threshold 的
 * @param {string} target
 * @param {Array} endpoints
 */
function scan(target, endpoints) {
  console.log(target, endpoints.length);
  const option = {
    keys: ['matcher'],
    includeScore: true,
    threshold: scoreThreshold, // 这个越低越好 那个算法嘛
  };
  const fuse = new Fuse(endpoints, option);
  const matches = fuse.search(target);
  // console.log(matches);
  console.log(matches.length);
  if (!matches.length) {
    return [];
  }
  const bestScore = matches[0].score;
  let results = [];

  for (const { refIndex, score } of matches) {
    if (score - bestScore > diffThreshold) {
      break;
    }
    results.push(endpoints[refIndex]);
  }

  return results;
}

// 对返回的结果进行字符串拆分 /root/abc/def => root abc def
// 如果长度为 1 就直接拼接 prefix
// 如果能分出数组 再进行 fuse 搜索
// 得到下标 join 回去 拼接 prefix

// match 到之后 但是 路径不存在 做的事情 回溯 probe
// 逐级回溯 搜索 如果无 继续回溯 同时 exclude list 中加入上一个回溯的层 后续的
/**
 *
 * @param {string} target
 * @param {string} start - search start path
 * @param {string} root - stop at root
 * @param {number} originDepth
 */
function traceProbe(target, start, root, originDepth) {
  let current = traceParent(start); // 从父开始
  let currentDepth = distance(current, root);
  console.log('first depth:   ', currentDepth);
  console.log('current root: ', current, root);
  // TODO
  if (currentDepth === -1) {
    // 直接跳过下面的循环
    logger.err('其实是出错的');
    current = root;
  }
  let exclude; // 同时也是 需要更新 endpoints 和 prefixes 的数组
  const addition = {
    endpoints: [],
    prefixes: [],
    updatedPath: '',
    probeDepth: originDepth,
  };
  while (current !== root) {
    if (fs.existsSync(current)) {
      // 回溯不存在 继续
      // 需要触达的深度 = 原始深度 - 当前到 root 的深度
      const { endpoints, prefixes, probeDepth } = probe(
        current,
        originDepth - currentDepth, // probe 到原始深度
        [exclude] // 只需要去除上一个即可
      );

      addition.endpoints.push(...endpoints);
      addition.prefixes.push(...prefixes);
      const results = scan(target, endpoints);
      if (results.length) {
        addition.probeDepth = probeDepth;
        addition.updatedPath = current;
        console.log('found!!!!!');
        return { results, addition };
      }
      exclude = current;
    }
    current = traceParent(current);
    --currentDepth;
    console.log('next while deppppth  ', currentDepth);
  }
  let results = [];
  if (current === root) {
    // 到头了还没
    // 重新 probe 到 originDepth !!
    console.log('reach root!!');
    const { endpoints, prefixes, probeDepth } = probe(
      current,
      originDepth // probe 到原始深度
    );
    results = scan(target, endpoints);
    addition.endpoints = endpoints;
    addition.prefixes = prefixes;
    addition.probeDepth = probeDepth;
    addition.updatedPath = root;
  }

  return { results, addition };
}

module.exports = {
  traceProbe,
  scan,
};
