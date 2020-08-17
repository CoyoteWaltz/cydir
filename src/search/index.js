/*
 * @Author: CoyoteWaltz
 * @Date: 2020-07-13 23:22:06
 * @LastEditTime: 2020-08-15 16:33:42
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: match the best path
 * @TODO: 用户可配置的 fuse 参数！ 尤其是 score
 */

const path = require('path');
const fs = require('fs');

const Fuse = require('fuse.js');

const logger = require('../util/log.js');
const { probe, distance, traceParent } = require('../probe.js');
const { createEndpoint } = require('../store/endpoint.js');
const { fuseOption } = require('./config.js');

const diffThreshold = 0.08;

/**
 * fuzzy match endpoints
 * return results 连续 score 相差不过 threshold 的
 * @param {string} target
 * @param {Array} endpoints
 * @return {endpoint[]}
 */
function scan(target, endpoints, exact = false) {
  console.log('in scan');
  console.log(target);
  console.log(target, endpoints.length);
  console.log(fuseOption);
  console.log('eps: ', endpoints);

  const results = [];
  if (exact) {
    for (const ep of endpoints) {
      const matcher = ep.matcher.split(path.sep);
      if (matcher.includes(target)) {
        results.push(ep);
        break;
      }
    }
  } else {
    const fuse = new Fuse(endpoints, fuseOption);
    const matches = fuse.search(target);
    console.log(matches);
    console.log(matches.length);
    if (matches.length === 0) {
      return [];
    }
    const bestScore = matches[0].score;

    for (const { score, refIndex } of matches) {
      if (score - bestScore > diffThreshold) {
        break;
      }
      results.push(endpoints[refIndex]);
    }
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
 * @param {number} currentDepth - originDepth
 * @param {Array} prefixes modified inside probe
 */
function traceProbe(
  target,
  start,
  { root, currentDepth: originDepth, prefixes: oldPrefixes },
  exact = false
) {
  // prefixes copy 一份 做增量更新 之后替换原来的
  // endpoints 先做原始的过滤 然后在增量
  console.log('ori dep:  ', originDepth);
  let current = traceParent(start); // 从父开始
  let currentDepth = distance(current, root);
  console.log('first depth:   ', currentDepth);
  console.log('current root: ', current, root);
  // TODO
  if (start === root) {
    // 直接跳过下面的循环
    logger.err('start === root');
    currentDepth = 0;
    current = root;
  }
  if (currentDepth === -1) {
    // something wrong
    logger.err('Something wrong...').exit();
  }
  let exclude; // 同时也是 需要更新 endpoints 和 prefixes 的数组
  const addition = {
    endpoints: [],
    prefixes: oldPrefixes.slice(), // copy
    updatePath: '',
    probeDepth: originDepth,
  };

  while (current !== root) {
    console.log('loop:  ', current);
    if (fs.existsSync(current)) {
      // 回溯不存在 继续
      // 需要触达的深度 = 原始深度 - 当前到 root 的深度
      const { endpoints, probeDepth } = probe(
        current,
        originDepth - currentDepth, // probe 到原始深度
        addition.prefixes,
        [exclude] // 只需要去除上一个即可
      );
      // endpoints.shift()
      addition.endpoints.push(...endpoints);
      const results = scan(target, endpoints, exact);
      if (results.length) {
        addition.probeDepth = probeDepth;
        addition.updatePath = current;
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
    const { endpoints, probeDepth } = probe(
      current,
      originDepth, // probe 到原始深度
      addition.prefixes,
      // [exclude]    // 不需要 exclude 还是重来
    );
    results = scan(target, endpoints, exact);
    // addition.endpoints.push(...endpoints);
    // addition.probeDepth = probeDepth > originDepth ? probeDepth : originDepth;
    addition.endpoints = endpoints;
    addition.probeDepth = probeDepth;
    addition.updatePath = root;
  }

  return { results, addition };
}

/**
 * 仅在 traceProbe 搜索成功之后 对 matcher 拆分再次匹配获得精确路径
 * @param {string} target
 * @param {object} result endpoint
 * @param {Array} endpoints
 */
function extract(target, endpoint, exact = false) {
  const matcher = endpoint.matcher;
  const split = matcher.split(path.sep);
  // 这里 split 完 只有1个元素的时候应该可以直接提速 不用 fuse
  if (split.length === 1) {
    return endpoint;
  }
  let preciseId;
  if (exact) {
    logger.notice('exact');
    // exact match
    preciseId = split.indexOf(target);
  } else {
    const fuse = new Fuse(split);
    const res = fuse.search(target);
    preciseId = res[0].refIndex;
  }

  const newEndpoint = createEndpoint(
    endpoint.prefixId,
    split.slice(preciseId, preciseId + 1).join(path.sep),
    split.slice(0, preciseId).join(path.sep)
    // endpoint.fullPath
  );

  return newEndpoint;
}

module.exports = {
  traceProbe,
  scan,
  extract,
};
