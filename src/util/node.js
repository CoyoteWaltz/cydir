/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-24 01:36:41
 * @LastEditTime: 2020-07-24 02:22:50
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: utils for path node
 */ 


// 工厂函数吧 可能之后会单独抽出一个模块来处理 node 相关
const emptyNode = (filePath, curDepth = 0) => {
  return { name: filePath, depth: curDepth, children: [] };
};

const getChildrenName = (node) => {
  if (node && node.children) {
    return node.children.map(v => v.name)
  }
  return []
}

module.exports = {
  emptyNode,
  getChildrenName
}
