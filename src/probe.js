/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-22 21:34:11
 * @LastEditTime: 2020-08-20 01:23:14
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: utils for path node
 */

const path = require('path');
const fs = require('fs');

const { createEndpoint } = require('./store/endpoint.js');
const { MAX_PROBE_DEPTH, BLACKLIST } = require('./util/constants.js');

function checkAbsPath(target) {
  if (!fs.existsSync(target)) {
    return false;
  }
  const stat = fs.statSync(target);
  return path.isAbsolute(target) && stat.isDirectory();
}

function getCfgPath() {
  const globalPath = path.resolve(
    process.env.HOME || process.env.USERPROFILE || __dirname, //  直接拿的 环境变量 HOME
    '.cydir.config.json'
  );

  return globalPath;
}

// 以 absPath 为 root maxDepth 为最大深度的 所有 endpoints
// 加入 exclude
/**
 *
 * @param {string} absPath
 * @param {number} maxDepth 到根的距离
 * @param {Array} prefixes modified inside!
 * @param {Array} excludes
 * @returns {object}
 */
function probe(absPath, maxDepth, prefixes, excludes = []) {
  maxDepth = maxDepth || MAX_PROBE_DEPTH;
  // 递归遍历目录 到达一定深度结束 返回 tree 节点结果
  // 接受参数 绝对路径
  const endpoints = [];
  let probeDepth = 0;
  if (!fs.existsSync(absPath)) {
    return { endpoints, prefixes, probeDepth };
  }
  function genPrefixId(filePath, matcher) {
    const prefix = filePath.slice(0, filePath.lastIndexOf(matcher));
    let prefixId = prefixes.lastIndexOf(prefix);
    if (prefixId < 0) {
      prefixId = prefixes.push(prefix) - 1;
    }
    return prefixId;
  }

  function walk(filePath, curDepth = 0, chain = '', excludes = []) {
    // excludes absPath 的数组
    const matcher = path.join(chain, path.basename(filePath));
    if (curDepth === maxDepth) {
      probeDepth = maxDepth;
      endpoints.push(createEndpoint(genPrefixId(filePath, matcher), matcher));
      return;
    }
    try {
      const subPaths = fs
        .readdirSync(filePath)
        .filter((value) => !BLACKLIST.includes(value))
        .map((value) => path.resolve(filePath, value))
        .filter((value) => {
          if (excludes.length && excludes.includes(value)) {
            return false;
          }
          if (fs.existsSync(value)) {
            const stat = fs.statSync(value);
            return stat.isDirectory();
          }
        });

      if (!subPaths.length) {
        probeDepth = curDepth > probeDepth ? curDepth : probeDepth;
        endpoints.push(createEndpoint(genPrefixId(filePath, matcher), matcher));
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
      // ignore this error walk
      // console.log(e);
      return;
    }
  }

  walk(absPath, 0, '', excludes); // chain 传 ''
  return {
    endpoints,
    probeDepth,
  };
}

// path.isAbsolute()
const traceParent = (absPath) => {
  return path.dirname(absPath);
};

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

module.exports = {
  traceParent,
  getCfgPath,
  probe,
  distance,
  checkAbsPath,
};
