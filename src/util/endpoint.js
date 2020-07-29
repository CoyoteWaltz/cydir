/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-24 01:36:41
 * @LastEditTime: 2020-07-29 23:45:39
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: utils for path node
 * @TODO:
 */

// 工厂函数吧 可能之后会单独抽出一个模块来处理 node 相关
function createEndpoint(prefixId, matcher, fullPath) {
  // TODO delete full path
  return { prefixId, matcher, fullPath };
}

// function getChildrenName(node) {
//   if (node && node.children) {
//     return node.children.map((v) => v.name);
//   }
//   return [];
// }

// 获得一系列 Node 的 matcher
function getMatchers(points) {
  return points.map((v) => v.matcher);
}

module.exports = {
  createEndpoint,
  getMatchers,
};
