/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-22 21:34:11
 * @LastEditTime: 2020-07-28 00:16:14
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: utils for path node
 */

const path = require('path');
const fs = require('fs');
// const { diffArrays } = require('./chores.js');
const { createEndpoint } = require('./endpoint.js');

const { MAX_PROBE_DEPTH, BLACKLIST } = require('./constants.js');
const logger = require('./log.js');

// const data = require('../../paths.json');

// TODO
function getCfgPath() {
  // for debug
  const tmpPath = path.resolve(__dirname, '../../prefixtmp.json');

  const glbPth = path.resolve(
    process.env.HOME || process.env.USERPROFILE || __dirname, //  直接拿的 环境变量 HOME
    '.__cydir.config.json'
  );

  console.log('------ global path: ', tmpPath);
  console.log(
    '------ global path: ',
    process.env.HOME || process.env.USERPROFILE || __dirname
  );
  console.log('------ global path: ', glbPth);

  return tmpPath;
}

// 以 absPath 为 root maxDepth 为最大深度的 所有 endpoints
// 加入 exclude
/**
 *
 * @param {string} absPath
 * @param {number} maxDepth 到根的距离
 */
function probe(absPath, maxDepth, excludes = []) {
  // return [Endpoints[], prefix[]]
  maxDepth = maxDepth || MAX_PROBE_DEPTH;
  // 递归遍历目录 到达一定深度结束 返回 tree 节点结果
  // 接受参数 绝对路径
  const endPoints = [];
  const prefixes = [];
  let probeDepth = 0;
  if (!fs.existsSync(absPath)) {
    return [endPoints, prefixes];
  }
  function genPrefixId(filePath) {
    const prefix = path.dirname(filePath);
    let prefixId = prefixes.lastIndexOf(prefix);
    if (prefixId < 0) {
      prefixId = prefixes.push(prefix) - 1;
    }
    return prefixId;
  }

  function walk(filePath, curDepth = 0, chain = '', excludes = []) {
    // excludes absPath 的数组
    const basename = path.basename(filePath);
    const matcher = path.join(chain, basename);
    if (curDepth === maxDepth) {
      probeDepth = maxDepth;
      endPoints.push(createEndpoint(genPrefixId(filePath), matcher));
      return;
    }
    try {
      const subPaths = fs
        .readdirSync(filePath)
        .filter((value) => !BLACKLIST.includes(value))
        .map((value) => path.resolve(filePath, value)) // 转 abs path
        .filter((value) => !excludes.includes(value)) // TODO 这一步可能要在想想
        .filter((value) => fs.statSync(value).isDirectory());
      if (!subPaths.length) {
        probeDepth = curDepth > probeDepth ? curDepth : probeDepth;
        endPoints.push(createEndpoint(genPrefixId(filePath), matcher));
        return;
      }
      // 第一个给 chain
      walk(subPaths.shift(), curDepth + 1, matcher);
      if (subPaths.length) {
        subPaths.forEach((value) => {
          walk(value, curDepth + 1, '');
        });
      }
    } catch (e) {
      logger.err(e);
      // ignore this error walk
      return;
    }
  }
  walk(absPath, 0, '', excludes); // chain 传 ''
  console.log('probe depth: ', probeDepth);
  return {
    endPoints,
    prefixes,
    probeDepth,
  };
}

// const res = probe('/Users/koyote/programming', 2);
// console.log(res);

// // get all nodes of the layer
// const getLayer = (root, depth = 1) => {
//   const queue = [root];
//   while (depth) {
//     for (let i = queue.length; i > 0; --i) {
//       const node = queue.shift();
//       queue.push(...node.children);
//     }
//     depth--;
//   }
//   return queue;
// };

// const res = getLayer(data, 2);
// console.log('res: ', res);

const serialize = (tree) => {
  const res = [...(tree.children || []).flatMap(serialize), tree];
  delete tree.children;
  return res;
};

