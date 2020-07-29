/*
 * @Author: CoyoteWaltz
 * @Date: 2020-07-13 23:22:06
 * @LastEditTime: 2020-07-29 23:47:16
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: match the best path
 */

const Fuse = require('fuse.js');
const store = require('./store.js');
const path = require('path');
const fs = require('fs')

const scoreThreshold = 0.45;
const diffThreshold = 0.08;

/**
 * fuzzy match endPoints
 * return results 连续 score 相差不过 threshold 的
 * @param {string} target
 * @param {Array} endPoints
 */
function scan(target, endPoints) {
  console.log(target, endPoints.length);
  const option = {
    keys: ['matcher'],
    includeScore: true,
    threshold: scoreThreshold, // 这个越低越好 那个算法嘛
  };
  // const fuse = new Fuse(endPoints, option);
  const fuse = new Fuse(endPoints, option);
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
    results.push(endPoints[refIndex]);
  }

  return results;
}

// 对返回的结果进行字符串拆分 /root/abc/def => root abc def
// 如果长度为 1 就直接拼接 prefix
// 如果能分出数组 再进行 fuse 搜索
// 得到下标 join 回去 拼接 prefix

const target = 'test omp';
const { prefixes, endPoints } = store;
console.log(endPoints.length);

const results = scan(target, endPoints);
console.log(
  '-------',
  results.map((v) => {
    return {
      prefix: prefixes[v.prefixId],
      // full: path.resolve(prefixes[v.prefixId], v.matcher),
      exists: fs.existsSync(path.resolve(prefixes[v.prefixId], v.matcher)),
      ...v,
    };
  })
);




/**
 * 从匹配成功但是不存在的路径回溯 更新
 *
 */
function traceProbe(abc) {}


// TODO
// match 到之后 但是 路径不存在 做的事情 回溯 probe
// 逐级回溯 搜索 如果无 继续回溯 同时 exclude list 中加入上一个回溯的层 后续的
// 都是深入到原始深度 直接拿 Config 的
// const start = 'failedPath'; // -> 直接拿节点的 prefix 如果不是节点(usualList 中) 就是字符串的 path.dirname()
// const root = 'root';
// let current = start;

// let matchFailed = !true;
// // let traceDepth = 0;       // 回溯的次数 不用了。。。直接用 currentDepth
// let originDepth = 4; // cfg 的 currentPath
// let currentDepth = originDepth; //  这里搞个算法: distance(start, root)
// let parent;
// const excludes = [];  // 同时也是 需要更新 endpoints 和 prefixes 的数组
// if (currentDepth === -1) {
//   // 直接跳过下面的循环
//   logger.err('其实是出错的')
//   parent = root;
// }
// while (matchFailed && parent !== root ) {
//   --currentDepth;
//   parent = traceParent(current);
//   if (!fs.existsSync(parent)) {
//     // 回溯不存在 继续
//     continue;
//   }
//   // 需要触达的深度 = 原始深度 - 当前到 root 的深度
//   const res = probe(parent, originDepth - currentDepth, excludes);
//   matchFailed = match(res);  // TODO
//   excludes.push(parent);
// }
// if (parent === root) {
//   // 到头了还没
//   // 重新 probe MAX_PROBE_DEPTH 不 到 originDepth !!
// }