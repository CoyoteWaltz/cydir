/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-24 01:36:41
 * @LastEditTime: 2020-08-19 22:55:10
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: utils for path node
 * @TODO:
 */

const path = require('path');

// 工厂函数吧 可能之后会单独抽出一个模块来处理 node 相关
function createEndpoint(prefixId, matcher, middle = '', fullPath = '') {
  const endpoint = { prefixId, matcher };
  if (middle) {
    endpoint.middle = middle;
  }
  if (fullPath) {
    endpoint.fullPath = fullPath;
  }
  return endpoint;
}

// 获得一系列 Node 的 matcher
function getMatchers(points) {
  return points.map((v) => v.matcher);
}

/**
 *
 * @param {object} endpoint
 */
function parseFullPath({ prefixId, middle, matcher }, prefixes) {
  prefixes = prefixes || require('./index.js').prefixes;
  return path.join(prefixes[prefixId], middle || '', matcher);
}

module.exports = {
  createEndpoint,
  getMatchers,
  parseFullPath,
};