// path.isAbsolute()
const traceParent = (absPath) => {
  // return absPath.slice(0, absPath.lastIndexOf(path.sep));
  return path.dirname(absPath);
};

// current: /root/a /b/c/d/e/f
//  target: /root/a /g/c
// => -1
// current: /root/a/b/c/d/e/f
//  target: /root/a/b/c
// => 3  /d/e/f
/**
 *
 * all abs paths
 * @param {string} current
 * @param {string} target
 */
const distance = (current, target) => {
  const sep = path.sep;
  const sub = current.split(target);
  if (sub.length === 1) {
    return -1;
  }
  if (!sub[1]) {
    return 0;
  }
  return sub[1].trim(sep).split(sep).length - +(sub[1][0] === sep); // in case: /root/a/ /root/a/b
};
// let rroot = '/root/a/b/c/d/e';
// let sssub = '/root/a/b/c/d/e/d/f/s/f/s';
// console.log(distance(sssub, rroot));

// TODO
// match 到之后 但是 路径不存在 做的事情 回溯 probe
// 逐级回溯 搜索 如果无 继续回溯 同时 exclude list 中加入上一个回溯的层 后续的
// 都是深入到原始深度 直接拿 Config 的
const start = 'failedPath'; // -> 直接拿节点的 prefix 如果不是节点(usualList 中) 就是字符串的 path.dirname()
const root = 'root';
let current = start;

let matchFailed = !true;
// let traceDepth = 0;       // 回溯的次数 不用了。。。直接用 currentDepth
let originDepth = 4; // cfg 的 currentPath
let currentDepth = originDepth; //  这里搞个算法: distance(start, root)
let parent;
const excludes = [];  // 同时也是 需要更新 endpoints 和 prefixes 的数组
if (currentDepth === -1) {
  // 直接跳过下面的循环
  logger.err('其实是出错的')
  parent = root;
}
while (matchFailed && parent !== root ) {
  --currentDepth;
  parent = traceParent(current);
  if (!fs.existsSync(parent)) {
    // 回溯不存在 继续
    continue;
  }
  // 需要触达的深度 = 原始深度 - 当前到 root 的深度
  const res = probe(parent, originDepth - currentDepth, excludes);
  matchFailed = match(res);
  excludes.push(parent);
}
if (parent === root) {
  // 到头了还没
  // 重新 probe MAX_PROBE_DEPTH
}



// 返回 父节点路径 断层数 i.e trace 失败的次数
// 到 root path 的时候停止 root path 的有效性交给外面去判断
// const traceExistParent = (absPath, rootPath) => {
//   if (!rootPath) {
//     // TODO 这里改成 log err
//     throw new Error('No root path config!');
//   }
//   let count = 0;
//   let parent = traceParent(absPath);
//   while (!fs.existsSync(parent) && parent !== rootPath) {
//     parent = traceParent(parent);
//     count++;
//   }
//   return { parentPath: parent, failCount: count };
// };

// const rres = traceExistParent(
//   '/sss/vvv/ccc/sdsfa/sdfsdaf/fsds',
//   '/sss/vvv/ccc'
// );
// console.log(rres);

// const res = probe('/Users/koyote/programming', data);
// console.log(res);

// const res = serialize(data);
// console.log(res[res.length - 1].name, traceParent(res[res.length - 1].name));
// console.log(res);

// 验证 prefix
const { prefixes, endPoints } = require('../../prefixtmp.json');
const { match } = require('assert');

endPoints.forEach(({ prefixId, matcher }) => {
  const fullPath = path.join(prefixes[prefixId], path.basename(matcher));
  // console.log(fullPath);
  if (!fs.statSync(fullPath).isDirectory()) {
    logger.err(fullPath);
  }
});

module.exports = {
  // serialize,
  // traceParent,
  getCfgPath,
  // traceExistParent,
  probe,
};
